# Setup Fitur Data Kegiatan

## 1. Setup Database

Jalankan SQL schema yang sudah diperbarui:

```bash
# Masuk ke MySQL
mysql -u root -p

# Jalankan schema
source server/schema.sql
```

Atau import manual:

```bash
mysql -u root -p ipnu_ippnu < server/schema.sql
```

## 2. Seed Data (Opsional - untuk testing)

Jalankan file seed data:

```bash
mysql -u root -p ipnu_ippnu < server/seed-activities.sql
```

File `seed-activities.sql` berisi data contoh:
- 4 kegiatan contoh (MAKESTA, LAKMUD, PELATIHAN, BAKSOS)
- 3 pendaftaran contoh

## 3. Setup Backend

```bash
# Install dependencies (jika belum)
cd server
npm install

# Jalankan server
npm run dev
```

Server akan berjalan di `http://localhost:4000`

## 4. Setup Frontend

```bash
# Dari root project
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 5. Testing Fitur

### Admin (`/admin/activities`)
1. ✅ Login sebagai admin
2. ✅ Buka halaman Data Kegiatan
3. ✅ Klik "Tambah Kegiatan" - form akan muncul
4. ✅ Isi form dan submit - data tersimpan ke database
5. ✅ Klik "Edit" - form edit muncul dengan data existing
6. ✅ Klik "Hapus" - data terhapus dari database
7. ✅ Klik "Pendaftaran" - lihat list pendaftar
8. ✅ Setujui/Tolak pendaftaran
9. ✅ Filter kegiatan (Semua, Mendatang, Berlangsung, Selesai)
10. ✅ Search kegiatan

### User (`/user/activities`)
1. ✅ Login sebagai user
2. ✅ Buka halaman Kegiatan
3. ✅ Lihat list kegiatan dari database
4. ✅ Filter kegiatan
5. ✅ Search kegiatan
6. ✅ Klik "Detail" - lihat detail kegiatan
7. ✅ Klik "Daftar" - pendaftaran ke database
8. ✅ Cek status pendaftaran (Menunggu/Disetujui/Ditolak)
9. ✅ Klik "Riwayat Pendaftaran" - lihat semua pendaftaran
10. ✅ Validasi kuota (tidak bisa daftar jika penuh)
11. ✅ Validasi pendaftaran ganda (tidak bisa daftar 2x)

### Sinkronisasi Admin ↔ User
1. ✅ Admin tambah kegiatan → langsung muncul di user
2. ✅ Admin edit kegiatan → perubahan langsung terlihat user
3. ✅ Admin hapus kegiatan → hilang dari user
4. ✅ User daftar → count peserta naik di admin
5. ✅ Admin approve/reject → status update di user

### Dashboard
1. ✅ Admin Dashboard - statistik real-time
2. ✅ User Dashboard - data real-time
3. ✅ Recent activities update otomatis
4. ✅ Pending registrations update otomatis

## 6. API Endpoints yang Tersedia

### Activities
- `GET /api/activities` - List semua kegiatan (dengan filter)
- `GET /api/activities/:id` - Detail kegiatan
- `POST /api/activities` - Tambah kegiatan (admin)
- `PUT /api/activities/:id` - Edit kegiatan (admin)
- `DELETE /api/activities/:id` - Hapus kegiatan (admin)

### Registrations
- `POST /api/activities/:id/register` - Daftar kegiatan (user)
- `GET /api/activities/:id/registrations` - List pendaftaran (admin)
- `PATCH /api/activities/:id/registrations/:registrationId/status` - Approve/reject (admin)

### Statistics
- `GET /api/activities/stats` - Statistik kegiatan (admin)
- `GET /api/my-registrations?userId=:id` - Riwayat pendaftaran user

## 7. Fitur yang Sudah Berfungsi

✅ CRUD Lengkap (Tambah, Edit, Hapus, Lihat)
✅ Data real-time dari MySQL (tidak ada dummy data)
✅ Filter kegiatan (Semua, Mendatang, Berlangsung, Selesai)
✅ Search kegiatan
✅ Detail kegiatan dengan progress bar
✅ Pendaftaran kegiatan oleh user
✅ Validasi kuota otomatis
✅ Validasi pendaftaran ganda
✅ Status kegiatan otomatis berdasarkan tanggal
✅ Riwayat pendaftaran user
✅ Statistik real-time di dashboard admin
✅ Sinkronisasi penuh Admin ↔ User
✅ Approve/Reject pendaftaran oleh admin
✅ Progress bar otomatis berdasarkan kuota

## 8. Troubleshooting

### Server tidak bisa connect ke database
- Pastikan MySQL sudah running
- Cek konfigurasi di file `.env`
- Pastikan database `ipnu_ippnu` sudah dibuat

### CORS Error
- Pastikan backend berjalan di port 4000
- Atau set `VITE_API_URL` di `.env` frontend

### Data tidak muncul
- Pastikan sudah menjalankan `schema.sql`
- Cek console browser untuk error
- Pastikan backend berjalan dan bisa diakses

## 9. Catatan Penting

1. **Status Otomatis**: Status kegiatan (Mendatang/Berlangsung/Selesai) dihitung otomatis berdasarkan tanggal
2. **Kuota**: Jumlah peserta terdaftar (`registered`) otomatis bertambah saat user mendaftar
3. **Pendaftaran**: User bisa mendaftar maksimal 1x per kegiatan (unique constraint)
4. **Validasi**: Admin tidak bisa edit kuota menjadi kurang dari jumlah peserta yang sudah terdaftar
5. **Sinkronisasi**: Semua perubahan langsung terlihat di semua halaman (real-time)

## 10. Next Steps (Opsional)

- [ ] Tambah pagination untuk list kegiatan
- [ ] Tambah upload gambar untuk kegiatan
- [ ] Tambah notifikasi email saat pendaftaran
- [ ] Tambah export data ke Excel/PDF
- [ ] Tambah QR Code untuk check-in kegiatan
- [ ] Tambah rating dan testimoni setelah kegiatan