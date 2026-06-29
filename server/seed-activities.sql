-- Seed Data untuk Testing Fitur Kegiatan

-- Insert sample activities
INSERT INTO activities (id, title, type, description, date, location, quota, registered, status, created_at, updated_at) VALUES
(
  'act-001',
  'MAKESTA (Masa Kesetiaan Anggota) 2026',
  'MAKESTA',
  'Kegiatan pengenalan organisasi dan pembinaan anggota baru IPNU IPPNU Batursari periode 2026. Kegiatan ini akan membahas tentang sejarah organisasi, struktur kepengurusan, dan program kerja.',
  '2026-05-15',
  'Aula Desa Batursari',
  50,
  35,
  'upcoming',
  NOW(),
  NOW()
),
(
  'act-002',
  'LAKMUD (Latihan Kader Muda) Regional',
  'LAKMUD',
  'Pelatihan kepemimpinan dan kaderisasi untuk anggota IPNU IPPNU tingkat regional. Materi meliputi public speaking, manajemen organisasi, dan teamwork.',
  '2026-06-20',
  'Gedung Serbaguna Kecamatan',
  30,
  18,
  'upcoming',
  NOW(),
  NOW()
),
(
  'act-003',
  'Pelatihan Public Speaking',
  'PELATIHAN',
  'Pelatihan kemampuan berbicara di depan umum untuk anggota IPNU IPPNU. Dilaksanakan secara online via Zoom dengan narasumber profesional.',
  '2026-04-25',
  'Online via Zoom',
  100,
  67,
  'ongoing',
  NOW(),
  NOW()
),
(
  'act-004',
  'Bakti Sosial Ramadhan 2026',
  'BAKSOS',
  'Kegiatan sosial berbagi takjil dan sembako kepada masyarakat Desa Batursari. Kegiatan ini rutin dilakukan setiap bulan Ramadhan.',
  '2026-03-25',
  'Desa Batursari',
  40,
  40,
  'completed',
  NOW(),
  NOW()
),
(
  'act-005',
  'Kajian Rutin Mingguan',
  'LAINNYA',
  'Kajian rutin setiap hari Sabtu malam untuk meningkatkan pemahaman keislaman anggota IPNU IPPNU.',
  '2026-05-10',
  'Masjid Al-Hidayah',
  100,
  45,
  'upcoming',
  NOW(),
  NOW()
);

-- Insert sample registrations
-- Note: Pastikan ada user dengan ID 'user-001', 'user-002', 'user-003' di tabel created_accounts
INSERT INTO activity_registrations (id, user_id, activity_id, status, registered_date, created_at) VALUES
(
  'reg-001',
  'user-002',
  'act-001',
  'approved',
  '2026-04-05 10:30:00',
  NOW()
),
(
  'reg-002',
  'user-002',
  'act-003',
  'approved',
  '2026-04-10 14:20:00',
  NOW()
),
(
  'reg-003',
  'user-003',
  'act-001',
  'pending',
  '2026-04-08 09:15:00',
  NOW()
),
(
  'reg-004',
  'user-003',
  'act-002',
  'pending',
  '2026-04-12 16:45:00',
  NOW()
),
(
  'reg-005',
  'user-002',
  'act-004',
  'approved',
  '2026-03-20 11:00:00',
  NOW()
);

-- Update registered count based on approved registrations
UPDATE activities SET registered = (
  SELECT COUNT(*) FROM activity_registrations
  WHERE activity_id = activities.id AND status = 'approved'
) WHERE id IN ('act-001', 'act-002', 'act-003', 'act-004', 'act-005');

-- Verify data
SELECT 'Activities' as table_name, COUNT(*) as count FROM activities
UNION ALL
SELECT 'Activity Registrations', COUNT(*) FROM activity_registrations;