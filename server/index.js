import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-User-Email', 'X-User-Name'],
  credentials: true
}));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Multer Configuration ───────────────────────────────────────────

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads', 'profile-photos'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Hanya JPG, JPEG, dan PNG yang diizinkan.'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } });

// ─── Member Registrations ───────────────────────────────────────────

app.get('/api/member-registrations', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone, birth_date, gender, address, organization, education, school, motivation, agree_terms, status, submitted_at FROM member_registrations ORDER BY submitted_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Failed to load member registrations:', error);
    res.status(500).json({ error: 'Gagal memuat pendaftaran anggota.' });
  }
});

app.post('/api/member-registrations', async (req, res) => {
  try {
    const {
      full_name, email, phone, birth_date, gender, address, organization,
      education, school, motivation, agree_terms,
    } = req.body;

    if (!full_name || !email || !phone || !birth_date || !gender || !address || !organization) {
      return res.status(400).json({ error: 'Data pendaftaran tidak lengkap.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format email tidak valid.' });
    }

    const phoneRegex = /^[0-9+\-\s()]{8,20}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Format nomor telepon tidak valid.' });
    }

    const id = crypto.randomUUID();
    const now = new Date();
    const submittedAt = now.toISOString().slice(0, 19).replace('T', ' ');
    await pool.execute(
      `INSERT INTO member_registrations
        (id, full_name, email, phone, birth_date, gender, address, organization, education, school, motivation, agree_terms, status, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, full_name, email, phone, birth_date, gender, address, organization,
        education || null, school || null, motivation || null,
        agree_terms ? 1 : 0, 'pending', submittedAt,
      ]
    );

    res.status(201).json({ id });
  } catch (error) {
    console.error('Failed to save member registration:', error);
    res.status(500).json({ error: 'Gagal menyimpan data pendaftaran ke database.' });
  }
});
app.patch('/api/member-registrations/:id/status', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid.' });
    }

    const [result] = await connection.execute(
      'UPDATE member_registrations SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' });
    }

    // Jika disetujui, otomatis buat akun + data anggota
    if (status === 'approved') {
      // Ambil data pendaftaran
      const [regs] = await connection.execute(
        'SELECT * FROM member_registrations WHERE id = ?',
        [id]
      );

      if (regs.length > 0) {
        const reg = regs[0];
        const accountId = uuidv4();
        const defaultPassword = 'ipnuippnu123';
        const passwordHash = await bcrypt.hash(defaultPassword, 10);

        // Cek apakah akun sudah ada
        const [existing] = await connection.execute(
          'SELECT id FROM created_accounts WHERE registration_id = ?',
          [id]
        );

        if (existing.length === 0) {
          // Buat akun login otomatis
          await connection.execute(
            `INSERT INTO created_accounts 
              (id, registration_id, full_name, email, password_hash, phone, organization, role)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [accountId, reg.id, reg.full_name, reg.email, passwordHash, reg.phone, reg.organization, 'user']
          );
        }
      }
    }

    connection.release();
    res.json({ success: true });
  } catch (error) {
    connection.release();
    console.error('Failed to update member registration status:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email ini sudah memiliki akun.' });
    }
    res.status(500).json({ error: 'Gagal memperbarui status pendaftaran.' });
  }
});
// GET /api/check-registration - Cek status pendaftaran by email (public)
app.get('/api/check-registration', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email diperlukan.' });
    }

    const [rows] = await pool.query(
      'SELECT full_name, organization, submitted_at, status FROM member_registrations WHERE email = ?',
      [email]
    );

    console.log('🔍 [CHECK-REGISTRATION] Raw database result for email:', email);
    console.log('📊 [CHECK-REGISTRATION] Database rows:', rows);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' });
    }

    const registration = rows[0];
    console.log('✅ [CHECK-REGISTRATION] Returning submitted_at:', registration.submitted_at);
    
    res.json({
      full_name: registration.full_name,
      organization: registration.organization,
      submitted_at: registration.submitted_at,
      status: registration.status
    });
  } catch (error) {
    console.error('Failed to check registration:', error);
    res.status(500).json({ error: 'Gagal memeriksa status pendaftaran.' });
  }
});

// ─── Created Accounts ───────────────────────────────────────────────

app.get('/api/created-accounts', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, registration_id, full_name, email, phone, organization, role, created_at FROM created_accounts ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Failed to load created accounts:', error);
    res.status(500).json({ error: 'Gagal memuat daftar akun.' });
  }
});

app.post('/api/created-accounts/approve', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { registration_id, password, role } = req.body;

    if (!registration_id || !password) {
      return res.status(400).json({ error: 'Data tidak lengkap.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter.' });
    }

    const [registrations] = await connection.query(
      'SELECT id, full_name, email, phone, organization FROM member_registrations WHERE id = ? AND status = ?',
      [registration_id, 'pending']
    );

    if (registrations.length === 0) {
      return res.status(404).json({ error: 'Pendaftaran tidak ditemukan atau sudah diproses.' });
    }

    const reg = registrations[0];
    const accountId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    await connection.execute(
      `INSERT INTO created_accounts (id, registration_id, full_name, email, password_hash, phone, organization, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [accountId, registration_id, reg.full_name, reg.email, passwordHash, reg.phone, reg.organization, role || 'user']
    );

    await connection.execute(
      'UPDATE member_registrations SET status = ? WHERE id = ?',
      ['approved', registration_id]
    );

    connection.release();

    res.status(201).json({
      id: accountId,
      full_name: reg.full_name,
      email: reg.email,
      phone: reg.phone,
      password,
      message: 'Akun berhasil dibuat.',
    });
  } catch (error) {
    connection.release();
    console.error('Failed to approve registration:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email ini sudah memiliki akun.' });
    }
    res.status(500).json({ error: 'Gagal menyetujui pendaftaran.' });
  }
});

app.post('/api/created-accounts/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password baru diperlukan.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter.' });
    }

    const [accounts] = await pool.query(
      'SELECT id FROM created_accounts WHERE email = ?',
      [email]
    );

    if (accounts.length === 0) {
      return res.status(404).json({ error: 'Akun tidak ditemukan.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.execute(
      'UPDATE created_accounts SET password_hash = ? WHERE email = ?',
      [passwordHash, email]
    );

    res.json({ success: true, message: 'Password berhasil direset.' });
  } catch (error) {
    console.error('Failed to reset password:', error);
    res.status(500).json({ error: 'Gagal mereset password.' });
  }
});

// ─── User Profile ───────────────────────────────────────────────────

// GET /api/user/profile - Get user profile by user ID
app.get('/api/user/profile', async (req, res) => {
  try {
    const { userId } = req.query;
    console.log('=== PROFILE API DEBUG ===');
    console.log('Received userId:', userId);
    console.log('userId type:', typeof userId);

    if (!userId) {
      console.log('ERROR: userId is missing');
      return res.status(400).json({ error: 'User ID diperlukan.' });
    }

    console.log('Querying database for userId:', userId);
    const [users] = await pool.query(
      'SELECT id, full_name, email, phone, foto_url, organization, role, created_at FROM created_accounts WHERE id = ?',
      [userId]
    );

    console.log('Query result:', users);
    console.log('Number of users found:', users.length);

    if (users.length === 0) {
      console.log('ERROR: User not found in database');
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    console.log('SUCCESS: Returning user data:', users[0]);
    console.log('=== END PROFILE API DEBUG ===');
    res.json(users[0]);
  } catch (error) {
    console.error('Failed to load user profile:', error);
    res.status(500).json({ error: 'Gagal memuat data profil.' });
  }
});

// PUT /api/user/profile - Update user profile
app.put('/api/user/profile', async (req, res) => {
  try {
    const { userId, full_name, phone } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan.' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM created_accounts WHERE id = ?',
      [userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    const updates = [];
    const values = [];

    if (full_name) {
      updates.push('full_name = ?');
      values.push(full_name);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Tidak ada data yang diperbarui.' });
    }

    values.push(userId);
    await pool.execute(
      `UPDATE created_accounts SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [updated] = await pool.query(
      'SELECT id, full_name, email, phone, foto_url, organization, role, created_at FROM created_accounts WHERE id = ?',
      [userId]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error('Failed to update user profile:', error);
    res.status(500).json({ error: 'Gagal memperbarui profil.' });
  }
});

// POST /api/user/profile/photo - Upload profile photo
app.post('/api/user/profile/photo', (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Ukuran file maksimal 2MB.' });
      }
      return res.status(400).json({ error: 'Gagal mengunggah file.' });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada file yang diunggah.' });
    }

    const [existing] = await pool.query('SELECT id FROM created_accounts WHERE id = ?', [userId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    const fotoUrl = `/uploads/profile-photos/${req.file.filename}`;

    await pool.execute('UPDATE created_accounts SET foto_url = ? WHERE id = ?', [fotoUrl, userId]);

    const [updated] = await pool.query(
      'SELECT id, full_name, email, phone, foto_url, organization, role, created_at FROM created_accounts WHERE id = ?',
      [userId]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error('Failed to upload profile photo:', error);
    res.status(500).json({ error: 'Gagal mengunggah foto profil.' });
  }
});

// ─── Members List (Daftar Anggota) ─────────────────────────────────

// GET /api/members - Ambil daftar semua anggota terdaftar
app.get('/api/members', async (req, res) => {
  try {
    const { search, organisasi } = req.query;
    let query = `
      SELECT ca.id, ca.full_name, ca.email, ca.phone, ca.foto_url, ca.organization, ca.created_at, mr.address
      FROM created_accounts ca
      LEFT JOIN member_registrations mr ON ca.registration_id = mr.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND ca.full_name LIKE ?';
      params.push(`%${search}%`);
    }
    if (organisasi && ['IPNU', 'IPPNU'].includes(organisasi)) {
      query += ' AND ca.organization = ?';
      params.push(organisasi);
    }

    query += ' ORDER BY ca.full_name ASC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Failed to load members:', error);
    res.status(500).json({ error: 'Gagal memuat data anggota.' });
  }
});

// ─── Activities ─────────────────────────────────────────────────────

// Helper: hitung status otomatis berdasarkan tanggal
function computeActivityStatus(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activityDate = new Date(dateStr);
  if (activityDate > today) return 'upcoming';
  if (activityDate.toDateString() === today.toDateString()) return 'ongoing';
  return 'completed';
}

// GET /api/activities - List semua kegiatan dengan filter
app.get('/api/activities', async (req, res) => {
  try {
    const { status, type, search } = req.query;
    let query = 'SELECT * FROM activities WHERE 1=1';
    const params = [];

    if (status && ['upcoming', 'ongoing', 'completed'].includes(status)) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (type && ['MAKESTA', 'LAKMUD', 'PELATIHAN', 'BAKSOS', 'LAINNYA'].includes(type)) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY date DESC';

    const [rows] = await pool.query(query, params);

    // Update status otomatis berdasarkan tanggal
    const updatedRows = rows.map((row) => {
      const autoStatus = computeActivityStatus(row.date);
      if (autoStatus !== row.status) {
        return { ...row, status: autoStatus };
      }
      return row;
    });

    res.json(updatedRows);
  } catch (error) {
    console.error('Failed to load activities:', error);
    res.status(500).json({ error: 'Gagal memuat data kegiatan.' });
  }
});

// GET /api/activities/:id - Detail kegiatan
app.get('/api/activities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM activities WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan.' });
    }

    const activity = rows[0];
    const autoStatus = computeActivityStatus(activity.date);
    if (autoStatus !== activity.status) {
      await pool.execute('UPDATE activities SET status = ? WHERE id = ?', [autoStatus, id]);
      activity.status = autoStatus;
    }

    res.json(activity);
  } catch (error) {
    console.error('Failed to load activity detail:', error);
    res.status(500).json({ error: 'Gagal memuat detail kegiatan.' });
  }
});

// POST /api/activities - Tambah kegiatan (admin only)
app.post('/api/activities', async (req, res) => {
  try {
    const { title, type, description, date, location, quota, image } = req.body;

    // Log incoming request for debugging
    console.log('Received POST /api/activities:', {
      title,
      type,
      description: description?.substring(0, 50),
      date,
      location,
      quota,
      image: image?.substring(0, 50),
      bodyKeys: Object.keys(req.body),
      bodyType: typeof req.body
    });

    // Validate required fields
    const missingFields = [];
    if (!title || typeof title !== 'string' || title.trim() === '') missingFields.push('title');
    if (!type || typeof type !== 'string') missingFields.push('type');
    if (!description || typeof description !== 'string' || description.trim() === '') missingFields.push('description');
    if (!date || typeof date !== 'string') missingFields.push('date');
    if (!location || typeof location !== 'string' || location.trim() === '') missingFields.push('location');
    if (quota === undefined || quota === null || isNaN(quota)) missingFields.push('quota');

    if (missingFields.length > 0) {
      console.error('Validation failed - missing fields:', missingFields);
      return res.status(400).json({ 
        error: 'Data kegiatan tidak lengkap.',
        details: `Field yang harus diisi: ${missingFields.join(', ')}`
      });
    }

    const quotaNum = parseInt(quota);
    if (isNaN(quotaNum) || quotaNum < 1) {
      console.error('Validation failed - invalid quota:', quota);
      return res.status(400).json({ error: 'Kuota harus berupa angka minimal 1.' });
    }

    const validTypes = ['MAKESTA', 'LAKMUD', 'PELATIHAN', 'BAKSOS', 'LAINNYA'];
    if (!validTypes.includes(type)) {
      console.error('Validation failed - invalid type:', type);
      return res.status(400).json({ 
        error: 'Tipe kegiatan tidak valid.',
        validTypes: validTypes
      });
    }

    const id = crypto.randomUUID();
    const status = computeActivityStatus(date);
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    console.log('Inserting activity into database:', {
      id,
      title,
      type,
      date,
      location,
      quota: quotaNum,
      status
    });

    await pool.execute(
      `INSERT INTO activities (id, title, type, description, date, location, quota, registered, status, image, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
      [id, title, type, description, date, location, quotaNum, status, image || null, now, now]
    );

    const [newActivity] = await pool.query('SELECT * FROM activities WHERE id = ?', [id]);
    console.log('Activity created successfully:', newActivity[0]);
    res.status(201).json(newActivity[0]);
  } catch (error) {
    console.error('Failed to create activity:', error);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState
    });
    res.status(500).json({ 
      error: 'Gagal menambahkan kegiatan.',
      message: error.message,
      code: error.code
    });
  }
});

// PUT /api/activities/:id - Edit kegiatan (admin only)
app.put('/api/activities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, description, date, location, quota, image } = req.body;

    if (!title || !type || !description || !date || !location || !quota) {
      return res.status(400).json({ error: 'Data kegiatan tidak lengkap.' });
    }

    if (quota < 1) {
      return res.status(400).json({ error: 'Kuota harus minimal 1.' });
    }

    const validTypes = ['MAKESTA', 'LAKMUD', 'PELATIHAN', 'BAKSOS', 'LAINNYA'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Tipe kegiatan tidak valid.' });
    }

    const [existing] = await pool.query('SELECT * FROM activities WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan.' });
    }

    const currentActivity = existing[0];
    if (currentActivity.registered > quota) {
      return res.status(400).json({ error: 'Kuota tidak boleh kurang dari jumlah peserta yang sudah terdaftar.' });
    }

    const status = computeActivityStatus(date);
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await pool.execute(
      `UPDATE activities SET title = ?, type = ?, description = ?, date = ?, location = ?, quota = ?, status = ?, image = ?, updated_at = ?
       WHERE id = ?`,
      [title, type, description, date, location, quota, status, image || null, now, id]
    );

    const [updated] = await pool.query('SELECT * FROM activities WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Failed to update activity:', error);
    res.status(500).json({ error: 'Gagal memperbarui kegiatan.' });
  }
});

// DELETE /api/activities/:id - Hapus kegiatan (admin only)
app.delete('/api/activities/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM activities WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan.' });
    }

    await pool.execute('DELETE FROM activities WHERE id = ?', [id]);
    res.json({ success: true, message: 'Kegiatan berhasil dihapus.' });
  } catch (error) {
    console.error('Failed to delete activity:', error);
    res.status(500).json({ error: 'Gagal menghapus kegiatan.' });
  }
});

// POST /api/activities/:id/register - Daftar kegiatan (user)
app.post('/api/activities/:id/register', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan.' });
    }

    const [activities] = await connection.query('SELECT * FROM activities WHERE id = ?', [id]);
    if (activities.length === 0) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan.' });
    }

    const activity = activities[0];

    // Cek status kegiatan
    const autoStatus = computeActivityStatus(activity.date);
    if (autoStatus !== 'upcoming' && autoStatus !== 'ongoing') {
      return res.status(400).json({ error: 'Pendaftaran hanya tersedia untuk kegiatan yang akan datang atau sedang berlangsung.' });
    }

    // Cek kuota
    if (activity.registered >= activity.quota) {
      return res.status(400).json({ error: 'Kuota kegiatan sudah penuh.' });
    }

    // Cek pendaftaran ganda
    const [existingReg] = await connection.query(
      'SELECT id FROM activity_registrations WHERE user_id = ? AND activity_id = ?',
      [userId, id]
    );

    if (existingReg.length > 0) {
      return res.status(409).json({ error: 'Anda sudah terdaftar di kegiatan ini.' });
    }

    const registrationId = crypto.randomUUID();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await connection.execute(
      `INSERT INTO activity_registrations (id, user_id, activity_id, status, registered_date, created_at)
       VALUES (?, ?, ?, 'pending', ?, ?)`,
      [registrationId, userId, id, now, now]
    );

    await connection.execute(
      'UPDATE activities SET registered = registered + 1 WHERE id = ?',
      [id]
    );

    const [newReg] = await pool.query('SELECT * FROM activity_registrations WHERE id = ?', [registrationId]);
    res.status(201).json(newReg[0]);
  } catch (error) {
    console.error('Failed to register activity:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Anda sudah terdaftar di kegiatan ini.' });
    }
    res.status(500).json({ error: 'Gagal mendaftar kegiatan.' });
  } finally {
    connection.release();
  }
});

// GET /api/activities/:id/registrations - List pendaftaran (admin)
app.get('/api/activities/:id/registrations', async (req, res) => {
  try {
    const { id } = req.params;

    const [activity] = await pool.query('SELECT * FROM activities WHERE id = ?', [id]);
    if (activity.length === 0) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan.' });
    }

    const [registrations] = await pool.query(
      `SELECT ar.*, ca.full_name, ca.email, ca.phone
       FROM activity_registrations ar
       JOIN created_accounts ca ON ar.user_id = ca.id
       WHERE ar.activity_id = ?
       ORDER BY ar.registered_date DESC`,
      [id]
    );

    res.json(registrations);
  } catch (error) {
    console.error('Failed to load registrations:', error);
    res.status(500).json({ error: 'Gagal memuat data pendaftaran.' });
  }
});

// PATCH /api/activities/:id/registrations/:registrationId/status - Approve/reject
app.patch('/api/activities/:id/registrations/:registrationId/status', async (req, res) => {
  try {
    const { id, registrationId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid.' });
    }

    const [activity] = await pool.query('SELECT * FROM activities WHERE id = ?', [id]);
    if (activity.length === 0) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan.' });
    }

    const [registration] = await pool.query(
      'SELECT * FROM activity_registrations WHERE id = ? AND activity_id = ?',
      [registrationId, id]
    );

    if (registration.length === 0) {
      return res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' });
    }

    await pool.execute(
      'UPDATE activity_registrations SET status = ? WHERE id = ?',
      [status, registrationId]
    );

    res.json({ success: true, message: `Pendaftaran berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}.` });
  } catch (error) {
    console.error('Failed to update registration status:', error);
    res.status(500).json({ error: 'Gagal memperbarui status pendaftaran.' });
  }
});

// GET /api/activities/stats - Statistik kegiatan (admin)
app.get('/api/activities/stats', async (req, res) => {
  try {
    const [totalStats] = await pool.query(
      `SELECT
        COUNT(*) as total_activities,
        SUM(CASE WHEN status = 'upcoming' THEN 1 ELSE 0 END) as upcoming_count,
        SUM(CASE WHEN status = 'ongoing' THEN 1 ELSE 0 END) as ongoing_count,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(quota) as total_quota,
        SUM(registered) as total_registered
       FROM activities`
    );

    const [typeStats] = await pool.query(
      `SELECT type, COUNT(*) as count, SUM(registered) as total_registered
       FROM activities
       GROUP BY type`
    );

    const [recentActivities] = await pool.query(
      'SELECT * FROM activities ORDER BY created_at DESC LIMIT 5'
    );

    res.json({
      overview: totalStats[0],
      byType: typeStats,
      recent: recentActivities,
    });
  } catch (error) {
    console.error('Failed to load activity stats:', error);
    res.status(500).json({ error: 'Gagal memuat statistik kegiatan.' });
  }
});

// GET /api/stats - Public statistics (no auth required)
app.get('/api/stats', async (req, res) => {
  try {
    const [[members]] = await pool.query('SELECT COUNT(*) as total FROM created_accounts');
    const [[activities]] = await pool.query('SELECT COUNT(*) as total FROM activities');
    const [[articles]] = await pool.query('SELECT COUNT(*) as total FROM articles WHERE status = "published"');
    const [[suggestions]] = await pool.query('SELECT COUNT(*) as total FROM suggestions');

    res.json({
      anggota: members.total,
      kegiatan: activities.total,
      artikel: articles.total,
      saran: suggestions.total
    });
  } catch (error) {
    console.error('Failed to load stats:', error);
    res.status(500).json({ error: 'Gagal memuat statistik.' });
  }
});

// GET /api/my-registrations - Riwayat pendaftaran user
app.get('/api/my-registrations', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan.' });
    }

    const [registrations] = await pool.query(
      `SELECT ar.*, a.title, a.type, a.date, a.location, a.quota
       FROM activity_registrations ar
       JOIN activities a ON ar.activity_id = a.id
       WHERE ar.user_id = ?
       ORDER BY ar.registered_date DESC`,
      [userId]
    );

    res.json(registrations);
  } catch (error) {
    console.error('Failed to load my registrations:', error);
    res.status(500).json({ error: 'Gagal memuat riwayat pendaftaran.' });
  }
});

// GET /api/certificates/:registrationId - Download sertifikat kegiatan
app.get('/api/certificates/:registrationId', async (req, res) => {
  try {
    const { registrationId } = req.params;
    const userId = req.headers['x-user-id'];
    const userEmail = req.headers['x-user-email'];
    const userName = req.headers['x-user-name'];

    // Validasi header
    if (!userId || !userEmail) {
      return res.status(401).json({ error: 'Akses ditolak. Silakan login kembali.' });
    }

    // Ambil data pendaftaran
    const [registrations] = await pool.query(
      `SELECT ar.*, a.title, a.type, a.date, a.location
       FROM activity_registrations ar
       JOIN activities a ON ar.activity_id = a.id
       WHERE ar.id = ? AND ar.user_id = ? AND ar.status = 'approved'`,
      [registrationId, userId]
    );

    if (registrations.length === 0) {
      return res.status(404).json({ error: 'Pendaftaran tidak ditemukan atau belum disetujui.' });
    }

    const registration = registrations[0];

    // Buat sertifikat dalam format HTML yang bisa di-print
    const certificateHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Sertifikat - ${registration.title}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Georgia', serif;
    }
    .certificate {
      width: 100%;
      height: 297mm;
      padding: 20mm;
      box-sizing: border-box;
      text-align: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      position: relative;
    }
    .border {
      position: absolute;
      top: 15mm;
      left: 15mm;
      right: 15mm;
      bottom: 15mm;
      border: 3px solid #1a5f1a;
      padding: 15mm;
    }
    .inner-border {
      position: absolute;
      top: 18mm;
      left: 18mm;
      right: 18mm;
      bottom: 18mm;
      border: 1px solid #1a5f1a;
    }
    .header {
      margin-top: 20mm;
      margin-bottom: 10mm;
    }
    .logo {
      font-size: 24pt;
      font-weight: bold;
      color: #1a5f1a;
      margin-bottom: 5mm;
    }
    .subtitle {
      font-size: 14pt;
      color: #333;
    }
    .title {
      font-size: 32pt;
      font-weight: bold;
      color: #1a5f1a;
      margin: 15mm 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .presented-to {
      font-size: 14pt;
      color: #555;
      margin-bottom: 5mm;
    }
    .recipient-name {
      font-size: 28pt;
      font-weight: bold;
      color: #000;
      margin: 5mm 0;
      border-bottom: 2px solid #1a5f1a;
      display: inline-block;
      padding: 0 20mm;
      min-width: 80mm;
    }
    .achievement-text {
      font-size: 14pt;
      color: #555;
      margin: 10mm 0;
      line-height: 1.6;
    }
    .activity-name {
      font-size: 20pt;
      font-weight: bold;
      color: #1a5f1a;
      margin: 5mm 0;
    }
    .activity-date {
      font-size: 14pt;
      color: #555;
      margin-bottom: 20mm;
    }
    .footer {
      position: absolute;
      bottom: 25mm;
      left: 20mm;
      right: 20mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .signature {
      text-align: center;
    }
    .signature-line {
      width: 60mm;
      border-top: 1px solid #000;
      margin-bottom: 3mm;
      padding-top: 3mm;
    }
    .signature-name {
      font-size: 12pt;
      font-weight: bold;
      color: #000;
    }
    .signature-title {
      font-size: 10pt;
      color: #555;
    }
    .stamp {
      width: 40mm;
      height: 40mm;
      border: 3px solid #1a5f1a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10pt;
      font-weight: bold;
      color: #1a5f1a;
      transform: rotate(-15deg);
      opacity: 0.7;
    }
    .certificate-id {
      position: absolute;
      bottom: 5mm;
      left: 20mm;
      font-size: 9pt;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="border"></div>
    <div class="inner-border"></div>
    
    <div class="header">
      <div class="logo">IPNU IPPNU Ranting Batursari</div>
      <div class="subtitle">Organisasi Pelajar Islam</div>
    </div>

    <div class="title">Sertifikat Keikutsertaan</div>

    <div class="presented-to">Diberikan kepada:</div>
    <div class="recipient-name">${userName || userEmail}</div>

    <div class="achievement-text">
      Telah berpartisipasi dan menyelesaikan kegiatan dengan baik
    </div>

    <div class="activity-name">${registration.title}</div>
    <div class="activity-date">
      Tanggal: ${new Date(registration.date).toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })}
    </div>

    <div class="footer">
      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-name">Ketua Pelaksana</div>
        <div class="signature-title">IPNU IPPNU Ranting Batursari</div>
      </div>
      
      <div class="stamp">
        DISETUJUI
      </div>

      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-name">Pembina</div>
        <div class="signature-title">IPNU IPPNU Ranting Batursari</div>
      </div>
    </div>

    <div class="certificate-id">
      ID: ${registrationId}
    </div>
  </div>
</body>
</html>
    `;

    // Set header untuk download sebagai HTML (bisa di-print ke PDF dari browser)
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="sertifikat-${registration.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html"`);
    
    // Tambahkan instruksi untuk konversi ke PDF
    const certificateWithInstructions = certificateHTML.replace(
      '</body>',
      `
      <div style="position: fixed; bottom: 20px; left: 20px; right: 20px; background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 8px; font-family: Arial, sans-serif; font-size: 12px; color: #856404; z-index: 1000;">
        <strong>📋 Cara mendapatkan versi PDF:</strong><br>
        1. Tekan <kbd>Ctrl + P</kbd> (Windows) atau <kbd>Cmd + P</kbd> (Mac)<br>
        2. Pilih "Simpan sebagai PDF" sebagai printer<br>
        3. Klik "Simpan" dan pilih lokasi penyimpanan<br>
        <em>Catatan: Untuk hasil terbaik, gunakan pengaturan kertas A4 dan margin minimal.</em>
      </div>
      </body>
      `
    );
    
    res.send(certificateWithInstructions);
  } catch (error) {
    console.error('Failed to generate certificate:', error);
    res.status(500).json({ error: 'Gagal membuat sertifikat.' });
  }
});

// GET /api/activity-registrations - List semua pendaftaran (admin)
app.get('/api/activity-registrations', async (req, res) => {
  try {
    const { status, activityId } = req.query;
    let query = `
      SELECT ar.*, 
             a.title as activity_title, 
             a.type as activity_type,
             a.date as activity_date,
             ca.full_name as user_name,
             ca.email as user_email,
             ca.phone as user_phone
      FROM activity_registrations ar
      JOIN activities a ON ar.activity_id = a.id
      JOIN created_accounts ca ON ar.user_id = ca.id
      WHERE 1=1
    `;
    const params = [];

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query += ' AND ar.status = ?';
      params.push(status);
    }

    if (activityId) {
      query += ' AND ar.activity_id = ?';
      params.push(activityId);
    }

    query += ' ORDER BY ar.registered_date DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Failed to load activity registrations:', error);
    res.status(500).json({ error: 'Gagal memuat data pendaftaran.' });
  }
});

// PATCH /api/activity-registrations/:id/status - Update status pendaftaran (admin)
app.patch('/api/activity-registrations/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid.' });
    }

    const [existing] = await pool.query('SELECT * FROM activity_registrations WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' });
    }

    await pool.execute(
      'UPDATE activity_registrations SET status = ? WHERE id = ?',
      [status, id]
    );

    const [updated] = await pool.query('SELECT * FROM activity_registrations WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Failed to update registration status:', error);
    res.status(500).json({ error: 'Gagal memperbarui status pendaftaran.' });
  }
});

// GET /api/activity-registrations/stats - Statistik pendaftaran (admin)
app.get('/api/activity-registrations/stats', async (req, res) => {
  try {
    const [stats] = await pool.query(
      `SELECT 
        COUNT(*) as total_registrations,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
       FROM activity_registrations`
    );

    res.json(stats[0]);
  } catch (error) {
    console.error('Failed to load registration stats:', error);
    res.status(500).json({ error: 'Gagal memuat statistik pendaftaran.' });
  }
});

// GET /api/users/by-email - Get user by email (for login)
app.get('/api/users/by-email', async (req, res) => {
  try {
    const { email } = req.query;
    console.log('🔍 [SERVER] /api/users/by-email called with email:', email);

    if (!email || typeof email !== 'string') {
      console.log('❌ [SERVER] Email parameter missing or invalid');
      return res.status(400).json({ error: 'Email diperlukan.' });
    }

    const [users] = await pool.query(
      'SELECT id, email, full_name, role FROM created_accounts WHERE email = ?',
      [email]
    );

    console.log('📊 [SERVER] Database query result:', users);
    console.log('📊 [SERVER] Number of users found:', users.length);

    if (users.length === 0) {
      console.log('❌ [SERVER] User not found in database');
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    console.log('✅ [SERVER] Returning user data:', users[0]);
    res.json(users[0]);
  } catch (error) {
    console.error('❌ [SERVER] Failed to get user by email:', error);
    res.status(500).json({ error: 'Gagal memuat data user.' });
  }
});

// ─── Articles (Berita & Artikel) ───────────────────────────────────

// Helper: generate slug dari judul
function generateSlug(judul, existingSlugs = []) {
  let baseSlug = judul.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

// GET /api/articles - Ambil semua artikel
app.get('/api/articles', async (req, res) => {
  try {
    const { status, kategori } = req.query;
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    // Untuk halaman publik, hanya tampilkan published
    // Untuk admin, tampilkan semua (jika tidak ada filter)
    if (status && ['draft', 'published'].includes(status )) {
      query += ' AND status = ?';
      params.push(status);
    } else if (!req.query.status) {
      // Default: hanya published untuk publik
      query += ' AND status = ?';
      params.push('published');
    }

    if (kategori && ['Organisasi', 'Kegiatan', 'Berita', 'Pengumuman'].includes(kategori )) {
      query += ' AND kategori = ?';
      params.push(kategori);
    }

    query += ' ORDER BY tanggal_publish DESC, created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Failed to load articles:', error);
    res.status(500).json({ error: 'Gagal memuat data artikel.' });
  }
});

// GET /api/articles/:id - Detail artikel by ID
app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Failed to load article:', error);
    res.status(500).json({ error: 'Gagal memuat data artikel.' });
  }
});

// GET /api/articles/slug/:slug - Detail artikel by slug
app.get('/api/articles/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query('SELECT * FROM articles WHERE slug = ? AND status = ?', [slug, 'published']);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Failed to load article by slug:', error);
    res.status(500).json({ error: 'Gagal memuat data artikel.' });
  }
});

// POST /api/articles - Buat artikel baru (admin only)
app.post('/api/articles', async (req, res) => {
  try {
    const { judul, konten, ringkasan, kategori, thumbnail_url, penulis, status, tanggal_publish } = req.body;

    // Validasi
    if (!judul || !konten || !kategori || !tanggal_publish) {
      return res.status(400).json({ 
        error: 'Data tidak lengkap.',
        details: 'Field judul, konten, kategori, dan tanggal publish harus diisi'
      });
    }

    const validCategories = ['Organisasi', 'Kegiatan', 'Berita', 'Pengumuman'];
    if (!validCategories.includes(kategori)) {
      return res.status(400).json({ error: 'Kategori tidak valid.' });
    }

    const validStatus = ['draft', 'published'];
    const articleStatus = status && validStatus.includes(status) ? status : 'published';

    // Generate slug
    const [existingSlugs] = await pool.query('SELECT slug FROM articles');
    const slugs = existingSlugs.map((row) => row.slug);
    const slug = generateSlug(judul, slugs);

    const result = await pool.execute(
      `INSERT INTO articles (judul, slug, konten, ringkasan, kategori, thumbnail_url, penulis, status, tanggal_publish)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        judul,
        slug,
        konten,
        ringkasan || null,
        kategori,
        thumbnail_url || null,
        penulis || 'Admin',
        articleStatus,
        tanggal_publish
      ]
    );

    const insertId = result[0].insertId;
    const [newArticle] = await pool.query('SELECT * FROM articles WHERE id = ?', [insertId]);
    
    res.status(201).json(newArticle[0]);
  } catch (error) {
    console.error('Failed to create article:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Slug sudah ada. Coba judul yang berbeda.' });
    }
    res.status(500).json({ error: 'Gagal menambahkan artikel.' });
  }
});

// PUT /api/articles/:id - Edit artikel (admin only)
app.put('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, konten, ringkasan, kategori, thumbnail_url, penulis, status, tanggal_publish } = req.body;

    // Validasi
    if (!judul || !konten || !kategori || !tanggal_publish) {
      return res.status(400).json({ 
        error: 'Data tidak lengkap.',
        details: 'Field judul, konten, kategori, dan tanggal publish harus diisi'
      });
    }

    const validCategories = ['Organisasi', 'Kegiatan', 'Berita', 'Pengumuman'];
    if (!validCategories.includes(kategori)) {
      return res.status(400).json({ error: 'Kategori tidak valid.' });
    }

    const [existing] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
    }

    const currentArticle = existing[0];
    
    // Generate slug baru jika judul berubah
    let slug = currentArticle.slug;
    if (judul !== currentArticle.judul) {
      const [existingSlugs] = await pool.query('SELECT slug FROM articles WHERE id != ?', [id]);
      const slugs = existingSlugs.map((row) => row.slug);
      slug = generateSlug(judul, slugs);
    }

    const validStatus = ['draft', 'published'];
    const articleStatus = status && validStatus.includes(status) ? status : currentArticle.status;

    await pool.execute(
      `UPDATE articles 
       SET judul = ?, slug = ?, konten = ?, ringkasan = ?, kategori = ?, thumbnail_url = ?, penulis = ?, status = ?, tanggal_publish = ?
       WHERE id = ?`,
      [
        judul,
        slug,
        konten,
        ringkasan || null,
        kategori,
        thumbnail_url || null,
        penulis || 'Admin',
        articleStatus,
        tanggal_publish,
        id
      ]
    );

    const [updated] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Failed to update article:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Slug sudah ada. Coba judul yang berbeda.' });
    }
    res.status(500).json({ error: 'Gagal memperbarui artikel.' });
  }
});

// DELETE /api/articles/:id - Hapus artikel (admin only)
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
    }

    await pool.execute('DELETE FROM articles WHERE id = ?', [id]);
    res.json({ success: true, message: 'Artikel berhasil dihapus.' });
  } catch (error) {
    console.error('Failed to delete article:', error);
    res.status(500).json({ error: 'Gagal menghapus artikel.' });
  }
});

// ─── Organization Members (Struktur Organisasi) ────────────────────

// GET /api/organization-members - Ambil semua pengurus
app.get('/api/organization-members', async (req, res) => {
  try {
    const { organisasi } = req.query;
    let query = 'SELECT * FROM organization_members WHERE 1=1';
    const params = [];

    if (organisasi && ['IPNU', 'IPPNU'].includes(organisasi)) {
      query += ' AND organisasi = ?';
      params.push(organisasi);
    }

    query += ' ORDER BY organisasi ASC, urutan ASC, id ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Failed to load organization members:', error);
    res.status(500).json({ error: 'Gagal memuat data struktur organisasi.' });
  }
});

// GET /api/organization-members/:id - Detail satu pengurus
app.get('/api/organization-members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM organization_members WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pengurus tidak ditemukan.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Failed to load organization member:', error);
    res.status(500).json({ error: 'Gagal memuat data pengurus.' });
  }
});

// POST /api/organization-members - Tambah pengurus baru (admin only)
app.post('/api/organization-members', async (req, res) => {
  try {
    const { nama, jabatan, organisasi, periode, urutan, foto_url } = req.body;

    // Validasi
    if (!nama || !jabatan || !organisasi || !periode) {
      return res.status(400).json({ 
        error: 'Data tidak lengkap.',
        details: 'Field nama, jabatan, organisasi, dan periode harus diisi'
      });
    }

    if (!['IPNU', 'IPPNU'].includes(organisasi)) {
      return res.status(400).json({ error: 'Organisasi harus IPNU atau IPPNU.' });
    }

    const urutanNum = parseInt(urutan) || 0;

    const result = await pool.execute(
      `INSERT INTO organization_members (nama, jabatan, organisasi, periode, urutan, foto_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nama, jabatan, organisasi, periode, urutanNum, foto_url || null]
    );

    const insertId = result[0].insertId;
    const [newMember] = await pool.query('SELECT * FROM organization_members WHERE id = ?', [insertId]);
    
    res.status(201).json(newMember[0]);
  } catch (error) {
    console.error('Failed to create organization member:', error);
    res.status(500).json({ error: 'Gagal menambahkan pengurus.' });
  }
});

// PUT /api/organization-members/:id - Edit pengurus (admin only)
app.put('/api/organization-members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, jabatan, organisasi, periode, urutan, foto_url } = req.body;

    // Validasi
    if (!nama || !jabatan || !organisasi || !periode) {
      return res.status(400).json({ 
        error: 'Data tidak lengkap.',
        details: 'Field nama, jabatan, organisasi, dan periode harus diisi'
      });
    }

    if (!['IPNU', 'IPPNU'].includes(organisasi)) {
      return res.status(400).json({ error: 'Organisasi harus IPNU atau IPPNU.' });
    }

    const [existing] = await pool.query('SELECT * FROM organization_members WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Pengurus tidak ditemukan.' });
    }

    const urutanNum = parseInt(urutan) || 0;

    await pool.execute(
      `UPDATE organization_members 
       SET nama = ?, jabatan = ?, organisasi = ?, periode = ?, urutan = ?, foto_url = ?
       WHERE id = ?`,
      [nama, jabatan, organisasi, periode, urutanNum, foto_url || null, id]
    );

    const [updated] = await pool.query('SELECT * FROM organization_members WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Failed to update organization member:', error);
    res.status(500).json({ error: 'Gagal memperbarui pengurus.' });
  }
});

// DELETE /api/organization-members/:id - Hapus pengurus (admin only)
app.delete('/api/organization-members/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM organization_members WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Pengurus tidak ditemukan.' });
    }

    await pool.execute('DELETE FROM organization_members WHERE id = ?', [id]);
    res.json({ success: true, message: 'Pengurus berhasil dihapus.' });
  } catch (error) {
    console.error('Failed to delete organization member:', error);
    res.status(500).json({ error: 'Gagal menghapus pengurus.' });
  }
});

// ─── Suggestions (Saran Masuk) ─────────────────────────────────────

// GET /api/suggestions - Ambil semua saran (admin only)
app.get('/api/suggestions', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM suggestions WHERE 1=1';
    const params = [];

    if (status && ['baru', 'dibaca', 'dibalas'].includes(status )) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Failed to load suggestions:', error);
    res.status(500).json({ error: 'Gagal memuat data saran.' });
  }
});

// GET /api/suggestions/:id - Detail satu saran + auto mark as read
app.get('/api/suggestions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM suggestions WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Saran tidak ditemukan.' });
    }

    const suggestion = rows[0];

    // Auto mark as read jika status masih 'baru'
    if (suggestion.status === 'baru') {
      await pool.execute('UPDATE suggestions SET status = ? WHERE id = ?', ['dibaca', id]);
      suggestion.status = 'dibaca';
    }

    res.json(suggestion);
  } catch (error) {
    console.error('Failed to load suggestion:', error);
    res.status(500).json({ error: 'Gagal memuat data saran.' });
  }
});

// POST /api/suggestions - Kirim saran baru (public, no auth)
app.post('/api/suggestions', async (req, res) => {
  try {
    const { nama, email, telepon, subjek, pesan } = req.body;

    // Validasi
    if (!nama || !subjek || !pesan) {
      return res.status(400).json({ 
        error: 'Data tidak lengkap.',
        details: 'Field nama, subjek, dan pesan harus diisi'
      });
    }

    if (pesan.length < 20) {
      return res.status(400).json({ error: 'Pesan minimal 20 karakter.' });
    }

    const result = await pool.execute(
      `INSERT INTO suggestions (nama, email, telepon, subjek, pesan, status)
       VALUES (?, ?, ?, ?, ?, 'baru')`,
      [nama, email || null, telepon || null, subjek, pesan]
    );

    const insertId = result[0].insertId;
    const [newSuggestion] = await pool.query('SELECT * FROM suggestions WHERE id = ?', [insertId]);
    
    res.status(201).json(newSuggestion[0]);
  } catch (error) {
    console.error('Failed to create suggestion:', error);
    res.status(500).json({ error: 'Gagal mengirim saran.' });
  }
});

// GET /api/my-suggestions - Riwayat saran user (by email)
app.get('/api/my-suggestions', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email diperlukan.' });
    }

    const [suggestions] = await pool.query(
      'SELECT id, nama, email, subjek, pesan, status, balasan, tanggal_balas, created_at FROM suggestions WHERE email = ? ORDER BY created_at DESC',
      [email]
    );

    console.log('📊 [SERVER] My suggestions API response:', suggestions);
    res.json(suggestions);
  } catch (error) {
    console.error('Failed to load my suggestions:', error);
    res.status(500).json({ error: 'Gagal memuat riwayat saran.' });
  }
});

// PUT /api/suggestions/:id/balas - Balas saran (admin only)
app.put('/api/suggestions/:id/balas', async (req, res) => {
  try {
    const { id } = req.params;
    const { balasan } = req.body;

    if (!balasan || balasan.trim() === '') {
      return res.status(400).json({ error: 'Balasan tidak boleh kosong.' });
    }

    const [existing] = await pool.query('SELECT * FROM suggestions WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Saran tidak ditemukan.' });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await pool.execute(
      `UPDATE suggestions 
       SET balasan = ?, status = 'dibalas', tanggal_balas = ?
       WHERE id = ?`,
      [balasan, now, id]
    );

    const [updated] = await pool.query('SELECT * FROM suggestions WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Failed to reply suggestion:', error);
    res.status(500).json({ error: 'Gagal membalas saran.' });
  }
});

// DELETE /api/suggestions/:id - Hapus saran (admin only)
app.delete('/api/suggestions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM suggestions WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Saran tidak ditemukan.' });
    }

    await pool.execute('DELETE FROM suggestions WHERE id = ?', [id]);
    res.json({ success: true, message: 'Saran berhasil dihapus.' });
  } catch (error) {
    console.error('Failed to delete suggestion:', error);
    res.status(500).json({ error: 'Gagal menghapus saran.' });
  }
});

// ─── 404 handler ────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend server berjalan di http://localhost:${port}`);
});