import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE,
  });

  try {
    const email = 'admin@ipnuipnu.com';
    const password = 'ipnuippnu123';
    const fullName = 'Admin IPNU IPPNU';
    const organization = 'IPNU';
    const phone = '081234567890';
    
    // Hash password
    const passwordHash = bcrypt.hashSync(password, 10);
    const accountId = uuidv4();

    // Cek apakah admin sudah ada
    const [existing] = await connection.execute(
      'SELECT id FROM created_accounts WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log('⚠️  Admin sudah ada, updating password...');
      await connection.execute(
        'UPDATE created_accounts SET password_hash = ?, role = ? WHERE email = ?',
        [passwordHash, 'admin', email]
      );
      console.log('✅ Password admin berhasil di-update!');
    } else {
      // Buat pendaftaran anggota terlebih dahulu (karena ada foreign key constraint)
      const registrationId = uuidv4();
      await connection.execute(
        `INSERT INTO member_registrations 
         (id, full_name, email, phone, birth_date, gender, address, organization, agree_terms, status, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          registrationId,
          fullName,
          email,
          phone,
          '1990-01-01',
          'Laki-laki',
          'Batursari',
          organization,
          1,
          'approved',
          new Date().toISOString().slice(0, 19).replace('T', ' ')
        ]
      );
      console.log('✅ Member registration created');

      // Buat akun admin dengan referensi ke pendaftaran
      await connection.execute(
        `INSERT INTO created_accounts (id, registration_id, full_name, email, password_hash, phone, organization, role)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [accountId, registrationId, fullName, email, passwordHash, phone, organization, 'admin']
      );
      console.log('✅ Admin berhasil dibuat!');
    }

    // Verifikasi
    const [users] = await connection.execute(
      'SELECT id, email, full_name, role, organization FROM created_accounts WHERE email = ?',
      [email]
    );

    if (users.length > 0) {
      console.log('\n✅ Admin user verified:');
      console.log(users[0]);
    }

    console.log('\n📋 Login credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role: admin');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

createAdmin();