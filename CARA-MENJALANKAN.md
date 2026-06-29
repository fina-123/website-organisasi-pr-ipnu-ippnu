# Cara Menjalankan Aplikasi di Terminal

## 📋 Prerequisites

Pastikan sudah terinstall:
- Node.js (v16+)
- MySQL (v8.0+)
- npm atau yarn

---

## 🚀 Langkah-langkah Menjalankan

### 1. Setup Database MySQL

```bash
# Masuk ke MySQL (Windows)
mysql -u root -p

# Atau jika tidak ada password
mysql -u root
```

```sql
-- Di dalam MySQL, jalankan:
CREATE DATABASE IF NOT EXISTS ipnu_ippnu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ipnu_ippnu;

-- Import schema
source server/schema.sql;

-- Optional: Import sample data
source server/seed-activities.sql;

-- Keluar dari MySQL
exit;
```

Atau dari terminal langsung:
```bash
# Windows (Command Prompt)
mysql -u root -p ipnu_ippnu < server\schema.sql
mysql -u root -p ipnu_ippnu < server\seed-activities.sql

# Mac/Linux
mysql -u root -p ipnu_ippnu < server/schema.sql
mysql -u root -p ipnu_ippnu < server/seed-activities.sql
```

---

### 2. Setup Backend (Server)

```bash
# Navigasi ke folder server
cd server

# Install dependencies (jika belum)
npm install

# Jalankan server
npm start
```

**Output yang diharapkan:**
```
Backend server berjalan di http://localhost:4000
```

**Biarkan terminal ini tetap berjalan** (jangan close)

**Note:** Jika ada error tentang port 4000 yang sudah digunakan:
```bash
# Windows - Cari dan kill proses di port 4000
netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:4000 | xargs kill -9
```

---

### 3. Setup Frontend (Client)

**Buka terminal baru** (jangan close terminal backend):

```bash
# Navigasi ke root project (jika belum di sana)
cd "Organisasi IPNU IPPNU (1)"

# Install dependencies (jika belum)
npm install

# Jalankan development server
npm run dev
```

**Output yang diharapkan:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Biarkan terminal ini juga tetap berjalan**

---

## 🎯 Testing Aplikasi

### Buka Browser

1. **Frontend:** http://localhost:5173
2. **Backend API:** http://localhost:4000/api/activities

### Login untuk Testing

**Admin:**
- Email: `admin@ipnuippnu-batursari.org`
- Password: (cek di database `created_accounts`)

**User:**
- Email: `ahmad.fauzi@example.com`
- Password: (cek di database `created_accounts`)

Atau buat akun baru melalui form registrasi member.

---

## 📝 Terminal Commands Cheat Sheet

### Menjalankan Aplikasi (2 Terminal)

**Terminal 1 - Backend:**
```bash
cd "Organisasi IPNU IPPNU (1)/server"
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd "Organisasi IPNU IPPNU (1)"
npm install
npm run dev
```

### Database Commands

```bash
# Backup database
mysqldump -u root -p ipnu_ippnu > backup.sql

# Restore database
mysql -u root -p ipnu_ippnu < backup.sql

# Masuk ke MySQL
mysql -u root -p

# Lihat semua database
SHOW DATABASES;

# Pilih database
USE ipnu_ippnu;

# Lihat semua tabel
SHOW TABLES;

# Lihat data activities
SELECT * FROM activities;

# Lihat data registrations
SELECT * FROM activity_registrations;

# Keluar
exit;
```

### NPM Commands

```bash
# Install dependencies
npm install

# Install specific package
npm install package-name

# Update dependencies
npm update

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔧 Troubleshooting

### Error: Port 4000 sudah digunakan

**Windows:**
```bash
# Cari PID yang menggunakan port 4000
netstat -ano | findstr :4000

# Kill proses (ganti PID dengan nomor yang muncul)
taskkill /PID 1234 /F
```

**Mac/Linux:**
```bash
# Kill proses di port 4000
lsof -ti:4000 | xargs kill -9
```

### Error: Cannot find module

```bash
# Reinstall dependencies
cd server
rm -rf node_modules package-lock.json
npm install

# Di terminal frontend
rm -rf node_modules package-lock.json
npm install
```

### Error: MySQL connection refused

```bash
# Cek apakah MySQL running
# Windows
net start | findstr MySQL

# Mac
brew services list | grep mysql

# Start MySQL
# Windows
net start MySQL80

# Mac
brew services start mysql

# Linux
sudo systemctl start mysql
```

### Error: Database doesn't exist

```bash
# Buat database
mysql -u root -p
CREATE DATABASE ipnu_ippnu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Import schema
mysql -u root -p ipnu_ippnu < server/schema.sql
```

---

## 📊 Monitoring & Debugging

### Lihat Log Backend
Backend logs akan muncul di terminal dimana `npm run dev` dijalankan.

### Lihat Log Frontend
Frontend logs akan muncul di terminal dimana `npm run dev` dijalankan.

### Test API dengan curl

```bash
# Test get activities
curl http://localhost:4000/api/activities

# Test get specific activity
curl http://localhost:4000/api/activities/act-001

# Test create activity (POST)
curl -X POST http://localhost:4000/api/activities \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","type":"LAINNYA","description":"Test","date":"2026-12-31","location":"Test","quota":10}'
```

### Browser DevTools
- F12 untuk buka Developer Tools
- Tab Console untuk lihat error
- Tab Network untuk lihat API requests

---

## 🎯 Quick Start (Ringkas)

```bash
# 1. Setup Database (1x saja)
mysql -u root -p
CREATE DATABASE ipnu_ippnu;
exit;
mysql -u root -p ipnu_ippnu < server/schema.sql
mysql -u root -p ipnu_ippnu < server/seed-activities.sql

# 2. Run Backend (Terminal 1)
cd server
npm install
npm start

# 3. Run Frontend (Terminal 2 - baru)
cd ..
npm install
npm run dev

# 4. Buka browser
# http://localhost:5173
```

---

## ✅ Checklist Menjalankan

- [ ] MySQL sudah terinstall dan running
- [ ] Database `ipnu_ippnu` sudah dibuat
- [ ] Schema sudah di-import
- [ ] Seed data sudah di-import (optional)
- [ ] Backend running di port 4000
- [ ] Frontend running di port 5173
- [ ] Bisa akses http://localhost:5173
- [ ] Bisa akses http://localhost:4000/api/activities

---

## 🆘 Jika Masih Ada Masalah

1. Cek terminal untuk error messages
2. Cek browser console (F12) untuk error
3. Pastikan MySQL running
4. Pastikan port 4000 dan 5173 tidak dipakai aplikasi lain
5. Restart kedua terminal (backend dan frontend)
6. Clear cache: `rm -rf node_modules && npm install`

**Happy Coding! 🚀**