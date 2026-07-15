# Website Organisasi IPNU IPPNU Ranting Batursari

Website resmi untuk organisasi IPNU IPPNU Ranting Batursari. Website ini menyediakan informasi organisasi untuk publik serta sistem manajemen anggota dan kegiatan melalui dashboard admin dan user.

> 📌 **Desain awal project ini dibuat di Figma:**  
> [Figma Design](https://www.figma.com/design/uYlLRTQNV8ifT6IUmObS0J/Website-Organisasi-IPNU-IPPNU)

---

## 📊 Project Status

![Progress](https://img.shields.io/badge/Progress-90%25-brightgreen)
![Status](https://img.shields.io/badge/Status-Production_Ready-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)

---

## 📖 Tentang Project

Project ini dibangun untuk memenuhi tugas mata kuliah, dengan studi kasus organisasi pelajar Nahdlatul Ulama (IPNU dan IPPNU) tingkat ranting. Website mencakup halaman publik untuk profil organisasi, serta sistem dashboard berbasis peran (admin dan anggota) untuk mengelola data keanggotaan, kegiatan, berita, dan saran.

---

## ✨ Fitur

### 🌐 Halaman Publik
| Fitur | Status | Keterangan |
|-------|--------|------------|
| Beranda dengan profil singkat organisasi | ✅ Complete | Hero section, stats, about, activities, news |
| Halaman Profil, Visi & Misi | ✅ Complete | Informasi lengkap organisasi |
| Struktur organisasi | ✅ Complete | IPNU & IPPNU dengan foto dan jabatan |
| Berita dan artikel | ✅ Complete | CRUD artikel dengan kategori |
| Dokumentasi kegiatan | ✅ Complete | Galeri foto kegiatan |
| Halaman kontak | ✅ Complete | Formulir kontak dengan validasi |
| Formulir pendaftaran anggota baru | ✅ Complete | Approval workflow dengan email notifikasi |

### 👤 Dashboard User (Anggota)
| Fitur | Status | Keterangan |
|-------|--------|------------|
| Ringkasan kegiatan yang diikuti | ✅ Complete | Dashboard dengan statistik personal |
| Profil anggota | ✅ Complete | Edit profil, upload foto |
| Daftar anggota | ✅ Complete | Search dan filter by organisasi |
| Pendaftaran dan riwayat kegiatan | ✅ Complete | Register, lihat status, download sertifikat |
| Pengiriman saran/aspirasi | ✅ Complete | Form saran dengan tracking status |

### 👑 Dashboard Admin
| Fitur | Status | Keterangan |
|-------|--------|------------|
| Ringkasan statistik | ✅ Complete | Total anggota, kegiatan, artikel, saran |
| Kelola data user dan anggota | ✅ Complete | CRUD operasi dengan search |
| Kelola pendaftaran anggota | ✅ Complete | Approve/reject dengan auto-create akun |
| Kelola data kegiatan | ✅ Complete | CRUD kegiatan dengan auto-status |
| Kelola struktur organisasi | ✅ Complete | Manage pengurus IPNU/IPPNU |
| Kelola berita dan artikel | ✅ Complete | CRUD dengan publish/draft |
| Kelola saran masuk | ✅ Complete | Balas saran dengan tracking |

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Material UI |
| **Backend** | Node.js, Express, bcryptjs, helmet, cors |
| **Database** | MySQL 8.0 |
| **Package Manager** | pnpm |
| **Build Tool** | Vite |

---

## 📁 Struktur Folder
├── server/ # Backend API (Express, koneksi database)
│ ├── index.js # Main server (2043 lines)
│ ├── db.js # Database connection
│ ├── schema.sql # Database structure
│ └── uploads/ # File storage (profile photos, dokumentasi)
│
├── src/ # Frontend React App
│ ├── app/
│ │ ├── components/ # Komponen UI (shadcn/ui)
│ │ ├── pages/ # Halaman publik, admin, dan user
│ │ └── context/ # Context API (autentikasi)
│ ├── lib/ # Konfigurasi
│ └── styles/ # File styling global
│
└── guidelines/ # Dokumentasi panduan project

text

---

## 🚀 Cara Menjalankan di Localhost

### 1. Clone Repository

```bash
git clone https://github.com/fina-123/website-organisasi-pr-ipnu-ippnu.git
cd website-organisasi-pr-ipnu-ippnu
2. Install Dependencies
bash
# Install frontend dependencies
pnpm install

# Install backend dependencies
cd server
pnpm install
cd ..
3. Setup Database
a. Buat database MySQL:

sql
CREATE DATABASE ipnu_ippnu;
USE ipnu_ippnu;
b. Import schema:

bash
mysql -u root -p ipnu_ippnu < server/schema.sql
4. Setup Environment Variables
Copy file .env.example menjadi .env:

bash
cp .env.example .env
Isi file .env:

env
VITE_API_URL=http://localhost:4000
Isi file server/.env (buat baru jika belum ada):

env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ipnu_ippnu
PORT=4000
5. Jalankan Backend
bash
cd server
pnpm run server
# Server berjalan di http://localhost:4000
6. Jalankan Frontend (Terminal baru)
bash
cd ..
pnpm run dev
# Frontend berjalan di http://localhost:5173
7. Buka Browser
Buka http://localhost:5173 untuk mengakses website.

🔑 Akun Default
Peran	Email	Password
Admin	admin@ipnuipnu.com	ipnuippnu123
User	ahmad.fauzi@example.com	ipnuippnu123

👨‍💻 Penulis
Fina
NIM: 101230006