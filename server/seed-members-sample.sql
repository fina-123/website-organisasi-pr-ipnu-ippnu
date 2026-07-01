-- Script untuk menambahkan 4 anggota contoh ke database
-- Jalankan di phpMyAdmin atau MySQL client

-- Members 1: IPNU - Muhammad Ahmad
INSERT INTO member_registrations 
  (id, full_name, email, phone, birth_date, gender, address, organization, education, school, motivation, agree_terms, status, submitted_at)
VALUES 
  ('reg-001', 'Muhammad Ahmad', 'muhammad.ahmad@example.com', '081234567891', '1995-05-15', 'Laki-laki', 'Jl. Merdeka No. 10, Batursari', 'IPNU', 'S1', 'Universitas Negeri Surabaya', 'Ingin berkontribusi untuk organisasi', 1, 'approved', NOW());

INSERT INTO created_accounts 
  (id, registration_id, full_name, email, password_hash, phone, organization, role, created_at)
VALUES 
  ('user-001', 'reg-001', 'Muhammad Ahmad', 'muhammad.ahmad@example.com', '$2a$10$rQ7H8p9X2Y5Z8A3B6C1D4E7F9G2H5J8K3L6M9N2P5Q8R1S4T7U0V3W6X9Y2Z5', '081234567891', 'IPNU', 'user', NOW());

-- Members 2: IPNU - Siti Nurhaliza
INSERT INTO member_registrations 
  (id, full_name, email, phone, birth_date, gender, address, organization, education, school, motivation, agree_terms, status, submitted_at)
VALUES 
  ('reg-002', 'Siti Nurhaliza', 'siti.nur@example.com', '082345678912', '1998-08-20', 'Perempuan', 'Jl. Sudirman No. 25, Batursari', 'IPNU', 'S1', 'Institut Teknologi Sepuluh Nopember', 'Belajar dan berkembang bersama', 1, 'approved', NOW());

INSERT INTO created_accounts 
  (id, registration_id, full_name, email, password_hash, phone, organization, role, created_at)
VALUES 
  ('user-002', 'reg-002', 'Siti Nurhaliza', 'siti.nur@example.com', '$2a$10$rQ7H8p9X2Y5Z8A3B6C1D4E7F9G2H5J8K3L6M9N2P5Q8R1S4T7U0V3W6X9Y2Z5', '082345678912', 'IPNU', 'user', NOW());

-- Members 3: IPPNU - Dewi Kartika
INSERT INTO member_registrations 
  (id, full_name, email, phone, birth_date, gender, address, organization, education, school, motivation, agree_terms, status, submitted_at)
VALUES 
  ('reg-003', 'Dewi Kartika Sari', 'dewi.kartika@example.com', '083456789023', '1997-03-10', 'Perempuan', 'Jl. Diponegoro No. 15, Batursari', 'IPPNU', 'S1', 'Universitas Airlangga', 'Aktif dalam kegiatan organisasi', 1, 'approved', NOW());

INSERT INTO created_accounts 
  (id, registration_id, full_name, email, password_hash, phone, organization, role, created_at)
VALUES 
  ('user-003', 'reg-003', 'Dewi Kartika Sari', 'dewi.kartika@example.com', '$2a$10$rQ7H8p9X2Y5Z8A3B6C1D4E7F9G2H5J8K3L6M9N2P5Q8R1S4T7U0V3W6X9Y2Z5', '083456789023', 'IPPNU', 'user', NOW());

-- Members 4: IPPNU - Rizky Pratama
INSERT INTO member_registrations 
  (id, full_name, email, phone, birth_date, gender, address, organization, education, school, motivation, agree_terms, status, submitted_at)
VALUES 
  ('reg-004', 'Rizky Pratama Putra', 'rizky.pratama@example.com', '084567890134', '1996-11-25', 'Laki-laki', 'Jl. Gatot Subroto No. 30, Batursari', 'IPPNU', 'S1', 'Universitas Negeri Malang', 'Mengembangkan potensi diri', 1, 'approved', NOW());

INSERT INTO created_accounts 
  (id, registration_id, full_name, email, password_hash, phone, organization, role, created_at)
VALUES 
  ('user-004', 'reg-004', 'Rizky Pratama Putra', 'rizky.pratama@example.com', '$2a$10$rQ7H8p9X2Y5Z8A3B6C1D4E7F9G2H5J8K3L6M9N2P5Q8R1S4T7U0V3W6X9Y2Z5', '084567890134', 'IPPNU', 'user', NOW());

-- Members 5: IPNU - Budi Santoso (opsional, untuk total 6 anggota)
INSERT INTO member_registrations 
  (id, full_name, email, phone, birth_date, gender, address, organization, education, school, motivation, agree_terms, status, submitted_at)
VALUES 
  ('reg-005', 'Budi Santoso', 'budi.santoso@example.com', '085678901245', '1994-07-08', 'Laki-laki', 'Jl. Ahmad Yani No. 45, Batursari', 'IPNU', 'S1', 'Universitas Brawijaya', 'Berkarya untuk bangsa', 1, 'approved', NOW());

INSERT INTO created_accounts 
  (id, registration_id, full_name, email, password_hash, phone, organization, role, created_at)
VALUES 
  ('user-005', 'reg-005', 'Budi Santoso', 'budi.santoso@example.com', '$2a$10$rQ7H8p9X2Y5Z8A3B6C1D4E7F9G2H5J8K3L6M9N2P5Q8R1S4T7U0V3W6X9Y2Z5', '085678901245', 'IPNU', 'user', NOW());

-- Verifikasi data
SELECT 
  ca.id, 
  ca.full_name, 
  ca.email, 
  ca.phone, 
  ca.organization, 
  ca.role,
  mr.address
FROM created_accounts ca
LEFT JOIN member_registrations mr ON ca.registration_id = mr.id
ORDER BY ca.organization, ca.full_name;