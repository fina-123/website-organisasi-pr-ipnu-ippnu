# STRUKTUR KODE SISTEM - IPNU IPPNU Ranting Batursari

## 📋 DAFTAR ISI
1. [Overview Sistem](#overview-sistem)
2. [Technology Stack](#technology-stack)
3. [Struktur Folder](#struktur-folder)
4. [Frontend (React + Vite)](#frontend)
5. [Backend (Express.js)](#backend)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Authentication & Authorization](#authentication--authorization)
9. [File Upload System](#file-upload-system)
10. [Routing System](#routing-system)

---

## 🎯 OVERVIEW SISTEM

**Nama Aplikasi:** IPNU IPPNU Website  
**Organisasi:** IPNU IPPNU Ranting Batursari  
**Tipe:** Full-Stack Web Application  
**Purpose:** Sistem manajemen organisasi pelajar Islam (IPNU/IPPNU)

### Fitur Utama:
- **Public:** Landing page, profil, berita, dokumentasi, struktur organisasi, kontak, pendaftaran anggota
- **Admin:** Dashboard, manajemen users, members, activities, registrations, articles, suggestions, dokumentasi
- **User:** Dashboard, profile, activities, registrations, history, suggestions

---

## 🛠️ TECHNOLOGY STACK

### Frontend:
- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.3.5
- **Routing:** React Router DOM 7.14.0
- **UI Library:** 
  - Material UI (MUI) 7.3.5
  - ShadCN UI Components (Radix UI)
  - Tailwind CSS 4.1.12
- **State Management:** React Context API
- **Forms:** React Hook Form 7.55.0
- **HTTP Client:** Native Fetch API
- **Animations:** Motion 12.23.24
- **Icons:** Lucide React 0.487.0, MUI Icons
- **Notifications:** Sonner 2.0.3
- **Date Handling:** date-fns 3.6.0
- **Charts:** Recharts 2.15.2

### Backend:
- **Runtime:** Node.js >= 18.0.0
- **Framework:** Express 4.18.2
- **Database:** MySQL 8.0 (mysql2 3.6.0)
- **Authentication:** bcryptjs 2.4.3
- **Security:**
  - Helmet 8.2.0 (security headers)
  - CORS 2.8.5
  - Express Rate Limit 8.5.2
  - Express Validator 7.3.2
- **File Upload:** Multer 2.2.0
- **Utilities:** UUID 9.0.0, PDFKit 0.19.1

### Database:
- **DBMS:** MySQL
- **Charset:** utf8mb4_unicode_ci
- **Engine:** InnoDB

---

## 📁 STRUKTUR FOLDER

```
Organisasi IPNU IPPNU (1)/
├── 📄 package.json                 # Frontend dependencies & scripts
├── 📄 package-lock.json            # Locked dependencies
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 vite.config.ts               # Vite configuration
├── 📄 postcss.config.mjs           # PostCSS configuration
├── 📄 index.html                   # HTML entry point
├── 📄 .env.example                 # Environment variables template
├── 📄 .gitignore                   # Git ignore rules
│
├── 📂 server/                      # BACKEND (Express.js API)
│   ├── 📄 package.json             # Backend dependencies
│   ├── 📄 index.js                 # Main server file (2043 lines)
│   ├── 📄 db.js                    # Database connection pool
│   ├── 📄 schema.sql               # Database schema (151 lines)
│   ├── 📄 README.md                # Server documentation
│   │
│   ├── 📂 uploads/                 # File storage
│   │   ├── 📂 profile-photos/      # User profile photos
│   │   └── 📂 dokumentasi/         # Documentation photos
│   │
│   └── 📂 seed-*.sql               # Database seed files
│       ├── seed-activities.sql
│       ├── seed-articles.sql
│       ├── seed-members-sample.sql
│       ├── seed-structure.sql
│       └── seed-suggestions.sql
│
├── 📂 src/                         # FRONTEND (React)
│   ├── 📄 main.tsx                 # React entry point
│   ├── 📄 vite-env.d.ts            # Vite type definitions
│   │
│   ├── 📂 app/                     # Main application
│   │   ├── 📄 App.tsx              # Root component with routing
│   │   │
│   │   ├── 📂 components/          # Reusable components
│   │   │   ├── 📄 ProtectedRoute.tsx    # Route guard
│   │   │   ├── 📄 DashboardSidebar.tsx  # Admin/User sidebar
│   │   │   ├── 📄 Footer.tsx            # Footer component
│   │   │   ├── 📄 PublicNavbar.tsx      # Public navigation
│   │   │   ├── 📄 LogoIPNU.tsx          # IPNU logo
│   │   │   ├── 📄 LogoIPPNU.tsx         # IPPNU logo
│   │   │   ├── 📄 LogoPair.tsx          # Combined logos
│   │   │   │
│   │   │   ├── 📂 figma/           # Figma assets
│   │   │   └── 📂 ui/              # ShadCN UI components
│   │   │
│   │   ├── 📂 context/             # React Context
│   │   │   └── 📄 AuthContext.tsx  # Authentication context
│   │   │
│   │   ├── 📂 data/                # Static data
│   │   │   └── 📄 mockData.ts      # Mock data for development
│   │   │
│   │   └── 📂 pages/               # Page components
│   │       │
│   │       ├── 📂 admin/           # Admin pages
│   │       │   ├── 📄 AdminDashboard.tsx
│   │       │   ├── 📄 AdminUsers.tsx
│   │       │   ├── 📄 AdminMembers.tsx
│   │       │   ├── 📄 AdminActivities.tsx
│   │       │   ├── 📄 AdminRegistrations.tsx
│   │       │   ├── 📄 AdminMemberRegistrations.tsx
│   │       │   ├── 📄 AdminStructure.tsx
│   │       │   ├── 📄 AdminNews.tsx
│   │       │   ├── 📄 AdminDokumentasi.tsx
│   │       │   └── 📄 AdminSuggestions.tsx
│   │       │
│   │       └── 📂 user/            # User pages
│   │           ├── 📄 UserDashboard.tsx
│   │           ├── 📄 UserProfile.tsx
│   │           ├── 📄 UserMembers.tsx
│   │           ├── 📄 UserActivities.tsx
│   │           ├── 📄 UserRegistrations.tsx
│   │           ├── 📄 UserHistory.tsx
│   │           └── 📄 UserSuggestions.tsx
│   │
│   │       # Public pages (in pages/ root)
│   │       ├── 📄 Landing.tsx
│   │       ├── 📄 Profile.tsx
│   │       ├── 📄 VisionMission.tsx
│   │       ├── 📄 Structure.tsx
│   │       ├── 📄 News.tsx
│   │       ├── 📄 ArticleDetail.tsx
│   │       ├── 📄 Documentation.tsx
│   │       ├── 📄 Contact.tsx
│   │       ├── 📄 Login.tsx
│   │       ├── 📄 MemberRegistration.tsx
│   │       ├── 📄 RegistrationSuccess.tsx
│   │       ├── 📄 CheckRegistrationStatus.tsx
│   │       ├── 📄 ForgotPassword.tsx
│   │       └── 📄 ResetPassword.tsx
│   │
│   ├── 📂 lib/                     # Utilities
│   │   └── 📄 supabase.ts          # Supabase client (legacy)
│   │
│   ├── 📂 styles/                  # Global styles
│   │   ├── 📄 fonts.css
│   │   ├── 📄 index.css
│   │   ├── 📄 tailwind.css
│   │   └── 📄 theme.css
│   │
│   └── 📂 imports/                 # Static assets
│       ├── 🖼️ LOGO_IPNU.png
│       ├── 🖼️ LOGO_IPPNU.png
│       ├── 🖼️ LOGO_IPNU_NEW.png
│       ├── 🖼️ LOGO_IPPNU_NEW.png
│       └── 🖼️ *.png (screenshots, thumbnails)
│
├── 📂 supabase/                    # Supabase configuration
│   └── 📄 schema.sql               # Supabase schema (legacy)
│
├── 📂 guidelines/                  # Project guidelines
│   └── 📄 Guidelines.md
│
└── 📂 [Documentation Files]
    ├── 📄 README.md                # Main documentation
    ├── 📄 CARA-MENJALANKAN.md      # How to run
    ├── 📄 PANDUAN-SETUP.md         # Setup guide
    ├── 📄 MANUAL-BOOK.md           # User manual
    ├── 📄 IMPLEMENTASI-SELESAI.md  # Implementation summary
    ├── 📄 TODO.md                  # Task tracking
    │
    ├── 📄 AUDIT-LAPORAN.md         # Audit report
    ├── 📄 AUDIT-FIXES.md           # Audit fixes
    ├── 📄 BUGFIX-SUMMARY.md        # Bug fixes summary
    │
    ├── 📄 ACTIVITIES-FIX.md        # Activities fixes
    ├── 📄 ACTIVITIES-SETUP.md      # Activities setup
    ├── 📄 ARTICLES-FIX.md          # Articles fixes
    ├── 📄 DASHBOARD-FIXES.md       # Dashboard fixes
    ├── 📄 REGISTRATIONS-FIX.md     # Registrations fixes
    ├── 📄 SUGGESTIONS-FIX.md       # Suggestions fixes
    └── 📄 USER-ID-FIX.md           # User ID fixes
```

---

## ⚛️ FRONTEND

### Entry Point & Configuration

#### `src/main.tsx`
```typescript
- React application entry point
- Mounts App component to DOM
- Includes global styles
```

#### `src/app/App.tsx` (Root Component)
```typescript
- BrowserRouter setup
- Route configuration:
  * Public Routes (12 routes)
  * Admin Routes (10 routes) - ProtectedRoute with role="admin"
  * User Routes (7 routes) - ProtectedRoute with role="user"
  * 404 fallback to Landing
- Toaster component for notifications
```

### Context & State Management

#### `src/app/context/AuthContext.tsx`
```typescript
- Global authentication state
- User data management
- Login/logout functions
- Token storage (localStorage)
- User role checking
```

### Components

#### `src/app/components/ProtectedRoute.tsx`
```typescript
- Route guard component
- Checks authentication status
- Validates user role (admin/user)
- Redirects to login if unauthorized
```

#### `src/app/components/DashboardSidebar.tsx`
```typescript
- Sidebar navigation for admin/user dashboards
- Dynamic menu based on user role
- Active route highlighting
- Logout functionality
```

#### `src/app/components/Footer.tsx`
```typescript
- Site footer component
- Organization info
- Social links
- Copyright
```

#### `src/app/components/PublicNavbar.tsx`
```typescript
- Public navigation bar
- Logo display
- Menu links
- Mobile responsive
```

#### Logo Components:
- `LogoIPNU.tsx` - IPNU organization logo
- `LogoIPPNU.tsx` - IPPNU organization logo
- `LogoPair.tsx` - Combined logos display

### Pages Structure

#### Public Pages (13 pages):
```
pages/
├── Landing.tsx                    # Homepage (/)
├── Profile.tsx                    # Organization profile (/profil)
├── VisionMission.tsx              # Vision & mission (/visi-misi)
├── Structure.tsx                  # Organization structure (/struktur)
├── News.tsx                       # News list (/berita)
├── ArticleDetail.tsx              # Article detail (/berita/:slug)
├── Documentation.tsx              # Photo gallery (/dokumentasi)
├── Contact.tsx                    # Contact page (/kontak)
├── Login.tsx                      # Login page (/login)
├── MemberRegistration.tsx         # Member registration (/daftar-anggota)
├── RegistrationSuccess.tsx        # Registration success (/pendaftaran-berhasil)
├── CheckRegistrationStatus.tsx    # Check status (/cek-status)
├── ForgotPassword.tsx             # Forgot password (/lupa-password)
└── ResetPassword.tsx              # Reset password (/reset-password)
```

#### Admin Pages (10 pages):
```
pages/admin/
├── AdminDashboard.tsx             # Admin dashboard (/admin/dashboard)
├── AdminUsers.tsx                 # User management (/admin/users)
├── AdminMembers.tsx               # Members list (/admin/members)
├── AdminActivities.tsx            # Activities management (/admin/activities)
├── AdminRegistrations.tsx         # Activity registrations (/admin/registrations)
├── AdminMemberRegistrations.tsx   # Member registrations (/admin/member-registrations)
├── AdminStructure.tsx             # Organization structure (/admin/structure)
├── AdminNews.tsx                  # Articles/News management (/admin/news)
├── AdminDokumentasi.tsx           # Photo gallery management (/admin/dokumentasi)
└── AdminSuggestions.tsx           # Suggestions management (/admin/suggestions)
```

#### User Pages (7 pages):
```
pages/user/
├── UserDashboard.tsx              # User dashboard (/user/dashboard)
├── UserProfile.tsx                # User profile (/user/profile)
├── UserMembers.tsx                # Members list (/user/members)
├── UserActivities.tsx             # Activities (/user/activities)
├── UserRegistrations.tsx          # My registrations (/user/registrations)
├── UserHistory.tsx                # Activity history (/user/history)
└── UserSuggestions.tsx            # My suggestions (/user/suggestions)
```

### Styling

#### Global Styles:
- `src/styles/index.css` - Main CSS entry
- `src/styles/tailwind.css` - Tailwind directives
- `src/styles/theme.css` - Custom theme variables
- `src/styles/fonts.css` - Font imports

#### UI Framework:
- **Tailwind CSS 4.1.12** - Utility-first CSS
- **ShadCN UI** - Pre-built components (Radix UI based)
- **Material UI 7.3.5** - Additional components
- **Emotion** - CSS-in-JS for MUI

---

## 🔧 BACKEND

### Main Server: `server/index.js` (2043 lines)

#### Server Configuration:
```javascript
- Express.js app initialization
- Port: 4000 (default)
- CORS enabled for localhost:5173
- Security headers (Helmet)
- Rate limiting:
  * General: 100 requests/15min
  * Auth: 5 requests/15min
- Input sanitization (XSS prevention)
- JSON body parsing
- Static file serving (/uploads)
```

#### Middleware:
1. **Helmet** - Security headers
2. **CORS** - Cross-origin resource sharing
3. **Rate Limiter** - Request throttling
4. **Input Sanitizer** - XSS prevention
5. **Multer** - File upload handling

### Database Connection: `server/db.js`
```javascript
- MySQL connection pool
- Configuration from .env
- Pool size management
- Error handling
```

### API Modules:

#### 1. Member Registrations (`/api/member-registrations`)
```javascript
GET    /api/member-registrations              # List all registrations
POST   /api/member-registrations              # Create new registration
PATCH  /api/member-registrations/:id/status   # Approve/reject registration
GET    /api/check-registration                # Check status by email (public)
```

#### 2. Created Accounts (`/api/created-accounts`)
```javascript
GET    /api/created-accounts                  # List all accounts
POST   /api/created-accounts/approve          # Approve registration & create account
POST   /api/created-accounts/reset-password   # Reset user password
```

#### 3. User Profile (`/api/user`)
```javascript
GET    /api/user/profile                      # Get user profile
PUT    /api/user/profile                      # Update user profile
POST   /api/user/profile/photo                # Upload profile photo
```

#### 4. Members (`/api/members`)
```javascript
GET    /api/members                           # List all members (with search/filter)
```

#### 5. Activities (`/api/activities`)
```javascript
GET    /api/activities                        # List activities (with filters)
GET    /api/activities/:id                    # Activity detail
POST   /api/activities                        # Create activity (admin)
PUT    /api/activities/:id                    # Update activity (admin)
DELETE /api/activities/:id                    # Delete activity (admin)
POST   /api/activities/:id/register           # Register for activity
GET    /api/activities/:id/registrations      # List registrations (admin)
PATCH  /api/activities/:id/registrations/:id/status  # Approve/reject registration
GET    /api/activities/stats                  # Activity statistics (admin)
```

#### 6. Activity Registrations (`/api/activity-registrations`)
```javascript
GET    /api/activity-registrations            # List all registrations (admin)
PATCH  /api/activity-registrations/:id/status # Update status
GET    /api/activity-registrations/stats      # Registration statistics
GET    /api/my-registrations                  # User's registrations
GET    /api/certificates/:registrationId      # Download certificate
```

#### 7. Users (`/api/users`)
```javascript
GET    /api/users/by-email                    # Get user by email (login)
```

#### 8. Articles (`/api/articles`)
```javascript
GET    /api/articles                          # List articles (with filters)
GET    /api/articles/:id                      # Article by ID
GET    /api/articles/slug/:slug               # Article by slug
POST   /api/articles                          # Create article (admin)
PUT    /api/articles/:id                      # Update article (admin)
DELETE /api/articles/:id                      # Delete article (admin)
```

#### 9. Organization Members (`/api/organization-members`)
```javascript
GET    /api/organization-members              # List all members
GET    /api/organization-members/:id          # Member detail
POST   /api/organization-members              # Add member (admin)
PUT    /api/organization-members/:id          # Update member (admin)
DELETE /api/organization-members/:id          # Delete member (admin)
```

#### 10. Suggestions (`/api/suggestions`)
```javascript
GET    /api/suggestions                      # List all suggestions (admin)
GET    /api/suggestions/:id                  # Suggestion detail (auto mark as read)
POST   /api/suggestions                      # Submit suggestion (public)
GET    /api/my-suggestions                   # User's suggestions
PUT    /api/suggestions/:id/balas            # Reply to suggestion (admin)
DELETE /api/suggestions/:id                  # Delete suggestion (admin)
```

#### 11. Dokumentasi (`/api/dokumentasi`)
```javascript
GET    /api/dokumentasi                      # List all documentation (public)
POST   /api/dokumentasi                      # Add documentation (admin)
DELETE /api/dokumentasi/:id                  # Delete documentation (admin)
```

#### 12. Statistics (`/api/stats`)
```javascript
GET    /api/stats                            # Public statistics (no auth)
```

### Helper Functions:
```javascript
- computeActivityStatus(dateStr)  # Auto-compute activity status based on date
- generateSlug(judul, existingSlugs)  # Generate URL slug from title
- sanitizeInput(req, res, next)   # XSS prevention middleware
```

---

## 🗄️ DATABASE SCHEMA

### Database: `ipnu_ippnu`
**Charset:** utf8mb4_unicode_ci  
**Engine:** InnoDB

### Tables (8 tables):

#### 1. `member_registrations` - Pendaftaran Anggota
```sql
Columns:
- id VARCHAR(36) PRIMARY KEY
- full_name VARCHAR(255) NOT NULL
- email VARCHAR(255) NOT NULL
- phone VARCHAR(100) NOT NULL
- birth_date DATE NOT NULL
- gender VARCHAR(50) NOT NULL
- address TEXT NOT NULL
- organization VARCHAR(255) NOT NULL
- education VARCHAR(255)
- school VARCHAR(255)
- motivation TEXT
- agree_terms BOOLEAN DEFAULT FALSE
- status VARCHAR(50) DEFAULT 'pending'  # pending, approved, rejected
- submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP

Indexes:
- idx_member_registrations_status (status)
- idx_member_registrations_submitted_at (submitted_at DESC)
```

#### 2. `created_accounts` - Akun Pengguna
```sql
Columns:
- id VARCHAR(36) PRIMARY KEY
- registration_id VARCHAR(36) NOT NULL
- full_name VARCHAR(255) NOT NULL
- email VARCHAR(255) NOT NULL UNIQUE
- password_hash VARCHAR(255) NOT NULL
- phone VARCHAR(100)
- foto_url VARCHAR(500)
- organization VARCHAR(50)  # IPNU or IPPNU
- role VARCHAR(50) DEFAULT 'user'  # user or admin
- created_at DATETIME DEFAULT CURRENT_TIMESTAMP

Foreign Keys:
- registration_id → member_registrations(id) ON DELETE CASCADE

Indexes:
- idx_created_accounts_email (email)
- idx_created_accounts_registration_id (registration_id)
```

#### 3. `activities` - Kegiatan
```sql
Columns:
- id VARCHAR(36) PRIMARY KEY
- title VARCHAR(255) NOT NULL
- type ENUM('MAKESTA', 'LAKMUD', 'PELATIHAN', 'BAKSOS', 'LAINNYA') DEFAULT 'LAINNYA'
- description TEXT NOT NULL
- date DATE NOT NULL
- location VARCHAR(255) NOT NULL
- quota INT NOT NULL
- registered INT DEFAULT 0
- status ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming'
- image VARCHAR(255)
- created_at DATETIME DEFAULT CURRENT_TIMESTAMP
- updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

Indexes:
- idx_activities_status (status)
- idx_activities_date (date)
```

#### 4. `activity_registrations` - Pendaftaran Kegiatan
```sql
Columns:
- id VARCHAR(36) PRIMARY KEY
- user_id VARCHAR(36) NOT NULL
- activity_id VARCHAR(36) NOT NULL
- status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
- registered_date DATETIME DEFAULT CURRENT_TIMESTAMP
- created_at DATETIME DEFAULT CURRENT_TIMESTAMP

Foreign Keys:
- activity_id → activities(id) ON DELETE CASCADE

Unique Keys:
- unique_user_activity (user_id, activity_id)

Indexes:
- idx_activity_registrations_user_id (user_id)
- idx_activity_registrations_activity_id (activity_id)
- idx_activity_registrations_status (status)
```

#### 5. `organization_members` - Struktur Organisasi
```sql
Columns:
- id INT AUTO_INCREMENT PRIMARY KEY
- nama VARCHAR(255) NOT NULL
- jabatan VARCHAR(255) NOT NULL
- organisasi ENUM('IPNU', 'IPPNU') NOT NULL
- periode VARCHAR(50) NOT NULL
- urutan INT DEFAULT 0
- foto_url VARCHAR(500)
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

Indexes:
- idx_organization_members_organisasi (organisasi)
- idx_organization_members_urutan (urutan)
```

#### 6. `articles` - Berita & Artikel
```sql
Columns:
- id INT AUTO_INCREMENT PRIMARY KEY
- judul VARCHAR(500) NOT NULL
- slug VARCHAR(500) NOT NULL UNIQUE
- konten LONGTEXT NOT NULL
- ringkasan TEXT
- kategori ENUM('Organisasi', 'Kegiatan', 'Berita', 'Pengumuman') DEFAULT 'Berita'
- thumbnail_url VARCHAR(500)
- penulis VARCHAR(255) DEFAULT 'Admin'
- status ENUM('draft', 'published') DEFAULT 'published'
- tanggal_publish DATE NOT NULL
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

Indexes:
- idx_articles_slug (slug)
- idx_articles_status (status)
- idx_articles_tanggal_publish (tanggal_publish DESC)
- idx_articles_kategori (kategori)
```

#### 7. `suggestions` - Saran Masuk
```sql
Columns:
- id INT AUTO_INCREMENT PRIMARY KEY
- nama VARCHAR(255) NOT NULL
- email VARCHAR(255)
- telepon VARCHAR(20)
- subjek VARCHAR(500) NOT NULL
- pesan TEXT NOT NULL
- status ENUM('baru', 'dibaca', 'dibalas') DEFAULT 'baru'
- balasan TEXT
- tanggal_balas TIMESTAMP
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

Indexes:
- idx_suggestions_status (status)
- idx_suggestions_created_at (created_at DESC)
```

#### 8. `dokumentasi` - Galeri Foto
```sql
Columns:
- id INT AUTO_INCREMENT PRIMARY KEY
- judul VARCHAR(255) NOT NULL
- kategori ENUM('Kegiatan', 'Sosial', 'Organisasi', 'Lainnya') DEFAULT 'Lainnya'
- foto_url VARCHAR(500) NOT NULL
- deskripsi TEXT
- tanggal DATE NOT NULL
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

Indexes:
- idx_dokumentasi_kategori (kategori)
- idx_dokumentasi_tanggal (tanggal DESC)
- idx_dokumentasi_created_at (created_at DESC)
```

---

## 🌐 API ENDPOINTS

### Base URL: `http://localhost:4000/api`

### Complete API List:

#### Member Registrations
```
GET    /member-registrations              # List all
POST   /member-registrations              # Create new
PATCH  /member-registrations/:id/status   # Update status
GET    /check-registration?email=         # Check by email (public)
```

#### Created Accounts
```
GET    /created-accounts                  # List all
POST   /created-accounts/approve          # Approve & create account
POST   /created-accounts/reset-password   # Reset password
```

#### User Profile
```
GET    /user/profile?userId=              # Get profile
PUT    /user/profile                      # Update profile
POST   /user/profile/photo                # Upload photo
```

#### Members
```
GET    /members?search=&organisasi=       # List members
```

#### Activities
```
GET    /activities?status=&type=&search=  # List activities
GET    /activities/:id                    # Activity detail
POST   /activities                        # Create (admin)
PUT    /activities/:id                    # Update (admin)
DELETE /activities/:id                    # Delete (admin)
POST   /activities/:id/register           # Register for activity
GET    /activities/:id/registrations      # List registrations (admin)
PATCH  /activities/:id/registrations/:id/status  # Update status
GET    /activities/stats                  # Statistics (admin)
```

#### Activity Registrations
```
GET    /activity-registrations?status=&activityId=  # List all (admin)
PATCH  /activity-registrations/:id/status           # Update status
GET    /activity-registrations/stats                # Statistics
GET    /my-registrations?userId=                    # User's registrations
GET    /certificates/:registrationId                # Download certificate
```

#### Users
```
GET    /users/by-email?email=             # Get user by email (login)
```

#### Articles
```
GET    /articles?status=&kategori=        # List articles
GET    /articles/:id                      # By ID
GET    /articles/slug/:slug               # By slug
POST   /articles                          # Create (admin)
PUT    /articles/:id                      # Update (admin)
DELETE /articles/:id                      # Delete (admin)
```

#### Organization Members
```
GET    /organization-members?organisasi=  # List all
GET    /organization-members/:id          # Detail
POST   /organization-members              # Add (admin)
PUT    /organization-members/:id          # Update (admin)
DELETE /organization-members/:id          # Delete (admin)
```

#### Suggestions
```
GET    /suggestions?status=               # List all (admin)
GET    /suggestions/:id                   # Detail (auto mark as read)
POST   /suggestions                       # Submit (public)
GET    /my-suggestions?email=             # User's suggestions
PUT    /suggestions/:id/balas             # Reply (admin)
DELETE /suggestions/:id                   # Delete (admin)
```

#### Dokumentasi
```
GET    /dokumentasi?kategori=             # List all (public)
POST   /dokumentasi                       # Add (admin)
DELETE /dokumentasi/:id                   # Delete (admin)
```

#### Statistics
```
GET    /stats                             # Public statistics
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Authentication Flow:
1. User logs in with email/password
2. Backend validates credentials
3. Returns user data (id, email, full_name, role)
4. Frontend stores in AuthContext & localStorage
5. ProtectedRoute checks authentication & role

### Role-Based Access:
```
ADMIN Role:
- Can access /admin/* routes
- Can manage all resources
- Can approve/reject registrations
- Can create/edit/delete content

USER Role:
- Can access /user/* routes
- Can view own profile
- Can register for activities
- Can submit suggestions
- Cannot access admin features

PUBLIC:
- Can view public pages
- Can submit member registration
- Can submit suggestions
- Cannot access protected routes
```

### Security Features:
- Password hashing (bcrypt, 10 rounds)
- Rate limiting (auth: 5/15min, general: 100/15min)
- Input sanitization (XSS prevention)
- CORS configuration
- Helmet security headers
- SQL injection prevention (parameterized queries)

---

## 📤 FILE UPLOAD SYSTEM

### Upload Directories:
```
server/uploads/
├── profile-photos/    # User profile photos (max 2MB, JPG/PNG)
└── dokumentasi/       # Documentation photos (max 2MB, JPG/PNG)
```

### Multer Configuration:
```javascript
- Storage: DiskStorage with unique filenames
- File Filter: JPG, JPEG, PNG only
- Max Size: 2MB per file
- Naming: {timestamp}-{uuid}.{ext}
```

### Upload Endpoints:
```
POST /api/user/profile/photo           # Upload profile photo
POST /api/dokumentasi                  # Upload documentation photo
```

### File URL Format:
```
Profile Photos: /uploads/profile-photos/{filename}
Dokumentasi: /uploads/dokumentasi/{filename}
```

---

## 🛣️ ROUTING SYSTEM

### Public Routes:
```
/                    → Landing (Homepage)
/profil              → Profile (Organization profile)
/visi-misi           → VisionMission
/struktur            → Structure (Organization chart)
/berita              → News (Article list)
/berita/:slug        → ArticleDetail
/dokumentasi         → Documentation (Photo gallery)
/kontak              → Contact
/login               → Login
/reset-password      → ResetPassword
/lupa-password       → ForgotPassword
/daftar-anggota      → MemberRegistration
/pendaftaran-berhasil → RegistrationSuccess
/cek-status          → CheckRegistrationStatus
```

### Admin Routes (Protected):
```
/admin/dashboard              → AdminDashboard
/admin/users                  → AdminUsers
/admin/members                → AdminMembers
/admin/activities             → AdminActivities
/admin/registrations          → AdminRegistrations
/admin/member-registrations   → AdminMemberRegistrations
/admin/structure              → AdminStructure
/admin/news                   → AdminNews
/admin/dokumentasi            → AdminDokumentasi
/admin/suggestions            → AdminSuggestions
```

### User Routes (Protected):
```
/user/dashboard       → UserDashboard
/user/profile         → UserProfile
/user/members         → UserMembers
/user/activities      → UserActivities
/user/registrations   → UserRegistrations
/user/history         → UserHistory
/user/suggestions     → UserSuggestions
```

---

## 📊 DATA FLOW

### Member Registration Flow:
```
1. User fills form (MemberRegistration.tsx)
   ↓
2. POST /api/member-registrations
   ↓
3. Data saved to member_registrations (status: pending)
   ↓
4. Admin reviews (AdminMemberRegistrations.tsx)
   ↓
5. Admin approves → PATCH /api/member-registrations/:id/status
   ↓
6. System auto-creates account in created_accounts
   ↓
7. User can login with default password: "ipnuippnu123"
```

### Activity Registration Flow:
```
1. User views activities (UserActivities.tsx)
   ↓
2. User registers → POST /api/activities/:id/register
   ↓
3. Data saved to activity_registrations (status: pending)
   ↓
4. Admin reviews (AdminRegistrations.tsx)
   ↓
5. Admin approves → PATCH /api/activities/:id/registrations/:id/status
   ↓
6. User can download certificate (UserHistory.tsx)
```

### Article Management Flow:
```
1. Admin creates article (AdminNews.tsx)
   ↓
2. POST /api/articles
   ↓
3. Data saved to articles (status: published/draft)
   ↓
4. Public views article (News.tsx, ArticleDetail.tsx)
   ↓
5. Article displayed with slug-based URL
```

---

## 🔧 CONFIGURATION FILES

### Frontend:
- `package.json` - Dependencies & scripts
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript settings
- `postcss.config.mjs` - PostCSS plugins
- `.env` - Environment variables

### Backend:
- `server/package.json` - Backend dependencies
- `server/index.js` - Server configuration
- `server/db.js` - Database configuration
- `.env` - Database credentials & port

### Environment Variables:
```env
# Frontend (.env)
VITE_API_URL=http://localhost:4000

# Backend (.env)
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ipnu_ippnu
```

---

## 🚀 SCRIPTS & COMMANDS

### Frontend:
```bash
npm run dev          # Start development server (Vite, port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run server       # Start backend server
```

### Backend:
```bash
cd server
npm start            # Start Express server (port 4000)
```

### Database:
```bash
# Setup database
mysql -u root -p < server/schema.sql

# Seed data
mysql -u root -p ipnu_ippnu < server/seed-activities.sql
mysql -u root -p ipnu_ippnu < server/seed-articles.sql
mysql -u root -p ipnu_ippnu < server/seed-structure.sql
mysql -u root -p ipnu_ippnu < server/seed-suggestions.sql
mysql -u root -p ipnu_ippnu < server/seed-members-sample.sql
```

---

## 📝 KEY FEATURES IMPLEMENTATION

### 1. Authentication
- JWT-like token system (user ID stored in context)
- Role-based access control
- Password reset functionality
- Session persistence (localStorage)

### 2. Member Registration
- Public registration form
- Admin approval workflow
- Auto-account creation on approval
- Status tracking (pending/approved/rejected)
- Email-based status checking

### 3. Activity Management
- CRUD operations for activities
- Auto-status computation (upcoming/ongoing/completed)
- Registration system with quota management
- Duplicate registration prevention
- Certificate generation (HTML format)

### 4. Article/News System
- CRUD operations for articles
- Slug-based URLs for SEO
- Category filtering
- Draft/Published status
- Thumbnail support

### 5. Organization Structure
- Dynamic structure management
- IPNU/IPPNU separation
- Period-based organization
- Photo support

### 6. Suggestions System
- Public submission (no auth required)
- Admin reply system
- Status tracking (baru/dibaca/dibalas)
- Email-based user history

### 7. Documentation Gallery
- Photo upload system
- Category filtering
- Responsive gallery display
- Admin management

### 8. Dashboard & Statistics
- Admin dashboard with stats
- Activity statistics
- Registration statistics
- Member count
- Real-time data updates

---

## 🎨 UI/UX FEATURES

### Design System:
- **Color Scheme:** Green (#1a5f1a) - IPNU/IPPNU brand color
- **Typography:** System fonts + Google Fonts
- **Spacing:** Tailwind spacing scale
- **Responsive:** Mobile-first approach
- **Dark Mode:** Not implemented (light mode only)

### Components Used:
- Material UI components (buttons, cards, dialogs, etc.)
- ShadCN UI (accordion, dialog, dropdown, etc.)
- Custom components (sidebar, footer, navbar)
- Lucide icons throughout
- Sonner for notifications

### Animations:
- Motion library for smooth transitions
- Page transitions
- Hover effects
- Loading states

---

## 🔍 DEBUGGING & LOGGING

### Console Logging:
```javascript
# Backend logging patterns:
🔍 [SERVER] - API call received
📊 [SERVER] - Database query results
✅ [SERVER] - Success operations
❌ [SERVER] - Error operations
📝 [SUGGESTIONS] - Suggestion operations
📸 [DOKUMENTASI] - Documentation operations
=== PROFILE API DEBUG === - Profile API debugging
```

### Debug Files:
- `test-members-api.mjs` - Test members API
- `test-activity-api.js` - Test activity API
- `test-profile-debug.js` - Test profile API
- `temp-*.mjs` - Temporary test scripts

---

## 📦 DEPENDENCIES BREAKDOWN

### Frontend Key Dependencies:
```
react, react-dom                 # Core React
react-router-dom                 # Routing
@mui/material, @mui/icons-material  # Material UI
@radix-ui/*                      # ShadCN UI primitives
tailwindcss, autoprefixer        # Styling
lucide-react                     # Icons
react-hook-form                  # Form handling
recharts                         # Charts
sonner                           # Notifications
motion                           # Animations
date-fns                         # Date utilities
```

### Backend Key Dependencies:
```
express                          # Web framework
mysql2                           # MySQL driver
bcryptjs                         # Password hashing
cors                             # CORS handling
helmet                           # Security headers
express-rate-limit               # Rate limiting
express-validator                # Input validation
multer                           # File uploads
uuid                             # UUID generation
pdfkit                           # PDF generation (certificates)
```

---

## 🎯 PROJECT STATUS

### Completed Features:
✅ Full authentication system
✅ Member registration workflow
✅ Activity management with registration
✅ Article/News management
✅ Organization structure management
✅ Suggestions system
✅ Documentation gallery
✅ User dashboards
✅ Admin dashboards
✅ Certificate generation
✅ File upload system
✅ Statistics & reporting
✅ Responsive design
✅ Security features (rate limiting, XSS prevention, etc.)

### Documentation:
✅ README.md
✅ CARA-MENJALANKAN.md (How to run)
✅ PANDUAN-SETUP.md (Setup guide)
✅ MANUAL-BOOK.md (User manual)
✅ Multiple fix documentation files

---

## 📞 SUPPORT & MAINTENANCE

### Server Ports:
- Frontend: 5173 (Vite dev server)
- Backend: 4000 (Express server)

### Database:
- Name: ipnu_ippnu
- Host: localhost
- Port: 3306 (default MySQL)

### Default Credentials:
- Admin: Created manually in database
- User: Auto-created on registration approval
- Default Password: "ipnuippnu123" (for auto-created accounts)

---

## 📄 LICENSE

This project is developed for IPNU IPPNU Ranting Batursari organization management.

---

**Generated:** 2026-07-13  
**Version:** 1.0.0  
**Status:** Production Ready ✅