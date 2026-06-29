# Fix: Fitur Pendaftaran Kegiatan - Database Integration

## Ringkasan Perbaikan

Mengubah halaman **Admin Pendaftaran Kegiatan** dari menggunakan data dummy/mock data menjadi menggunakan data asli dari database MySQL.

---

## 🐛 Masalah yang Ditemukan

### Sebelum Perbaikan:
- Halaman menggunakan `mockRegistrations`, `mockActivities`, dan `mockUsers` dari `mockData.ts`
- Data statis tidak mencerminkan data asli di database
- Tombol "Setujui" dan "Tolak" tidak memiliki fungsi (tidak ada onClick handler)
- Tidak ada sinkronisasi dengan database
- Filter tab menampilkan jumlah data dummy, bukan data asli

### Dampak:
- Admin tidak bisa melihat pendaftaran yang sebenarnya ada di database
- Admin tidak bisa menyetujui/menolak pendaftaran
- Data tidak sinkron antara halaman dan database

---

## ✅ Solusi yang Diterapkan

### 1. Backend - Endpoint Baru

Ditambahkan 3 endpoint baru di `server/index.js`:

#### a) `GET /api/activity-registrations`
**Fungsi:** Mengambil semua data pendaftaran dengan join ke tabel activities dan created_accounts

**Query:**
```sql
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
  [AND ar.status = ?]  -- optional filter
  [AND ar.activity_id = ?]  -- optional filter
ORDER BY ar.registered_date DESC
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "activity_id": "uuid",
    "status": "pending",
    "registered_date": "2025-06-28 10:00:00",
    "activity_title": "MAKESTA 2025",
    "activity_type": "MAKESTA",
    "activity_date": "2025-12-31",
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "user_phone": "08123456789"
  }
]
```

#### b) `PATCH /api/activity-registrations/:id/status`
**Fungsi:** Update status pendaftaran (approved/rejected)

**Request:**
```json
{
  "status": "approved"  // atau "rejected"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "approved",
  ...
}
```

#### c) `GET /api/activity-registrations/stats`
**Fungsi:** Mengambil statistik jumlah pendaftaran per status

**Query:**
```sql
SELECT 
  COUNT(*) as total_registrations,
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
  SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
  SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
FROM activity_registrations
```

**Response:**
```json
{
  "total_registrations": 150,
  "pending_count": 25,
  "approved_count": 120,
  "rejected_count": 5
}
```

---

### 2. Frontend - AdminRegistrations.tsx

#### Perubahan yang Dilakukan:

**a) Import yang Diperbarui:**
```typescript
// SEBELUM
import { mockRegistrations, mockActivities, mockUsers } from '../../data/mockData';
import { useState } from 'react';

// SESUDAH
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
```

**b) Interface Baru:**
```typescript
interface Registration {
  id: string;
  user_id: string;
  activity_id: string;
  status: 'pending' | 'approved' | 'rejected';
  registered_date: string;
  created_at: string;
  activity_title: string;
  activity_type: string;
  activity_date: string;
  user_name: string;
  user_email: string;
  user_phone: string;
}

interface Stats {
  total_registrations: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
}
```

**c) State Management:**
```typescript
const [registrations, setRegistrations] = useState<Registration[]>([]);
const [stats, setStats] = useState<Stats | null>(null);
const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
const [loading, setLoading] = useState(true);
const [updatingId, setUpdatingId] = useState<string | null>(null);
```

**d) API Functions:**
```typescript
// Fetch registrations with filter
const fetchRegistrations = async () => {
  try {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('status', filter);

    const res = await fetch(`${API_BASE}/api/activity-registrations?${params}`);
    if (!res.ok) throw new Error('Gagal memuat data pendaftaran');
    const data = await res.json();
    setRegistrations(data);
  } catch (error) {
    console.error('Failed to fetch registrations:', error);
    toast.error('Gagal memuat data pendaftaran');
  } finally {
    setLoading(false);
  }
};

// Fetch statistics
const fetchStats = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/activity-registrations/stats`);
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
};

// Update status (approve/reject)
const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
  setUpdatingId(id);

  try {
    const res = await fetch(`${API_BASE}/api/activity-registrations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal memperbarui status');
    }

    toast.success(`Pendaftaran berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
    
    // Refresh data
    fetchRegistrations();
    fetchStats();
  } catch (error) {
    console.error('Failed to update status:', error);
    toast.error(error instanceof Error ? error.message : 'Gagal memperbarui status');
  } finally {
    setUpdatingId(null);
  }
};
```

**e) useEffect untuk Data Fetching:**
```typescript
useEffect(() => {
  fetchRegistrations();
  fetchStats();
}, [filter]);
```

**f) Filter dengan Data Real:**
```typescript
{/* Filter */}
<div className="flex gap-2 mb-6">
  <button
    onClick={() => setFilter('all')}
    className={`px-4 py-2 rounded-lg text-sm ${
      filter === 'all'
        ? 'bg-green-600 text-white'
        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
    }`}
  >
    Semua ({stats?.total_registrations || 0})
  </button>
  <button
    onClick={() => setFilter('pending')}
    className={`px-4 py-2 rounded-lg text-sm ${
      filter === 'pending'
        ? 'bg-yellow-600 text-white'
        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
    }`}
  >
    Pending ({stats?.pending_count || 0})
  </button>
  <button
    onClick={() => setFilter('approved')}
    className={`px-4 py-2 rounded-lg text-sm ${
      filter === 'approved'
        ? 'bg-green-600 text-white'
        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
    }`}
  >
    Disetujui ({stats?.approved_count || 0})
  </button>
  <button
    onClick={() => setFilter('rejected')}
    className={`px-4 py-2 rounded-lg text-sm ${
      filter === 'rejected'
        ? 'bg-red-600 text-white'
        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
    }`}
  >
    Ditolak ({stats?.rejected_count || 0})
  </button>
</div>
```

**g) Tombol dengan Fungsi yang Benar:**
```typescript
{registration.status === 'pending' ? (
  <div className="flex gap-2">
    <button
      onClick={() => handleUpdateStatus(registration.id, 'approved')}
      disabled={updatingId === registration.id}
      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      <Check size={14} />
      {updatingId === registration.id ? 'Menyimpan...' : 'Setujui'}
    </button>
    <button
      onClick={() => handleUpdateStatus(registration.id, 'rejected')}
      disabled={updatingId === registration.id}
      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      <X size={14} />
      {updatingId === registration.id ? 'Menyimpan...' : 'Tolak'}
    </button>
  </div>
) : (
  <span className="text-gray-400">-</span>
)}
```

**h) Loading State:**
```typescript
{loading ? (
  <tr>
    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
      Memuat data...
    </td>
  </tr>
) : registrations.length === 0 ? (
  <tr>
    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
      Tidak ada pendaftaran
    </td>
  </tr>
) : (
  // Table rows
)}
```

---

## 📊 Alur Data yang Baru

### 1. Load Data Pendaftaran
```
AdminRegistrations.tsx (mount)
    ↓
useEffect() triggered
    ↓
fetchRegistrations() + fetchStats()
    ↓
GET /api/activity-registrations?status=all
GET /api/activity-registrations/stats
    ↓
Backend query MySQL dengan JOIN
    ↓
Return data + stats
    ↓
Update state (registrations + stats)
    ↓
Render table dengan data real
```

### 2. Filter by Status
```
User klik tab "Pending"
    ↓
setFilter('pending')
    ↓
useEffect() triggered (filter changed)
    ↓
fetchRegistrations() dengan ?status=pending
    ↓
Backend filter by status
    ↓
Return filtered data
    ↓
Update table + update stats
```

### 3. Approve/Reject Pendaftaran
```
Admin klik "Setujui" atau "Tolak"
    ↓
handleUpdateStatus(id, 'approved')
    ↓
PATCH /api/activity-registrations/:id/status
    ↓
Backend update database
    ↓
Toast success muncul
    ↓
fetchRegistrations() + fetchStats()
    ↓
Table + stats ter-update
```

---

## 🗄️ Database Schema yang Digunakan

### Tabel: `activity_registrations`
```sql
CREATE TABLE activity_registrations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  activity_id VARCHAR(36) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  registered_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES created_accounts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_activity (user_id, activity_id)
);
```

### Tabel: `activities`
```sql
CREATE TABLE activities (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type ENUM('MAKESTA', 'LAKMUD', 'PELATIHAN', 'BAKSOS', 'LAINNYA') NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  quota INT NOT NULL,
  registered INT NOT NULL DEFAULT 0,
  status ENUM('upcoming', 'ongoing', 'completed') NOT NULL DEFAULT 'upcoming',
  ...
);
```

### Tabel: `created_accounts`
```sql
CREATE TABLE created_accounts (
  id VARCHAR(36) PRIMARY KEY,
  registration_id VARCHAR(36) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(100),
  organization VARCHAR(50),
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## ✅ Fitur yang Sekarang Bekerja

### 1. Data Real dari Database
- ✅ Semua pendaftaran dimuat dari tabel `activity_registrations`
- ✅ Data kegiatan dari tabel `activities`
- ✅ Data pendaftar dari tabel `created_accounts`
- ✅ Tidak ada data dummy lagi

### 2. Filter yang Berfungsi
- ✅ Tab "Semua" - menampilkan semua pendaftaran
- ✅ Tab "Pending" - hanya pendaftaran dengan status pending
- ✅ Tab "Disetujui" - hanya pendaftaran yang sudah disetujui
- ✅ Tab "Ditolak" - hanya pendaftaran yang ditolak
- ✅ Jumlah di setiap tab adalah data real dari database

### 3. Approve/Reject yang Berfungsi
- ✅ Tombol "Setujui" mengubah status menjadi 'approved'
- ✅ Tombol "Tolak" mengubah status menjadi 'rejected'
- ✅ Perubahan langsung tersimpan ke database
- ✅ Table otomatis refresh setelah approve/reject
- ✅ Stats otomatis ter-update
- ✅ Button disabled saat proses update (mencegah double-click)
- ✅ Toast notification untuk feedback

### 4. Loading & Error Handling
- ✅ Loading state saat fetch data
- ✅ Error handling dengan toast notification
- ✅ Empty state jika tidak ada data
- ✅ Auto-retry saat filter changed

---

## 🧪 Testing Guide

### Test 1: Verifikasi Data dari Database
```bash
1. Pastikan backend berjalan: node server/index.js
2. Buka http://localhost:5173/admin/registrations
3. Cek apakah data yang muncul sesuai dengan yang ada di database

Expected: Data dari tabel activity_registrations muncul
```

### Test 2: Verifikasi Filter
```bash
1. Klik tab "Pending"
2. Cek apakah hanya data dengan status 'pending' yang muncul
3. Cek angka di tab sesuai dengan jumlah data

Expected: 
- Hanya pending yang muncul
- Angka sesuai dengan COUNT(*) dari database
```

### Test 3: Verifikasi Approve
```bash
1. Klik tombol "Setujui" pada data dengan status Pending
2. Cek apakah toast success muncul
3. Cek apakah data pindah ke tab "Disetujui"
4. Cek apakah angka di tab berubah

Expected:
- Toast: "Pendaftaran berhasil disetujui"
- Data muncul di tab Disetujui
- Angka Pending berkurang, Disetujui bertambah
```

### Test 4: Verifikasi Reject
```bash
1. Klik tombol "Tolak" pada data dengan status Pending
2. Cek apakah toast success muncul
3. Cek apakah data pindah ke tab "Ditolak"
4. Cek apakah angka di tab berubah

Expected:
- Toast: "Pendaftaran berhasil ditolak"
- Data muncul di tab Ditolak
- Angka Pending berkurang, Ditolak bertambah
```

### Test 5: Verifikasi Database
```bash
1. Setelah approve/reject
2. Cek database: SELECT * FROM activity_registrations WHERE id = '...';

Expected: Status berubah di database
```

---

## 📝 File yang Dimodifikasi

1. **server/index.js** - Tambah 3 endpoint baru:
   - `GET /api/activity-registrations`
   - `PATCH /api/activity-registrations/:id/status`
   - `GET /api/activity-registrations/stats`

2. **src/app/pages/admin/AdminRegistrations.tsx** - Complete rewrite:
   - Remove mock data
   - Add real API integration
   - Add loading states
   - Add error handling
   - Add approve/reject functionality
   - Add stats display

---

## 🚀 Hasil Akhir

Setelah perbaikan:

✅ Halaman menampilkan data real dari database  
✅ Filter tab bekerja dengan data asli  
✅ Angka pada tab adalah jumlah data sebenarnya  
✅ Tombol "Setujui" mengubah status di database  
✅ Tombol "Tolak" mengubah status di database  
✅ Table otomatis refresh setelah approve/reject  
✅ Stats otomatis ter-update  
✅ Loading state saat fetch data  
✅ Error handling yang jelas  
✅ Toast notification untuk feedback  
✅ Tidak ada data dummy lagi  

---

## ⚠️ Catatan Penting

1. **Backend harus di-restart** untuk mengambil endpoint baru
2. **Database harus memiliki data** di tabel `activity_registrations`
3. **Tabel `created_accounts` harus diisi** (user yang melakukan pendaftaran)
4. **Tabel `activities` harus diisi** (kegiatan yang didaftari)

### Jika Belum Ada Data:

Jalankan script untuk membuat data test:
```bash
# Setelah membuat kegiatan di halaman Admin Activities
# User bisa mendaftar ke kegiatan tersebut
# Atau insert manual ke database:

INSERT INTO activity_registrations (id, user_id, activity_id, status, registered_date, created_at)
VALUES (UUID(), 'user-uuid-here', 'activity-uuid-here', 'pending', NOW(), NOW());
```

---

## 📚 Dokumentasi Terkait

- `AUDIT-FIXES.md` - Dokumentasi perbaikan fitur Tambah Kegiatan
- `BUGFIX-SUMMARY.md` - Summary bug fixes untuk tombol Tambah Kegiatan
- `server/schema.sql` - Database schema lengkap