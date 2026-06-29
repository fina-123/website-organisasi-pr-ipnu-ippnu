# Panduan Setup Aplikasi IPNU IPPNU

## ⚠️ PENTING: Setup Database MySQL

MySQL memerlukan setup manual karena butuh hak administrator. Silakan ikuti langkah-langkah ini:

---

## 📋 LANGKAH 1: Setup MySQL (Lakukan Sekali)

### A. Buka Command Prompt sebagai Administrator
1. Tekan `Win + X`
2. Pilih **"Windows Terminal (Admin)"** atau **"Command Prompt (Admin)"**

### B. Inisialisasi MySQL
```cmd
cd "C:\Program Files\MySQL\MySQL Server 8.4\bin"
mysqld --initialize-insecure --console
```

Tunggu sampai muncul pesan seperti ini:
```
[Note] [MY-010116] [Server] C:\Program Files\MySQL\MySQL Server 8.4\data\DESKTOP-xxx.000001\ib_logfile0 was created
```

### C. Install MySQL Service
```cmd
mysqld --install MySQL80
```

### D. Start MySQL Service
```cmd
net start MySQL80
```

Atau via GUI:
1. Tekan `Win + R`
2. Ketik `services.msc`
3. Cari **"MySQL80"**
4. Klik kanan → **Start**

### E. Buat Database
Buka **Command Prompt BARU** (tidak perlu admin):

```cmd
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root
```

Setelah masuk (akan muncul `mysql>`), ketik:

```sql
CREATE DATABASE IF NOT EXISTS ipnu_ippnu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
exit;
```

### F. Import Schema
```cmd
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root ipnu_ippnu < "C:\TUGAS T\Organisasi IPNU IPPNU (1)\server\schema.sql"
```

### G. Import Sample Data (Opsional)
```cmd
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root ipnu_ippnu < "C:\TUGAS T\Organisasi IPNU IPPNU (1)\server\seed-activities.sql"
```

### H. Verifikasi
```cmd
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root ipnu_ippnu -e "SHOW TABLES; SELECT COUNT(*) FROM activities;"
```

Jika muncul:
```
+----------------------------------+
| Tables_in_ipnu_ippnu             |
+----------------------------------+
| activities                       |
| activity_registrations           |
| created_accounts                 |
| member_registrations             |
+----------------------------------+
```

**Berhasil!** ✅

---

## 🚀 LANGKAH 2: Jalankan Aplikasi

Setelah database setup selesai, buka **2 terminal baru**:

### Terminal 1 - Backend:
```cmd
cd "C:\TUGAS T\Organisasi IPNU IPPNU (1)\server"
npm install
npm start
```

Tunggu sampai muncul: `Backend server berjalan di http://localhost:4000`

### Terminal 2 - Frontend:
```cmd
cd "C:\TUGAS T\Organisasi IPNU IPPNU (1)"
npm install
npm run dev
```

Tunggu sampai muncul:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## 🌐 LANGKAH 3: Test Aplikasi

1. Buka browser: http://localhost:5173
2. Login sebagai admin atau user
3. Buka menu **Data Kegiatan**
4. Test fitur:
   - Tambah kegiatan
   - Edit kegiatan
   - Hapus kegiatan
   - Daftar kegiatan (untuk user)
   - Filter dan search

---

## 🔧 Troubleshooting

### MySQL tidak bisa start
```cmd
# Cek apakah MySQL sudah terinstall sebagai service
sc query MySQL80

# Jika belum, install ulang
cd "C:\Program Files\MySQL\MySQL Server 8.4\bin"
mysqld --install MySQL80
net start MySQL80
```

### Error: "Can't connect to MySQL server"
- Pastikan MySQL service sudah running: `net start MySQL80`
- Cek port 3306 tidak dipakai aplikasi lain
- Restart komputer jika perlu

### Error: "Access denied for user 'root'"
- Password default MySQL adalah **kosong**
- Coba: `mysql -u root` (tekan Enter saat diminta password)

### Error: "Unknown database 'ipnu_ippnu'"
- Ulangi Langkah 1-E untuk buat database

### Backend tidak bisa connect ke database
- Cek file `.env` apakah konfigurasi benar:
  ```
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=
  DB_DATABASE=ipnu_ippnu
  ```
- Pastikan MySQL sudah running
- Cek terminal backend untuk error message

### Frontend tidak bisa load data
- Pastikan backend running di port 4000
- Cek browser console (F12) untuk error
- Pastikan sudah ada data di database

---

## 📝 Quick Commands

### Start MySQL (setelah setup)
```cmd
net start MySQL80
```

### Stop MySQL
```cmd
net stop MySQL80
```

### Cek status MySQL
```cmd
sc query MySQL80
```

### Masuk ke MySQL
```cmd
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root
```

### Lihat data
```sql
USE ipnu_ippnu;
SELECT * FROM activities;
SELECT * FROM activity_registrations;
```

---

## ✅ Checklist

- [ ] MySQL terinstall
- [ ] MySQL service berjalan (MySQL80)
- [ ] Database `ipnu_ippnu` dibuat
- [ ] Schema di-import
- [ ] Sample data di-import (opsional)
- [ ] Backend running (port 4000)
- [ ] Frontend running (port 5173)
- [ ] Bisa akses http://localhost:5173
- [ ] Bisa tambah/edit/hapus kegiatan

---

## 🆘 Butuh Bantuan?

Jika masih ada masalah:
1. Screenshot error message
2. Screenshot terminal output
3. Cek file log di: `C:\Users\ASUS\AppData\Local\npm-cache\_logs\`

**Semoga berhasil! 🎯**