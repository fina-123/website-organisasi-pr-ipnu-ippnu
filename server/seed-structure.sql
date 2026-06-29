-- Seed data untuk tabel organization_members
-- Jalankan SQL ini setelah membuat tabel organization_members

INSERT INTO organization_members (nama, jabatan, organisasi, periode, urutan, foto_url) VALUES
-- IPNU Pengurus
('Muhammad Habibi', 'Ketua', 'IPNU', '2026-2028', 1, NULL),
('Ahmad Syaifudin', 'Wakil Ketua', 'IPNU', '2026-2028', 2, NULL),
('Abdullah Aziz', 'Sekretaris', 'IPNU', '2026-2028', 3, NULL),

-- IPPNU Pengurus
('Fatimah Azzahra', 'Ketua', 'IPPNU', '2026-2028', 1, NULL),
('Siti Aisyah', 'Wakil Ketua', 'IPPNU', '2026-2028', 2, NULL),
('Nur Khasanah', 'Sekretaris', 'IPPNU', '2026-2028', 3, NULL);

-- Verifikasi data
SELECT * FROM organization_members ORDER BY organisasi ASC, urutan ASC;