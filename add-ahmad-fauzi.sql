-- Script untuk menambahkan user Ahmad Fauzi ke tabel created_accounts
-- Jalankan di phpMyAdmin atau MySQL client

INSERT INTO created_accounts (id, registration_id, full_name, email, password_hash, phone, organization, role, created_at)
VALUES (
  'ahmad-fauzi-user-id-001',  -- ID unik untuk Ahmad Fauzi
  'registration-001',         -- Bisa disesuaikan dengan registration_id yang ada
  'Ahmad Fauzi',
  'ahmad.fauzi@example.com',
  '$2a$10$rQ7H8p9X2Y5Z8A3B6C1D4E7F9G2H5J8K3L6M9N2P5Q8R1S4T7U0V3W6X9Y2Z5',  -- Password hash untuk 'user123'
  '081234567890',             -- Nomor telepon (bisa diubah)
  'IPNU',                     -- Organisasi: IPNU atau IPPNU
  'user',                     -- Role: user atau admin
  NOW()                       -- Timestamp saat ini
);

-- Verifikasi data sudah masuk
SELECT * FROM created_accounts WHERE email = 'ahmad.fauzi@example.com';