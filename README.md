# Website Organisasi IPNU IPPNU Ranting Batursari

Website resmi untuk organisasi IPNU IPPNU Ranting Batursari, dibuat sebagai tugas kuliah. Website ini menyediakan informasi organisasi untuk publik serta sistem manajemen anggota dan kegiatan melalui dashboard admin dan user.

Desain awal project ini dibuat di Figma: https://www.figma.com/design/uYlLRTQNV8ifT6IUmObS0J/Website-Organisasi-IPNU-IPPNU

## Tentang Project

Project ini dibangun untuk memenuhi tugas mata kuliah, dengan studi kasus organisasi pelajar Nahdlatul Ulama (IPNU dan IPPNU) tingkat ranting. Website mencakup halaman publik untuk profil organisasi, serta sistem dashboard berbasis peran (admin dan anggota) untuk mengelola data keanggotaan, kegiatan, berita, dan saran.

## Fitur

### Halaman Publik
- Beranda dengan profil singkat organisasi
- Halaman Profil, Visi & Misi
- Struktur organisasi
- Berita dan artikel
- Dokumentasi kegiatan
- Halaman kontak
- Formulir pendaftaran anggota baru

### Dashboard User (Anggota)
- Ringkasan kegiatan yang diikuti dan pendaftaran aktif
- Profil anggota
- Daftar anggota
- Pendaftaran dan riwayat kegiatan
- Pengiriman saran/aspirasi

### Dashboard Admin
- Ringkasan statistik (total anggota, kegiatan aktif, pendaftaran pending, total berita)
- Kelola data user dan anggota
- Kelola pendaftaran anggota dan kegiatan
- Kelola data kegiatan dan struktur organisasi
- Kelola berita dan artikel
- Melihat dan membalas saran masuk dari anggota

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: MySQL, Supabase
- **Tools**: pnpm

## Struktur Folder

```
├── server/              # Backend API (Express, koneksi database)
├── src/
│   ├── app/
│   │   ├── components/  # Komponen UI (termasuk komponen shadcn/ui)
│   │   ├── pages/       # Halaman publik, admin, dan user
│   │   └── context/     # Context API (autentikasi, dll)
│   ├── lib/             # Konfigurasi Supabase
│   └── styles/          # File styling global
├── supabase/            # Schema database Supabase
└── guidelines/          # Dokumentasi panduan project
```

## Cara Menjalankan di Localhost

1. Clone repository ini
   ```bash
   git clone https://github.com/fina-123/website-organisasi-pr-ipnu-ippnu.git
   cd website-organisasi-pr-ipnu-ippnu
   ```

2. Install dependencies
   ```bash
   npm i
   ```

3. Salin file environment Supabase
   ```bash
   cp .env.example .env
   ```
   Lalu isi variabel berikut di file `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Buat tabel Supabase untuk pendaftaran anggota menggunakan schema SQL di `supabase/schema.sql`

5. Jalankan server backend
   ```bash
   cd server
   npm install
   npm start
   ```

6. Jalankan aplikasi frontend (di terminal terpisah)
   ```bash
   npm run dev
   ```

7. Buka browser ke `http://localhost:5173`

## Penulis

**Fina**
NIM: 101230006

## Lisensi

Project ini dibuat untuk keperluan tugas akademik.
