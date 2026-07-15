# 📧 PANDUAN SETUP EMAIL NOTIFICATION

Panduan ini akan membantu Anda mengkonfigurasi email notification untuk website IPNU IPPNU menggunakan Gmail SMTP.

---

## 📋 LANGKAH-LANGKAH SETUP

### **LANGKAH 1: Buat Gmail App Password**

Karena Google tidak mengizinkan aplikasi menggunakan password akun Gmail biasa, Anda perlu membuat **App Password**.

#### 1.1. Aktifkan 2-Step Verification
1. Buka [Google Account Security](https://myaccount.google.com/security)
2. Klik **"2-Step Verification"** (Verifikasi 2 langkah)
3. Ikuti instruksi untuk mengaktifkan verifikasi 2 langkah

#### 1.2. Buat App Password
1. Setelah 2-Step Verification aktif, kembali ke halaman Security
2. Klik **"App passwords"** (Password aplikasi)
3. Pilih **"Mail"** sebagai aplikasi
4. Pilih **"Other (Custom name)"** dan masukkan nama: `IPNU IPPNU Website`
5. Klik **"Generate"**
6. Google akan menghasilkan 16-digit password seperti: `abcd efgh ijkl mnop`
7. **SIMPAN PASSWORD INI** (tanpa spasi: `abcdefghijklmnop`)

---

### **LANGKAH 2: Update File .env**

Buka file `.env` di folder utama project dan update bagian email configuration:

```env
# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**Contoh:**
```env
EMAIL_USER=ipnuippnu.batursari@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**CATATAN:**
- `EMAIL_USER`: Gunakan email Gmail lengkap (contoh: `ipnuippnu@gmail.com`)
- `EMAIL_PASSWORD`: Gunakan App Password yang di-generate di langkah 1 (16 digit tanpa spasi)

---

### **LANGKAH 3: Test Email**

Jalankan script test untuk memastikan email berfungsi:

```bash
cd "Organisasi IPNU IPPNU (1)/server"
node test-email.js
```

**Expected Output:**
```
Testing email...
EMAIL_USER: ipnuippnu@gmail.com
Email terkirim: <message-id>
Hasil: { success: true, messageId: '<message-id>' }
```

Jika muncul `success: true`, berarti email berhasil dikirim!

---

### **LANGKAH 4: Test di Website**

1. Jalankan backend server:
   ```bash
   cd "Organisasi IPNU IPPNU (1)/server"
   npm run server
   ```

2. Jalankan frontend:
   ```bash
   cd "Organisasi IPNU IPPNU (1)"
   npm run dev
   ```

3. Test email notification:
   - Login sebagai admin
   - Buka `/admin/member-registrations`
   - Approve pendaftaran anggota
   - Cek email penerima (akan menerima email notifikasi)

---

## 🎯 FITUR EMAIL NOTIFICATION

Email notification akan dikirim untuk:

### 1. **Pendaftaran Anggota - DISETUJUI** ✅
- **Trigger:** Admin approve pendaftaran anggota
- **Penerima:** Email anggota yang mendaftar
- **Isi:** Informasi akun (email, password default), link login
- **Template:** `getApprovalEmail()`

### 2. **Pendaftaran Anggota - DITOLAK** ❌
- **Trigger:** Admin tolak pendaftaran anggota
- **Penerima:** Email anggota yang mendaftar
- **Isi:** Alasan penolakan, link daftar ulang
- **Template:** `getRejectionEmail()`

### 3. **Pendaftaran Kegiatan - DISETUJUI** ✅
- **Trigger:** Admin approve pendaftaran kegiatan
- **Penerima:** Email user yang mendaftar kegiatan
- **Isi:** Detail kegiatan, link dashboard
- **Template:** `getActivityApprovalEmail()`

### 4. **Reset Password** 🔑
- **Trigger:** User request reset password
- **Penerima:** Email user
- **Isi:** Link reset password
- **Template:** `getResetPasswordEmail()`

### 5. **Konfirmasi Pendaftaran** 📝
- **Trigger:** User submit pendaftaran anggota
- **Penerima:** Email user yang mendaftar
- **Isi:** Konfirmasi pendaftaran diterima, link cek status
- **Template:** `getRegistrationConfirmationEmail()`

---

## 🔧 TROUBLESHOOTING

### **Masalah 1: Email tidak terkirim**

**Solusi:**
1. Cek apakah EMAIL_USER dan EMAIL_PASSWORD sudah benar di .env
2. Cek apakah 2-Step Verification sudah aktif di Gmail
3. Cek apakah App Password benar (tanpa spasi)
4. Cek console/server logs untuk error message

### **Masalah 2: "Invalid login" error**

**Solusi:**
1. Pastikan menggunakan App Password, bukan password Gmail biasa
2. Pastikan 2-Step Verification sudah aktif
3. Cek email dan password di .env

### **Masalah 3: "Connection timeout" error**

**Solusi:**
1. Cek koneksi internet
2. Cek firewall/antivirus apakah memblokir port 587
3. Coba gunakan port 465 dengan `secure: true`:
   ```javascript
   const transporter = nodemailer.createTransporter({
     host: 'smtp.gmail.com',
     port: 465,
     secure: true,
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASSWORD
     }
   });
   ```

### **Masalah 4: Email masuk ke spam**

**Solusi:**
1. Gunakan domain email yang profesional (bukan @gmail.com)
2. Setup SPF, DKIM, dan DMARC records untuk domain Anda
3. Gunakan layanan email profesional seperti:
   - SendGrid
   - Mailgun
   - Amazon SES
   - SMTP2GO

---

## 📊 MONITORING EMAIL

### Cek Email Logs di Backend

Backend akan menampilkan log email di console:

```
Email terkirim: <message-id>
```

Jika ada error:
```
Error kirim email: Error: Invalid login
```

### Test Email Manual

Jalankan script test:
```bash
node test-email.js
```

Script ini akan mengirim email test ke alamat email yang ada di `.env`.

---

## 🔐 SECURITY NOTES

1. **Jangan commit .env ke Git**
   - File `.env` sudah ada di `.gitignore`
   - Jangan share App Password ke orang lain

2. **Gunakan environment variables**
   - Di production, set environment variables di server
   - Jangan hardcode credentials di code

3. **Rate limiting**
   - Backend sudah memiliki rate limiting
   - Mencegah spam email

4. **Email validation**
   - Semua email address divalidasi sebelum dikirim
   - Mencegah email injection attacks

---

## 📞 SUPPORT

Jika mengalami masalah:

1. Cek console/server logs untuk error messages
2. Cek file `.env` apakah credentials sudah benar
3. Test email dengan script `test-email.js`
4. Pastikan Gmail App Password sudah di-generate dengan benar

---

## ✅ CHECKLIST SETUP

- [ ] 2-Step Verification aktif di Gmail
- [ ] App Password sudah di-generate
- [ ] File `.env` sudah di-update dengan EMAIL_USER dan EMAIL_PASSWORD
- [ ] Script `test-email.js` berhasil mengirim email
- [ ] Backend server berjalan tanpa error
- [ ] Email notification terkirim saat approve pendaftaran

---

**Setup berhasil?** Email notification sudah siap digunakan! 🎉

**Catatan:** Untuk production, disarankan menggunakan layanan email profesional seperti SendGrid, Mailgun, atau Amazon SES untuk deliverability yang lebih baik.