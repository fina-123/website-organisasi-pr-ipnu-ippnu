-- ============================================================
-- SCHEMA LENGKAP UNTUK APLIKASI IPNU IPPNU
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- TABEL: members (Data anggota lengkap)
-- ============================================================
create table if not exists members (
  id uuid primary key default uuid_generate_v4(),
  nia text not null unique,                              -- Nomor Induk Anggota
  full_name text not null,
  gender text not null default 'Laki-laki',               -- Laki-laki / Perempuan
  organization text not null default 'IPNU',              -- IPNU / IPPNU
  birth_place text,
  birth_date date,
  address text,
  phone text,
  email text,
  education text,                                         -- Pendidikan terakhir
  occupation text,                                        -- Pekerjaan
  kaderisasi_status text not null default 'Belum Kaderisasi', -- Belum Kaderisasi / Makesta / Lakmud / Lakut / Lakutama
  member_status text not null default 'active',           -- active / inactive
  photo_url text,                                         -- URL foto di Supabase Storage
  join_date date default current_date,
  auth_id uuid references auth.users(id) on delete set null, -- Link ke auth.users
  role text not null default 'user',                      -- user / admin
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_members_nia on members (nia);
create index if not exists idx_members_email on members (email);
create index if not exists idx_members_organization on members (organization);
create index if not exists idx_members_member_status on members (member_status);
create index if not exists idx_members_kaderisasi_status on members (kaderisasi_status);
create index if not exists idx_members_role on members (role);
create index if not exists idx_members_auth_id on members (auth_id);

-- ============================================================
-- TABEL: member_registrations (Pendaftaran anggota baru via web)
-- ============================================================
create table if not exists member_registrations (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  phone text not null,
  birth_date date not null,
  gender text not null,
  address text not null,
  organization text not null,
  education text,
  school text,
  motivation text,
  agree_terms boolean not null default false,
  status text not null default 'pending',
  submitted_at timestamptz not null default now()
);

create index if not exists idx_member_registrations_status on member_registrations (status);
create index if not exists idx_member_registrations_submitted_at on member_registrations (submitted_at desc);

-- ============================================================
-- TABEL: suggestions (Saran dari anggota)
-- ============================================================
create table if not exists suggestions (
  id uuid primary key default uuid_generate_v4(),
  user_name text not null default 'Anggota',
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists idx_suggestions_status on suggestions (status);
create index if not exists idx_suggestions_created_at on suggestions (created_at desc);

-- ============================================================
-- TABEL: contact_messages (Pesan dari halaman kontak)
-- ============================================================
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_created_at on contact_messages (created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Members table
alter table members enable row level security;

-- Policy: Semua user login bisa baca members
create policy "Anyone authenticated can read members"
  on members for select
  using (auth.role() = 'authenticated');

-- Policy: Hanya admin yang bisa insert/update/delete members
create policy "Only admins can insert members"
  on members for insert
  with check (exists (
    select 1 from members where auth_id = auth.uid() and role = 'admin'
  ));

create policy "Only admins can update members"
  on members for update
  using (exists (
    select 1 from members where auth_id = auth.uid() and role = 'admin'
  ));

create policy "Only admins can delete members"
  on members for delete
  using (exists (
    select 1 from members where auth_id = auth.uid() and role = 'admin'
  ));

-- ============================================================
-- NOTE: Untuk membuat admin pertama kali:
-- 1. Buat user di Supabase Dashboard > Authentication > Users
-- 2. Copy User ID
-- 3. Jalankan SQL:
--    insert into members (nia, full_name, email, role, organization, member_status)
--    values ('ADM001', 'Admin IPNU IPPNU', 'admin@ipnuippnu-batursari.org', 'admin', 'IPNU', 'active');
--    update members set auth_id = 'USER_ID_DISINI' where email = 'admin@ipnuippnu-batursari.org';