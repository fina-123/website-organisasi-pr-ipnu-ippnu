-- Seed data untuk tabel suggestions
-- Jalankan SQL ini setelah membuat tabel suggestions

INSERT INTO suggestions (nama, email, telepon, subjek, pesan, status) VALUES
('Budi Santoso', 'budi@gmail.com', '081234567890', 'Kegiatan Rutin', 'Mohon diadakan kegiatan rutin mingguan untuk anggota agar silaturahmi tetap terjaga.', 'baru'),
('Siti Rahayu', 'siti@gmail.com', NULL, 'Fasilitas Latihan', 'Sebaiknya disediakan tempat latihan yang memadai untuk kegiatan seni dan olahraga anggota.', 'dibaca'),
('Ahmad Rizki', NULL, '087654321098', 'Program Beasiswa', 'Apakah IPNU IPPNU bisa mengadakan program beasiswa untuk anggota yang berprestasi?', 'dibalas');

UPDATE suggestions SET balasan = 'Terima kasih atas sarannya. Kami akan mempertimbangkan program beasiswa di kepengurusan mendatang.', tanggal_balas = NOW(), status = 'dibalas' WHERE subjek = 'Program Beasiswa';

-- Verifikasi data
SELECT id, nama, subjek, status, created_at FROM suggestions ORDER BY created_at DESC;