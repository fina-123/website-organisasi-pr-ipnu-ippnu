CREATE DATABASE IF NOT EXISTS ipnu_ippnu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ipnu_ippnu;

CREATE TABLE IF NOT EXISTS member_registrations (
  id VARCHAR(36) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  organization VARCHAR(255) NOT NULL,
  education VARCHAR(255),
  school VARCHAR(255),
  motivation TEXT,
  agree_terms BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_member_registrations_status ON member_registrations (status);
CREATE INDEX idx_member_registrations_submitted_at ON member_registrations (submitted_at DESC);

CREATE TABLE IF NOT EXISTS created_accounts (
  id VARCHAR(36) PRIMARY KEY,
  registration_id VARCHAR(36) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(100),
  organization VARCHAR(50),
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_id) REFERENCES member_registrations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_created_accounts_email ON created_accounts (email);
CREATE INDEX idx_created_accounts_registration_id ON created_accounts (registration_id);

-- ─── Activities ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activities (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type ENUM('MAKESTA', 'LAKMUD', 'PELATIHAN', 'BAKSOS', 'LAINNYA') NOT NULL DEFAULT 'LAINNYA',
  description TEXT NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  quota INT NOT NULL,
  registered INT NOT NULL DEFAULT 0,
  status ENUM('upcoming', 'ongoing', 'completed') NOT NULL DEFAULT 'upcoming',
  image VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_activities_status ON activities (status);
CREATE INDEX idx_activities_date ON activities (date);

-- ─── Activity Registrations ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activity_registrations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  activity_id VARCHAR(36) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  registered_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_activity (user_id, activity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_activity_registrations_user_id ON activity_registrations (user_id);
CREATE INDEX idx_activity_registrations_activity_id ON activity_registrations (activity_id);
CREATE INDEX idx_activity_registrations_status ON activity_registrations (status);

-- ─── Organization Members (Struktur Organisasi) ────────────────────

CREATE TABLE IF NOT EXISTS organization_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  jabatan VARCHAR(255) NOT NULL,
  organisasi ENUM('IPNU', 'IPPNU') NOT NULL,
  periode VARCHAR(50) NOT NULL,
  urutan INT DEFAULT 0,
  foto_url VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_organization_members_organisasi ON organization_members (organisasi);
CREATE INDEX idx_organization_members_urutan ON organization_members (urutan);

-- ─── Articles (Berita & Artikel) ───────────────────────────────────

CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  konten LONGTEXT NOT NULL,
  ringkasan TEXT DEFAULT NULL,
  kategori ENUM('Organisasi', 'Kegiatan', 'Berita', 'Pengumuman') NOT NULL DEFAULT 'Berita',
  thumbnail_url VARCHAR(500) DEFAULT NULL,
  penulis VARCHAR(255) NOT NULL DEFAULT 'Admin',
  status ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  tanggal_publish DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_articles_slug ON articles (slug);
CREATE INDEX idx_articles_status ON articles (status);
CREATE INDEX idx_articles_tanggal_publish ON articles (tanggal_publish DESC);
CREATE INDEX idx_articles_kategori ON articles (kategori);

-- ─── Suggestions (Saran Masuk) ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS suggestions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  telepon VARCHAR(20) DEFAULT NULL,
  subjek VARCHAR(500) NOT NULL,
  pesan TEXT NOT NULL,
  status ENUM('baru', 'dibaca', 'dibalas') NOT NULL DEFAULT 'baru',
  balasan TEXT DEFAULT NULL,
  tanggal_balas TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_suggestions_status ON suggestions (status);
CREATE INDEX idx_suggestions_created_at ON suggestions (created_at DESC);
