const nodemailer = require('nodemailer');

// ==========================================
// KONFIGURASI EMAIL
// ==========================================
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ==========================================
// FUNGSI KIRIM EMAIL
// ==========================================
async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"IPNU IPPNU Ranting Batursari" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('Email terkirim:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error kirim email:', error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// TEMPLATE EMAIL
// ==========================================

// 1. Pendaftaran Anggota - DISETUJUI
function getApprovalEmail(name, email, password) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; background-color: #1a5f1a; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
        <h1 style="margin: 0;">IPNU IPPNU</h1>
        <p style="margin: 5px 0;">Ranting Batursari</p>
      </div>
      <div style="padding: 20px;">
        <h2>Selamat, Pendaftaran Anda Disetujui! 🎉</h2>
        <p>Yth. <strong>${name}</strong>,</p>
        <p>Pendaftaran Anda sebagai anggota IPNU IPPNU Ranting Batursari telah <strong>DISETUJUI</strong>.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">📋 Informasi Akun</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> <code style="background: #eee; padding: 2px 8px; border-radius: 3px;">${password}</code></p>
          <p style="color: #666; font-size: 14px;">⚠️ Segera ganti password Anda setelah login pertama kali.</p>
        </div>
        <p>Anda sekarang dapat login dan mengakses fitur-fitur berikut:</p>
        <ul>
          <li>📋 Lihat dan daftar kegiatan</li>
          <li>📊 Dashboard personal</li>
          <li>📄 Download sertifikat</li>
          <li>💬 Kirim saran</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/login" style="background-color: #1a5f1a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Login Sekarang</a>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 14px;">Salam,<br><strong>Pengurus IPNU IPPNU Ranting Batursari</strong></p>
      </div>
    </div>
  `;
}

// 2. Pendaftaran Anggota - DITOLAK
function getRejectionEmail(name, reason) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; background-color: #cc0000; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
        <h1 style="margin: 0;">IPNU IPPNU</h1>
        <p style="margin: 5px 0;">Ranting Batursari</p>
      </div>
      <div style="padding: 20px;">
        <h2>Pendaftaran Belum Disetujui</h2>
        <p>Yth. <strong>${name}</strong>,</p>
        <p>Terima kasih telah mendaftar menjadi anggota IPNU IPPNU Ranting Batursari.</p>
        <p>Setelah kami periksa, pendaftaran Anda <strong>BELUM DAPAT DISETUJUI</strong> dengan alasan:</p>
        <div style="background-color: #fff3f3; padding: 15px; border-radius: 5px; border-left: 4px solid #cc0000; margin: 20px 0;">
          <p style="margin: 0;">${reason || 'Data yang Anda kirimkan belum lengkap. Silakan lengkapi data dan daftar ulang.'}</p>
        </div>
        <p>Silakan lengkapi data yang diperlukan dan daftar ulang.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/daftar-anggota" style="background-color: #1a5f1a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Daftar Ulang</a>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 14px;">Salam,<br><strong>Pengurus IPNU IPPNU Ranting Batursari</strong></p>
      </div>
    </div>
  `;
}

// 3. Pendaftaran Kegiatan - DISETUJUI
function getActivityApprovalEmail(name, activityTitle) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; background-color: #1a5f1a; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
        <h1 style="margin: 0;">IPNU IPPNU</h1>
        <p style="margin: 5px 0;">Ranting Batursari</p>
      </div>
      <div style="padding: 20px;">
        <h2>Pendaftaran Kegiatan Disetujui! ✅</h2>
        <p>Yth. <strong>${name}</strong>,</p>
        <p>Pendaftaran Anda untuk kegiatan <strong>${activityTitle}</strong> telah <strong>DISETUJUI</strong>.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">📋 Detail Kegiatan</h3>
          <p><strong>Kegiatan:</strong> ${activityTitle}</p>
          <p><strong>Status:</strong> ✅ Disetujui</p>
        </div>
        <p>Setelah kegiatan selesai, Anda akan mendapatkan sertifikat yang bisa di-download di dashboard.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/user/dashboard" style="background-color: #1a5f1a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Lihat Dashboard</a>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 14px;">Salam,<br><strong>Pengurus IPNU IPPNU Ranting Batursari</strong></p>
      </div>
    </div>
  `;
}

// 4. Reset Password
function getResetPasswordEmail(name, resetLink) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; background-color: #1a5f1a; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
        <h1 style="margin: 0;">IPNU IPPNU</h1>
        <p style="margin: 5px 0;">Ranting Batursari</p>
      </div>
      <div style="padding: 20px;">
        <h2>Reset Password</h2>
        <p>Yth. <strong>${name}</strong>,</p>
        <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
        <p>Klik tombol di bawah untuk mereset password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #1a5f1a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #666; font-size: 14px;">🔗 Atau copy link ini: ${resetLink}</p>
        <p style="color: #666; font-size: 14px;">Link ini berlaku selama 1 jam.</p>
        <p style="color: #666; font-size: 14px;">Jika Anda tidak merasa meminta reset password, abaikan email ini.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 14px;">Salam,<br><strong>Pengurus IPNU IPPNU Ranting Batursari</strong></p>
      </div>
    </div>
  `;
}

// 5. Konfirmasi Pendaftaran Anggota
function getRegistrationConfirmationEmail(name) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; background-color: #1a5f1a; padding: 20px; border-radius: 10px 10px 0 0; color: white;">
        <h1 style="margin: 0;">IPNU IPPNU</h1>
        <p style="margin: 5px 0;">Ranting Batursari</p>
      </div>
      <div style="padding: 20px;">
        <h2>Pendaftaran Diterima! 📝</h2>
        <p>Yth. <strong>${name}</strong>,</p>
        <p>Pendaftaran Anda sebagai anggota IPNU IPPNU Ranting Batursari telah kami terima.</p>
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <p style="margin: 0;">⏳ Pendaftaran Anda sedang dalam proses verifikasi oleh admin.</p>
          <p style="margin: 5px 0 0 0;">Kami akan mengirimkan email notifikasi setelah pendaftaran diproses.</p>
        </div>
        <p>Anda dapat cek status pendaftaran di:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/cek-status" style="background-color: #1a5f1a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Cek Status Pendaftaran</a>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 14px;">Salam,<br><strong>Pengurus IPNU IPPNU Ranting Batursari</strong></p>
      </div>
    </div>
  `;
}

module.exports = {
  sendEmail,
  getApprovalEmail,
  getRejectionEmail,
  getActivityApprovalEmail,
  getResetPasswordEmail,
  getRegistrationConfirmationEmail
};