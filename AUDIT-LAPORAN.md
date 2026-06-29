# Audit Laporan - Fitur Data Kegiatan

## 1. Daftar Masalah yang Ditemukan

### Backend (server/index.js)
- ❌ Tidak ada endpoint API untuk CRUD kegiatan
- ❌ Tidak ada endpoint untuk pendaftaran kegiatan
- ❌ Tidak ada endpoint untuk statistik kegiatan
- ❌ Tidak ada validasi kuota atau pendaftaran ganda

### Database (server/schema.sql)
- ❌ Tidak ada tabel `activities` untuk menyimpan data kegiatan
- ❌ Tidak ada tabel `activity_registrations` untuk menyimpan pendaftaran
- ❌ Tidak ada indeks untuk optimasi query kegiatan

### Frontend Admin (AdminActivities.tsx)
- ❌ Menggunakan data dummy (`mockActivities`)
- ❌ Tidak ada koneksi ke API/backend
- ❌ Tombol "Tambah Kegiatan" tidak berfungsi
- ❌ Tombol "Edit" tidak berfungsi
- ❌ Tombol "Hapus" tidak berfungsi
- ❌ Tidak ada form untuk tambah/edit kegiatan
- ❌ Tidak ada filter (Semua, Mendatang, Berlangsung, Selesai)
- ❌ Tidak ada detail kegiatan

### Frontend User (UserActivities.tsx)
- ❌ Menggunakan data dummy (`mockActivities`)
- ❌ Tidak ada koneksi ke API/backend
- ❌ Tombol "Daftar Sekarang" tidak berfungsi
- ❌ Tidak ada validasi kuota
- ❌ Tidak ada validasi pendaftaran ganda
- ❌ Tidak ada riwayat pendaftaran
- ❌ Tidak ada detail kegiatan

### Admin Dashboard (AdminDashboard.tsx)
- ❌ Statistik kegiatan tidak akurat (menggunakan mock data)
- ❌ Tidak ada statistik real-time dari database

## 2. File yang Harus Diperbaiki

1. `server/schema.sql` - Tambah tabel activities dan activity_registrations
2. `server/index.js` - Tambah endpoint API untuk kegiatan
3. `src/app/pages/admin/AdminActivities.tsx` - Integrasi dengan API
4. `src/app/pages/user/UserActivities.tsx` - Integrasi dengan API
5. `src/app/pages/admin/AdminDashboard.tsx` - Statistik real-time
6. `src/app/pages/user/UserDashboard.tsx` - Data real-time
7. `src/app/pages/user/UserHistory.tsx` - Riwayat pendaftaran

## 3. Kode yang Harus Ditambahkan/Diubah

### A. Database Schema (schema.sql)
- Tabel `activities` dengan kolom: id, title, type, description, date, location, quota, registered, status, created_at, updated_at
- Tabel `activity_registrations` dengan kolom: id, user_id, activity_id, status, registered_date, created_at
- Indeks untuk optimasi query

### B. Backend API Endpoints
- `GET /api/activities` - List semua kegiatan dengan filter
- `GET /api/activities/:id` - Detail kegiatan
- `POST /api/activities` - Tambah kegiatan (admin)
- `PUT /api/activities/:id` - Edit kegiatan (admin)
- `DELETE /api/activities/:id` - Hapus kegiatan (admin)
- `POST /api/activities/:id/register` - Daftar kegiatan (user)
- `GET /api/activities/:id/registrations` - List pendaftaran (admin)
- `PATCH /api/activities/:id/registrations/:registrationId/status` - Approve/reject (admin)
- `GET /api/activities/stats` - Statistik kegiatan (admin)
- `GET /api/my-registrations` - Riwayat pendaftaran user

### C. Frontend Changes
- Ganti semua `mockActivities` dengan API calls
- Implementasi form tambah/edit kegiatan
- Implementasi modal detail kegiatan
- Implementasi sistem pendaftaran dengan validasi
- Implementasi filter kegiatan
- Implementasi progress bar otomatis
- Implementasi status otomatis berdasarkan tanggal

## 4. Query SQL yang Diperlukan

```sql
-- Tabel Activities
CREATE TABLE activities (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type ENUM('MAKESTA', 'LAKMUD', 'PELATIHAN', 'BAKSOS', 'LAINNYA') NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  quota INT NOT NULL,
  registered INT DEFAULT 0,
  status ENUM('upcoming', 'ongoing', 'completed') NOT NULL DEFAULT 'upcoming',
  image VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Activity Registrations
CREATE TABLE activity_registrations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  activity_id VARCHAR(36) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  registered_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_activity (user_id, activity_id)
);

-- Indeks untuk optimasi
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_date ON activities(date);
CREATE INDEX idx_activity_registrations_user_id ON activity_registrations(user_id);
CREATE INDEX idx_activity_registrations_activity_id ON activity_registrations(activity_id);
CREATE INDEX idx_activity_registrations_status ON activity_registrations(status);
```

## 5. Endpoint API yang Diperlukan

```
GET    /api/activities                      - List semua kegiatan
GET    /api/activities/:id                  - Detail kegiatan
POST   /api/activities                      - Tambah kegiatan (admin)
PUT    /api/activities/:id                  - Edit kegiatan (admin)
DELETE /api/activities/:id                  - Hapus kegiatan (admin)
POST   /api/activities/:id/register         - Daftar kegiatan (user)
GET    /api/activities/:id/registrations    - List pendaftaran (admin)
PATCH  /api/activities/:id/registrations/:registrationId/status - Approve/reject
GET    /api/activities/stats                - Statistik kegiatan (admin)
GET    /api/my-registrations                - Riwayat pendaftaran user
```

## 6. Implementasi Lengkap

Akan diimplementasikan dalam file selanjutnya.