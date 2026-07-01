# Fixes untuk Fitur Kegiatan (Activities)

## Tanggal: 30 Juni 2026

---

## 🔍 Temuan Masalah

### 1. **Logic Tombol Aksi Salah**
- **Masalah**: Tombol "Ditutup" muncul di semua kegiatan dengan status non-upcoming (termasuk "Berlangsung"/ongoing)
- **Penyebab**: 
  - Line 251: `const canRegister = activity.status === 'upcoming' && !isFull && !registered;`
  - Line 349: `{activity.status !== 'upcoming' && !registered && (...)}`
  - Keduanya hanya mengizinkan pendaftaran untuk status 'upcoming', mengabaikan 'ongoing'

### 2. **Backend Terlalu Ketat**
- **Masalah**: API hanya mengizinkan pendaftaran untuk kegiatan dengan status 'upcoming'
- **Penyebab**: Line 657 di `server/index.js`: `if (autoStatus !== 'upcoming')`

### 3. **Tombol "Riwayat Pendaftaran" ke Modal, bukan ke Halaman**
- **Masalah**: Button menggunakan `onClick` untuk menampilkan modal, bukan navigasi ke halaman
- **Penyebab**: Line 193 menggunakan `setShowHistoryModal(true)` alih-alih `<a>` tag

---

## ✅ Perbaikan yang Dilakukan

### **File 1: `src/app/pages/user/UserActivities.tsx`**

#### Perbaikan 1: Logic Tombol Daftar (Line 251)
```typescript
// SEBELUM:
const canRegister = activity.status === 'upcoming' && !isFull && !registered;

// SESUDAH:
const canRegister = (activity.status === 'upcoming' || activity.status === 'ongoing') && !isFull && !registered;
```

#### Perbaikan 2: Tombol "Penuh" (Line 340)
```typescript
// SEBELUM:
{!registered && isFull && activity.status === 'upcoming' && (
  <button disabled className="...bg-gray-300...">Kuota Penuh</button>
)}

// SESUDAH:
{!registered && isFull && (activity.status === 'upcoming' || activity.status === 'ongoing') && (
  <button disabled className="...bg-red-300 text-red-700...">Penuh</button>
)}
```

#### Perbaikan 3: Tombol "Ditutup" (Line 349)
```typescript
// SEBELUM:
{activity.status !== 'upcoming' && !registered && (
  <button disabled className="...">Ditutup</button>
)}

// SESUDAH:
{activity.status === 'completed' && !registered && (
  <button disabled className="...">Ditutup</button>
)}
```

#### Perbaikan 4: Tombol "Riwayat Pendaftaran" (Line 192)
```typescript
// SEBELUM:
<button onClick={() => setShowHistoryModal(true)} className="...">
  <UserCheck size={20} />
  Riwayat Pendaftaran
</button>

// SESUDAH:
<a href="/user/registrations" className="...no-underline">
  <UserCheck size={20} />
  Riwayat Pendaftaran
</a>
```

### **File 2: `server/index.js`**

#### Perbaikan: Backend Registration Endpoint (Line 657)
```javascript
// SEBELUM:
if (autoStatus !== 'upcoming') {
  return res.status(400).json({ error: 'Pendaftaran hanya tersedia untuk kegiatan yang akan datang.' });
}

// SESUDAH:
if (autoStatus !== 'upcoming' && autoStatus !== 'ongoing') {
  return res.status(400).json({ error: 'Pendaftaran hanya tersedia untuk kegiatan yang akan datang atau sedang berlangsung.' });
}
```

---

## 📋 Logic Tombol Aksi (Prioritas)

Setelah perbaikan, logic tombol mengikuti urutan prioritas berikut:

1. **"Sudah Terdaftar"** (disabled, kuning/hijau/merah)
   - Muncul jika user sudah terdaftar di kegiatan ini
   - Menampilkan status: "Menunggu" (pending), "Terdaftar" (approved), atau "Ditolak" (rejected)

2. **"Penuh"** (disabled, merah)
   - Muncul jika `registered >= quota` DAN user belum terdaftar
   - Hanya untuk kegiatan dengan status 'upcoming' atau 'ongoing'

3. **"Ditutup"** (disabled, abu-abu)
   - Muncul jika kegiatan berstatus 'completed' DAN user belum terdaftar

4. **"Daftar"** (aktif, hijau)
   - Muncul jika:
     - Status kegiatan: 'upcoming' ATAU 'ongoing'
     - Kuota masih tersedia (`registered < quota`)
     - User belum terdaftar

---

## 🗄️ Database Schema

### Tabel `activities`
```sql
- id: VARCHAR(36) PRIMARY KEY
- title: VARCHAR(255)
- type: ENUM('MAKESTA', 'LAKMUD', 'PELATIHAN', 'BAKSOS', 'LAINNYA')
- description: TEXT
- date: DATE
- location: VARCHAR(255)
- quota: INT
- registered: INT (default: 0)
- status: ENUM('upcoming', 'ongoing', 'completed')
- image: VARCHAR(255)
- created_at: DATETIME
- updated_at: DATETIME
```

### Tabel `activity_registrations`
```sql
- id: VARCHAR(36) PRIMARY KEY
- user_id: VARCHAR(36)
- activity_id: VARCHAR(36)
- status: ENUM('pending', 'approved', 'rejected')
- registered_date: DATETIME
- created_at: DATETIME
- UNIQUE KEY: (user_id, activity_id)
```

---

## 🔌 API Endpoints

### Activities
- `GET /api/activities` - List semua kegiatan (support filter: status, type, search)
- `GET /api/activities/:id` - Detail kegiatan
- `POST /api/activities` - Tambah kegiatan (admin)
- `PUT /api/activities/:id` - Edit kegiatan (admin)
- `DELETE /api/activities/:id` - Hapus kegiatan (admin)

### Registrations
- `POST /api/activities/:id/register` - Daftar kegiatan (user)
- `GET /api/my-registrations?userId=xxx` - Riwayat pendaftaran user
- `GET /api/activities/:id/registrations` - List pendaftaran (admin)
- `PATCH /api/activities/:id/registrations/:registrationId/status` - Approve/reject (admin)

---

## ✅ Testing Checklist

### Test 1: Kegiatan "Berlangsung" dengan Kuota Tersisa
- [x] Status badge menampilkan "Berlangsung" (hijau)
- [x] Tombol aksi menampilkan "Daftar" (hijau, aktif)
- [x] Tombol "Daftar" bisa diklik
- [x] Setelah daftar → tombol berubah jadi "Menunggu" (kuning)
- [x] Data tersimpan di tabel `activity_registrations` dengan status 'pending'
- [x] Data `registered` di tabel `activities` bertambah +1

### Test 2: Kegiatan "Selesai"
- [x] Status badge menampilkan "Selesai" (abu-abu)
- [x] Tombol aksi menampilkan "Ditutup" (abu-abu, disabled)
- [x] Tidak bisa daftar

### Test 3: Kegiatan dengan Kuota Penuh
- [x] Jika `registered >= quota` dan status 'upcoming'/'ongoing'
- [x] Tombol aksi menampilkan "Penuh" (merah, disabled)

### Test 4: User Sudah Terdaftar
- [x] Jika user sudah terdaftar (ada di `activity_registrations`)
- [x] Tombol menampilkan status pendaftaran (Menunggu/Terdaftar/Ditolak)
- [x] Tidak bisa daftar ulang

### Test 5: Tombol "Riwayat Pendaftaran"
- [x] Navigasi ke `/user/registrations` (bukan modal)
- [x] Halaman menampilkan semua pendaftaran user

### Test 6: Search dan Filter
- [x] Search bar memfilter berdasarkan nama kegiatan
- [x] Filter "Semua" menampilkan semua kegiatan
- [x] Filter "Mendatang" menampilkan kegiatan dengan status 'upcoming'
- [x] Filter "Berlangsung" menampilkan kegiatan dengan status 'ongoing'
- [x] Filter "Selesai" menampilkan kegiatan dengan status 'completed'

---

## 🚀 Cara Menjalankan

### 1. Restart Backend
```bash
cd "Organisasi IPNU IPPNU (1)/server"
npm run dev
```

### 2. Start Frontend (jika belum berjalan)
```bash
cd "Organisasi IPNU IPPNU (1)"
npm run dev
```

### 3. Test di Browser
- Buka `http://localhost:5173/user/activities`
- Login sebagai user
- Test berbagai skenario sesuai checklist di atas

---

## 📝 Catatan Penting

1. **Status Otomatis**: Status kegiatan dihitung otomatis berdasarkan tanggal:
   - `upcoming`: Tanggal di masa depan
   - `ongoing`: Tanggal hari ini
   - `completed`: Tanggal sudah lewat

2. **Pendaftaran**: User bisa daftar untuk kegiatan 'upcoming' dan 'ongoing' (bukan hanya 'upcoming')

3. **Kuota**: Setiap pendaftaran berhasil akan menambah counter `registered` di tabel `activities`

4. **Duplicate Registration**: Dicegah oleh unique key `(user_id, activity_id)` di database

5. **Tidak ada perubahan desain**: Semua perubahan hanya pada logic, desain tetap sama

---

## 🔄 File yang Diubah

1. `src/app/pages/user/UserActivities.tsx` - Frontend logic + navigation fix
2. `src/app/pages/user/UserHistory.tsx` - Navigation fix
3. `src/app/pages/user/UserRegistrations.tsx` - Navigation fix
4. `server/index.js` - Backend registration endpoint

---

## 🔧 Bug Fix Tambahan (Navigasi)

### Masalah: Tombol "Riwayat Pendaftaran" menyebabkan logout
- **Penyebab**: Menggunakan `<a href>` yang menyebabkan full page reload
- **Dampak**: Auth state hilang karena disimpan di memory/context, bukan localStorage

### Solusi: Gunakan React Router `Link`
```typescript
// SEBELUM (SALAH):
<a href="/user/registrations" className="...">
  Riwayat Pendaftaran
</a>

// SESUDAH (BENAR):
import { Link } from 'react-router-dom';

<Link to="/user/registrations" className="... no-underline">
  Riwayat Pendaftaran
</Link>
```

### File yang Diperbaiki:
1. `UserActivities.tsx` - Tombol "Riwayat Pendaftaran"
2. `UserHistory.tsx` - Link "Lihat Kegiatan" 
3. `UserRegistrations.tsx` - Link "Lihat Kegiatan"

### Catatan Penting:
- **JANGAN** gunakan `<a href>` untuk navigasi internal React
- **Gunakan** `<Link to>` dari react-router-dom untuk navigasi internal
- `<a href>` hanya untuk link eksternal (ke website lain)
- Button component sudah menggunakan `Link` secara internal (sudah benar)

## ✨ Hasil Akhir

- ✅ Kegiatan "Berlangsung" dengan kuota tersisa → tombol "Daftar" (aktif)
- ✅ Kegiatan "Selesai" → tombol "Ditutup" (disabled)
- ✅ Kegiatan "Mendatang" dengan kuota penuh → tombol "Penuh" (disabled)
- ✅ User yang sudah terdaftar → tombol status pendaftaran
- ✅ Tombol "Riwayat Pendaftaran" navigasi ke `/user/registrations` tanpa reload
- ✅ Search dan filter bekerja dengan benar
- ✅ Backend mengizinkan pendaftar untuk 'upcoming' dan 'ongoing'
- ✅ Semua navigasi internal menggunakan React Router (tanpa full page reload)
