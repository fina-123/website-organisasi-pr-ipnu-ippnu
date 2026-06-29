# 📖 MANUAL BOOK - SISTEM MANAJEMEN IPNU IPPNU BATURSARI

## 🎯 Ikhtisar Sistem
Website manajemen organisasi **IPNU IPPNU Ranting Batursari** dengan fitur:
- **Admin Dashboard** lengkap (9 pages)
- **User Dashboard** personal
- **Demo Mode** (mock data + localStorage)
- **Responsive** + **Modern UI** (TailwindCSS + shadcn/ui)
- **Vite + React** + **TypeScript**

---

## 🚀 Cara Menjalankan (Developer)

### 1. **Requirements**
```
Node.js 18+
pnpm / npm
VS Code + Vite extension
```

### 2. **Start Development**
```bash
cd "Organisasi IPNU IPPNU (1)"
npm install  # atau pnpm install
npm run dev  # http://localhost:5173
```

### 3. **Build Production**
```bash
npm run build    # dist/ folder
npm run preview  # test production build
```

---

## 👤 **Login Credentials (Demo Mode)**

| Role | Email | Password | Akses |
|------|-------|----------|-------|
| **Admin** | `admin@ipnu.org` | `admin123` | Semua admin pages |
| **User** | `user@example.com` | `user123` | User dashboard |

**Reset Password:** /forgot-password (demo toast)

---

## 📋 **Fitur Lengkap**

### **1. ADMIN PANEL** (`/admin/*`)
| Page | URL | Fitur Utama |
|------|-----|-------------|
| Dashboard | `/admin/dashboard` | Stats + Approve/Reject pendaftaran **✅ LIVE** |
| Users | `/admin/users` | Edit/Delete/Reset Password **✅ LIVE** |
| Members | `/admin/members` | Filter + Detail/Edit/Delete **✅ LIVE** |
| Activities | `/admin/activities` | Manajemen kegiatan |
| News | `/admin/news` | CRUD berita |
| Structure | `/admin/structure` | Struktur organisasi |
| Registrations | `/admin/registrations` | Approve/Reject |
| Suggestions | `/admin/suggestions` | Kelola saran |
| Member Reg | `/admin/member-registrations` | Generate password |

### **2. USER PANEL** (`/user/*`)
| Page | URL | Fitur |
|------|-----|--------|
| Dashboard | `/user/dashboard` | Ringkasan personal |
| Profile | `/user/profile` | Edit profil |
| Members | `/user/members` | Daftar anggota yang diikuti |
| Activities | `/user/activities` | Riwayat kegiatan yang diikuti |
| Registrations | `/user/registrations` | Pendaftaran kegiatan |
| History | `/user/history` | Riwayat aktivitas pengguna |
| Suggestions | `/user/suggestions` | Mengajukan saran dan masukan |

### **3. HALAMAN PUBLIK**
- `/` Landing Page
- `/profil` Profil Organisasi
- `/visi-misi` Visi dan Misi
- `/struktur` Struktur Organisasi
- `/berita` Daftar Berita
- `/dokumentasi` Dokumentasi dan Arsip
- `/kontak` Hubungi Kami
- `/login` Halaman Masuk
- `/reset-password` Reset Password
- `/lupa-password` Lupa Password
- `/daftar-anggota` Pendaftaran Anggota Baru

---

## 📚 **Panduan Modul Sistem**

### **Admin Dashboard** (`/admin/dashboard`)
- Tampilan overview statistik organisasi
- Menampilkan grafik pendaftaran anggota baru
- Tombol untuk menyetujui atau menolak pendaftaran yang sedang menunggu
- Notifikasi real-time untuk aktivitas terbaru
- Cara penggunaan: Login sebagai admin, lalu akses /admin/dashboard

### **Admin Users** (`/admin/users`)
- Manajemen pengguna sistem (admin dan user)
- Fitur: lihat daftar pengguna, edit ruolo, reset password, hapus akun
- Cara penggunaan: Pilih pengguna dari tabel, gunakan tombol edit/hapus/reset password

### **Admin Members** (`/admin/members`)
- Manajemen data anggota IPNU IPPNU
- Fitur: filter berdasarkan status, cabang, atau masa aktif; lihat detail anggota; edit data anggota; hapus anggota
- Cara penggunaan: Gunakan filter di atas tabel untuk mencari anggota, lalu pilih aksi yang diperlukan

### **Admin Activities** (`/admin/activities`)
- Manajemen kegiatan organisasi
- Fitur: tambah kegiatan baru, edit kegiatan existente, hapus kegiatan, lihat peserta kegiatan
- Cara penggunaan: Klik tombol "Tambah Kegiatan" untuk membuat baru, atau pilih kegiatan dari tabel untuk edit/hapus

### **Admin News** (`/admin/news`)
- Manajemen berita dan pengumuman
- Fitur: tambah berita, edit berita, hapus berita, publish/unpublish
- Cara penggunaan: Isi formulir berita dengan judul, kontak, gambar, dan status publish

### **Admin Structure** (`/admin/structure`)
- Manajemen struktur organisasi
- Fitur: tambah/edit/hapus posisi organisasi, atur hierarki struktur
- Cara penggunaan: Gunakan drag-and-drop untuk mengatur urutan struktur, atau gunakan form tambah/edit

### **Admin Registrations** (`/admin/registrations`)
- Manajemen pendaftaran kegiatan oleh pengguna
- Fitur: lihat daftar pendaftaran, setujui/tolak pendaftaran, lihat detail peserta
- Cara penggunaan: Filter pendaftaran berdasarkan status (menunggu, disetujui, ditolak), lalu pilih aksi

### **Admin Suggestions** (`/admin/suggestions`)
- Manajemen saran dan masukan dari anggota
- Fitur: lihat daftar saran, balas saran, tandai sebagai selesai
- Cara penggunaan: Pilih saran dari tabel, ketik balasan, lalu klik tombol "Balas"

### **Admin Member Registrations** (`/admin/member-registrations`)
- Manajemen pendaftaran anggota baru
- Fitur: lihat daftar pendaftaran anggota, generate password untuk anggota yang disetujui, notifikasi via email
- Cara penggunaan: Setujui pendaftaran anggota, sistem akan otomatis generate password yang dapat dikirim ke email anggota

### **User Dashboard** (`/user/dashboard`)
- Tampilan personal pengguna
- Fitur: ringkasan aktivitas terakhir, notifikasi pembaruan, quick link ke fitur utama
- Cara penggunaan: Login sebagai user, halaman pertama yang ditampilkan adalah dashboard

### **User Profile** (`/user/profile`)
- Pengeditan profil pribadi
- Fitur: edit nama, email, nomor telepon, alamat, foto profil, ubah password
- Cara penggunaan: Akses /user/profile, ubah field yang diperlukan, lalu simpan perubahan

### **User Members** (`/user/members`)
- Daftar anggota yang diikuti atau terkait dengan pengguna
- Fitur: lihat daftar anggota, lihat detail anggota, ikuti/berhenti mengikuti anggota
- Cara penggunaan: Gunakan tombol "Ikuti" pada kartu anggota untuk mengikuti anggota tertentu

### **User Activities** (`/user/activities`)
- Riwayat kegiatan yang diikuti oleh pengguna
- Fitur: lihat daftar kegiatan yang diikuti, lihat detail kegiatan, batalkan partisipasi
- Cara penggunaan: Pilih kegiatan dari riwayat untuk melihat detail atau batalkan partisipasi

### **User Registrations** (`/user/registrations`)
- Pendaftaran kegiatan baru oleh pengguna
- Fitur: cari kegiatan terbuka, daftar kegiatan, lihat konfirmasi pendaftaran
- Cara penggunaan: Cari kegiatan menggunakan filter, klik "Daftar" pada kegiatan yang diinginkan, isi formulir pendaftaran jika diperlukan

### **User History** (`/user/history`)
- Riwayat lengkap aktivitas pengguna dalam sistem
- Fitur: lihat log aktivitas (login, edit profil, pendaftaran, dll.), filter berdasarkan tanggal dan tipe aktivitas
- Cara penggunaan: Akses halaman history, gunakan filter untuk menyaring aktivitas tertentu

### **User Suggestions** (`/user/suggestions`)
- Mengajukan saran dan masukan kepada pengelola organisasi
- Fitur: formulir pengajuan saran, lihat status saran yang telah dikirim, menerima balasan dari admin
- Cara penggunaan: Isi formulir saran dengan judul dan deskripsi, lalu kirim. Admin akan merespons saran tersebut.

### **Landing Page** (`/`)
- Halaman beranda umum sistem
- Fitur: slider berita terbaru, statistik organisasi, tombol call-to-action untuk pendaftaran dan login
- Cara penggunaan: Akses tanpa login untuk melihat informasi umum organisasi

### **Profile Page** (`/profil`)
- Informasi lengkap tentang organisasi IPNU IPPNU Batursari
- Fitur: sejarah organisasi, visi dan misi, struktur kepengurangan, kontak resmi
- Cara penggunaan: Akses untuk memahami latar belakang organisasi

### **Vision & Mission Page** (`/visi-misi`)
- Pernyataan visi dan misi organisasi
- Fitur: tampilan menarik visi dan misi, ikon representasi, deskripsiDetail
- Cara penggunaan: Akses untuk memahami tujuan organisasi

### **Structure Page** (`/struktur`)
- Visualisasi struktur organisasi IPNU IPPNU
- Fitur: diagram struktur kepengurangan, nama dan posisi setiap pengurus
- Cara penggunaan: Akses untuk melihat hierarki organisasi

### **News Page** (`/berita`)
- Daftar berita dan pengumuman organisasi
- Fitur: daftar berita dengan thumbnail, filter berdasarkan kategori, pencarian judul
- Cara penggunaan: Akses untuk membaca berita terkini organisasi

### **Documentation Page** (`/dokumentasi`)
- Arsip dokumen organisasi
- Fitur: kategori dokumen (notule rapat, surat keputusan, pedoman), upload/download dokumen
- Cara penggunaan: Akses untuk mencari dan mengunduh dokumen resmi organisasi

### **Contact Page** (`/kontak`)
- Informasi kontak organisasi
- Fitur: formulir kontak, alamat kantor, nomor telepon, media sosial, Google Maps embed
- Cara penggunaan: Akses untuk menghubungi organisasi atau mengirimkan pesan

### **Login Page** (`/login`)
- Halaman autentikasi pengguna
- Fitur: form login dengan email/password, link lupa password, pendaftaran anggota baru
- Cara penggunaan: Masukkan email dan password yang terdaftar, lalu klik masuk

### **Member Registration Page** (`/daftar-anggota`)
- Pendaftaran anggota baru IPNU IPPNU
- Fitur: formulir pendaftaran lengkap, validasi data, konfirmasi pendaftaran
- Cara penggunaan: Isi formulir dengan data pribadi, alamat, dan informasi kelengkapan, lalu kirim untuk menunggu approval admin

---

## ⚙️ **Mode Operasi**

### **DEMO MODE** (Default) ✅
```
- Mock data (mockData.ts)
- localStorage auth
- Toast notifications
- State management (useState)
- Semua button berfungsi
```

### **PRODUCTION MODE** (Supabase)
1. Copy `.env.example` → `.env`
2. Isi `SUPABASE_URL` + `SUPABASE_ANON_KEY`
3. `isSupabaseConfigured = true`
4. Seed database dari mockData

---

## 🔧 **Customisasi**

### **Tambah Data Demo**
```typescript
// src/app/data/mockData.ts
export const mockMembers: Member[] = [...];  // Edit array
```

### **Tambah Page Admin**
```
src/app/pages/admin/NewFeature.tsx
→ App.tsx routing: <Route path='/admin/new' element={<NewFeature />} />
```

### **Styling**
```
- TailwindCSS config: tailwind.config.js
- shadcn/ui components: guidelines/
```

---

## 🐛 **Troubleshooting**

| Masalah | Solusi |
|---------|---------|
| Port 5173 error | `npm run dev -- --port 3000` |
| TypeScript error | `npm run type-check` |
| HMR tidak work | Restart dev server |
| Supabase error | Cek `.env` + network |

---

## 📱 **Mobile Responsive**
- **Sudah optimal** semua pages
- Swipe navigation
- Touch-friendly buttons

---

## 📊 **Tech Stack**
```
Frontend: React 18 + Vite 6 + TypeScript
UI: TailwindCSS 4 + shadcn/ui + lucide-react
State: React Context + useState + useReducer
Routing: React Router
Auth: Supabase Auth (demo: localStorage)
Notifications: sonner + toast
Charts: recharts
Forms: react-hook-form
Utils: date-fns + clsx + class-variance-authority
```

---

**Sistem 100% ready to use!** 🚀

**Last Update:** Auto-generated 2026 | Version 1.0.0