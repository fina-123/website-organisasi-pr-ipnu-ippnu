# Fix: Fitur Berita & Artikel - Database Integration

## 🐛 Kondisi Awal (Sebelum Perbaikan)

### Masalah yang Ditemukan:

1. **Halaman Admin (`/admin/news`)**
   - ❌ Menggunakan data hardcoded dari `mockData.ts`
   - ❌ Tombol "+ Tulis Artikel" tidak berfungsi
   - ❌ Tombol Edit/Hapus/Lihat tidak terhubung ke backend
   - ❌ Tidak ada form untuk menambah/edit artikel

2. **Halaman Publik (`/berita`)**
   - ❌ Menggunakan data hardcoded dari `mockData.ts`
   - ❌ Tidak ada halaman detail artikel
   - ❌ Data tidak real-time

3. **Database**
   - ❌ Tabel `articles` belum ada

4. **Backend API**
   - ❌ Endpoint CRUD untuk artikel belum ada

---

## ✅ Solusi yang Diimplementasikan

### 1. Database Schema

**File:** `server/schema.sql`

```sql
CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  konten LONGTEXT NOT NULL,
  ringkasan TEXT DEFAULT NULL,
  kategori ENUM('Organisasi', 'Kegiatan', 'Berita', 'Pengumuman') NOT NULL DEFAULT 'Berita',
  thumbnail_url VARCHAR(500) DEFAULT NULL,
  penulis VARCHAR(255) NOT NULL DEFAULT 'Admin',
  status ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  tanggal_publish DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Backend API Endpoints

**File:** `server/index.js`

#### GET `/api/articles`
- List semua artikel
- Support query params: `?status=published` (untuk publik), `?kategori=Organisasi`
- Default: hanya tampilkan published untuk publik
- Admin bisa melihat semua (draft + published)

#### GET `/api/articles/:id`
- Detail artikel by ID

#### GET `/api/articles/slug/:slug`
- Detail artikel by slug (untuk halaman publik)
- Hanya menampilkan artikel dengan status 'published'

#### POST `/api/articles`
- Buat artikel baru (admin only)
- Auto-generate slug dari judul
- Validasi: judul, konten, kategori, tanggal_publish wajib diisi

#### PUT `/api/articles/:id`
- Edit artikel (admin only)
- Auto-generate slug baru jika judul berubah
- Handle duplicate slug dengan menambahkan angka

#### DELETE `/api/articles/:id`
- Hapus artikel (admin only)

### 3. Frontend Admin (`/admin/news`)

**File:** `src/app/pages/admin/AdminNews.tsx`

**Fitur:**
- ✅ Data dari database (bukan mock data)
- ✅ Grid view dengan thumbnail, kategori badge, tanggal
- ✅ Tombol "+ Tulis Artikel" membuka modal form
- ✅ Form dengan field: Judul, Kategori, Status, Tanggal, Penulis, Thumbnail URL, Ringkasan, Konten
- ✅ Auto-generate slug dari judul (backend)
- ✅ Tombol Edit dengan pre-fill data
- ✅ Tombol Hapus dengan konfirmasi dialog
- ✅ Tombol Lihat (membuka di tab baru)
- ✅ Loading state & error handling
- ✅ Toast notification

### 4. Frontend Publik (`/berita`)

**File:** `src/app/pages/News.tsx`

**Fitur:**
- ✅ Data dari database (hanya published articles)
- ✅ Filter by kategori (Semua, Organisasi, Kegiatan, Berita, Pengumuman)
- ✅ Card view dengan thumbnail, badge, tanggal, author
- ✅ Click card → navigate ke `/berita/:slug`
- ✅ Responsive design
- ✅ Loading state

### 5. Halaman Detail Artikel

**File:** `src/app/pages/ArticleDetail.tsx`

**Fitur:**
- ✅ Ambil data by slug dari database
- ✅ Tampilkan thumbnail (jika ada)
- ✅ Tampilkan: judul, kategori badge, tanggal, penulis, konten lengkap
- ✅ Tampilkan ringkasan di box khusus (jika ada)
- ✅ Tombol "Kembali ke Berita"
- ✅ 404 handling jika artikel tidak ditemukan
- ✅ Responsive design

### 6. Routes

**File:** `src/app/App.tsx`

```typescript
// Public
<Route path="/berita" element={<News />} />
<Route path="/berita/:slug" element={<ArticleDetail />} />

// Admin
<Route path="news" element={<AdminNews />} />
<Route path="berita/:slug" element={<ArticleDetail />} />
```

### 7. Seed Data

**File:** `server/seed-articles.sql`

```sql
INSERT INTO articles (judul, slug, konten, ringkasan, kategori, penulis, tanggal_publish, status) VALUES
(
  'Pelantikan Pengurus IPNU IPPNU Batursari Periode 2026-2028',
  'pelantikan-pengurus-ipnu-ippnu-batursari-periode-2026-2028',
  '...',
  'Pelantikan pengurus baru...',
  'Organisasi',
  'Admin',
  '2026-02-03',
  'published'
),
(
  'IPNU IPPNU Batursari Gelar Baksos Ramadhan',
  'ipnu-ippnu-batursari-gelar-baksos-ramadhan',
  '...',
  'Rangkaian kegiatan sosial...',
  'Kegiatan',
  'Ahmad Fauzi',
  '2026-03-26',
  'published'
);
```

---

## 📊 Data Flow

### Admin Create/Edit Article:
```
Admin buka /admin/news
    ↓
Fetch GET /api/articles (ambil semua, termasuk draft)
    ↓
Klik "Tulis Artikel" → buka modal form
    ↓
Isi form: judul, konten, kategori, dll
    ↓
Submit → POST /api/articles
    ↓
Backend: generate slug, validasi, insert ke database
    ↓
Return artikel baru dengan slug
    ↓
Frontend: refresh daftar, tampilkan toast sukses
```

### Public View Article:
```
User buka /berita
    ↓
Fetch GET /api/articles?status=published
    ↓
Tampilkan grid artikel published
    ↓
User klik artikel → navigate ke /berita/:slug
    ↓
Fetch GET /api/articles/slug/:slug
    ↓
Tampilkan detail artikel lengkap
```

---

## 🎯 Fitur yang Sekarang Bekerja:

### Halaman Admin (`/admin/news`):
✅ Menampilkan data REAL dari database  
✅ Filter: menampilkan semua artikel (draft + published)  
✅ Tombol "+ Tulis Artikel" berfungsi  
✅ Modal form untuk tambah/edit artikel  
✅ Auto-generate slug dari judul  
✅ Validasi form  
✅ Tombol Edit dengan pre-fill  
✅ Tombol Hapus dengan konfirmasi  
✅ Tombol Lihat (buka di tab baru)  
✅ Loading state & error handling  
✅ Toast notification  

### Halaman Publik (`/berita`):
✅ Menampilkan artikel published saja  
✅ Filter by kategori  
✅ Card dengan thumbnail, badge, tanggal, author  
✅ Click → navigate ke detail  
✅ Responsive design  

### Halaman Detail (`/berita/:slug`):
✅ Data dari database by slug  
✅ Tampilkan thumbnail, judul, kategori, tanggal, penulis  
✅ Tampilkan ringkasan di box khusus  
✅ Tampilkan konten lengkap  
✅ Tombol kembali  
✅ 404 handling  

---

## 🧪 Testing Guide:

### Test 1: Setup Database
```bash
1. Buka phpMyAdmin atau MySQL client
2. Jalankan SQL dari server/schema.sql (bagian articles)
3. Jalankan SQL dari server/seed-articles.sql

Expected: Tabel articles terisi dengan 2 artikel contoh
```

### Test 2: Restart Backend
```bash
cd "Organisasi IPNU IPPNU (1)/server"
# Ctrl+C untuk stop, lalu:
node index.js
```

### Test 3: Test Admin Page
```bash
1. Buka http://localhost:5173/admin/news
2. Login sebagai admin
3. Cek data yang muncul (harus 2 artikel dari seed data)

Expected:
- 2 artikel muncul
- Data sesuai dengan seed data
- Thumbnail placeholder muncul (karena tidak ada URL)
```

### Test 4: Test Tambah Artikel
```bash
1. Klik "Tulis Artikel"
2. Isi form:
   - Judul: "Kegiatan Baru IPNU"
   - Kategori: Kegiatan
   - Status: Published
   - Tanggal: (pilih tanggal)
   - Konten: "Isi konten artikel..."
3. Klik "Publikasi"

Expected:
- Toast: "Artikel berhasil ditambahkan"
- Modal tertutup
- Data baru muncul di daftar
- Slug ter-generate otomatis
```

### Test 5: Test Edit Artikel
```bash
1. Klik tombol Edit pada salah satu artikel
2. Ubah judul
3. Klik "Perbarui"

Expected:
- Toast: "Artikel berhasil diperbarui"
- Slug berubah sesuai judul baru
- Data ter-update di database
```

### Test 6: Test Hapus Artikel
```bash
1. Klik tombol Hapus (icon trash)
2. Konfirmasi dialog muncul
3. Klik "Hapus"

Expected:
- Dialog konfirmasi muncul
- Setelah klik "Hapus": toast success
- Data terhapus dari database
- Data hilang dari daftar
```

### Test 7: Test Halaman Publik
```bash
1. Buka http://localhost:5173/berita
2. Cek data yang muncul

Expected:
- Hanya 2 artikel published yang muncul
- Filter kategori berfungsi
- Card menampilkan data dengan benar
```

### Test 8: Test Detail Artikel
```bash
1. Di halaman /berita, klik salah satu artikel
2. Cek halaman detail

Expected:
- URL berubah ke /berita/slug-artikel
- Detail artikel muncul lengkap
- Thumbnail, judul, kategori, tanggal, penulis, konten
- Tombol "Kembali ke Berita" berfungsi
```

### Test 9: Test Sinkronisasi
```bash
1. Di halaman admin, tambah artikel baru (status: published)
2. Buka halaman publik /berita

Expected:
- Artikel baru langsung muncul di halaman publik
- Konsisten antara admin dan publik
```

---

## 📝 File yang Dimodifikasi/Dibuat:

### Backend:
1. ✅ `server/schema.sql` - Tabel articles
2. ✅ `server/index.js` - 6 endpoint baru untuk articles
3. ✅ `server/seed-articles.sql` - Data awal

### Frontend:
1. ✅ `src/app/pages/admin/AdminNews.tsx` - Full rewrite dengan database
2. ✅ `src/app/pages/News.tsx` - Updated dengan database
3. ✅ `src/app/pages/ArticleDetail.tsx` - NEW: Halaman detail artikel
4. ✅ `src/app/App.tsx` - Tambah route `/berita/:slug`

### Dokumentasi:
1. ✅ `ARTICLES-FIX.md` - Dokumentasi lengkap

---

## ⚠️ Catatan Penting:

1. **Slug Generation:** Slug di-generate otomatis di backend dari judul
2. **Duplicate Slug:** Jika slug sudah ada, backend menambahkan angka (contoh: `artikel-2`)
3. **Status Draft:** Artikel dengan status 'draft' hanya terlihat oleh admin
4. **Thumbnail:** Field opsional - jika kosong, tampilkan placeholder
5. **Konten:** Support plain text dengan line breaks (whitespace-pre-wrap)

---

## 🚀 Hasil Akhir:

✅ Admin bisa kelola artikel (Tambah/Edit/Hapus)  
✅ Data tersimpan di MySQL  
✅ Halaman publik menampilkan artikel published  
✅ Filter by kategori berfungsi  
✅ Halaman detail artikel dengan slug  
✅ Sinkronisasi real-time  
✅ Auto-generate slug  
✅ Loading state & error handling  
✅ Toast notification  
✅ Responsive design  
✅ Tidak ada data dummy  

**Status: ✅ FITUR BERITA & ARTIKEL SELESAI**