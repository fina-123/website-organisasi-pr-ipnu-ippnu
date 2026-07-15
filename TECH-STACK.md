# IPNU IPPNU Website - Technology Stack & Features

## 🎯 Project Overview
**Aplikasi:** Website Manajemen Organisasi IPNU IPPNU Ranting Batursari  
**Tipe:** Full-Stack Web Application  
**Purpose:** Sistem informasi dan manajemen organisasi pelajar Islam

---

## 🛠️ TECHNOLOGY STACK

### Frontend (Client-Side)
- **React 18.3.1** - UI Framework
- **Vite 6.3.5** - Build Tool & Dev Server
- **React Router DOM 7.14.0** - Navigation & Routing
- **Material UI (MUI) 7.3.5** - Component Library
- **Tailwind CSS 4.1.12** - Styling Framework
- **ShadCN UI** - Pre-built Components (Radix UI)
- **React Hook Form 7.55.0** - Form Management
- **Lucide React 0.487.0** - Icons
- **Sonner 2.0.3** - Notifications
- **Motion 12.23.24** - Animations
- **Recharts 2.15.2** - Charts & Statistics
- **date-fns 3.6.0** - Date Utilities

### Backend (Server-Side)
- **Node.js** - Runtime Environment
- **Express 4.18.2** - Web Framework
- **MySQL 8.0** - Database (mysql2 3.6.0)
- **bcryptjs 2.4.3** - Password Hashing
- **Helmet 8.2.0** - Security Headers
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **Express Rate Limit 8.5.2** - Rate Limiting
- **Multer 2.2.0** - File Upload Handling
- **UUID 9.0.0** - Unique ID Generation
- **PDFKit 0.19.1** - Certificate Generation

### Database
- **MySQL** - Relational Database
- **Charset:** utf8mb4_unicode_ci
- **Tables:** 8 tables

---

## 📦 PROJECT STRUCTURE

```
Organisasi IPNU IPPNU (1)/
├── 📂 server/                    # Backend API
│   ├── index.js                  # Main server (2043 lines)
│   ├── db.js                     # Database connection
│   ├── schema.sql                # Database structure
│   └── uploads/                  # File storage
│
├── 📂 src/                       # Frontend React App
│   ├── app/
│   │   ├── App.tsx               # Root component & routing
│   │   ├── context/              # Auth context
│   │   ├── components/           # Reusable components
│   │   └── pages/                # Page components
│   │       ├── admin/            # Admin pages (10 pages)
│   │       └── user/             # User pages (7 pages)
│   └── styles/                   # CSS & themes
│
└── 📂 Documentation files        # Guides & manuals
```

---

## 🎨 FEATURES

### Public Features (No Login Required)
1. **Landing Page** - Homepage with organization info
2. **Profil** - Organization profile & history
3. **Visi & Misi** - Vision and mission
4. **Struktur Organisasi** - Organization chart
5. **Berita & Artikel** - News and articles list
6. **Dokumentasi** - Photo gallery
7. **Kontak** - Contact information
8. **Pendaftaran Anggota** - Member registration form
9. **Cek Status Pendaftaran** - Check registration status
10. **Login/Logout** - User authentication
11. **Lupa Password** - Password recovery

### Admin Features (Admin Role)
1. **Dashboard** - Statistics & overview
2. **Manajemen Users** - User account management
3. **Manajemen Members** - Member list management
4. **Manajemen Kegiatan** - Activity CRUD operations
5. **Manajemen Registrasi** - Activity registration approval
6. **Manajemen Struktur** - Organization structure management
7. **Manajemen Berita** - Article/News management
8. **Manajemen Dokumentasi** - Photo gallery management
9. **Manajemen Saran** - Suggestions management
10. **Pendaftaran Anggota** - Member registration approval

### User Features (User Role)
1. **Dashboard** - Personal dashboard
2. **Profile** - View & edit profile
3. **Daftar Anggota** - View members list
4. **Kegiatan** - View & register for activities
5. **Pendaftaran Saya** - My activity registrations
6. **Riwayat Kegiatan** - Activity history & certificates
7. **Saran** - Submit & view suggestions

---

## 🗄️ DATABASE (8 Tables)

1. **member_registrations** - Member registration applications
2. **created_accounts** - User accounts (admin & user)
3. **activities** - Activities/Events
4. **activity_registrations** - Activity signups
5. **organization_members** - Organization structure
6. **articles** - News & articles
7. **suggestions** - Public suggestions
8. **dokumentasi** - Photo gallery

---

## 🔐 SECURITY FEATURES

- Password Hashing (bcrypt)
- Rate Limiting (100 requests/15min general, 5 login attempts/15min)
- Input Sanitization (XSS prevention)
- CORS Configuration
- Security Headers (Helmet)
- SQL Injection Prevention
- File Upload Validation (type & size)

---

## 📊 KEY FUNCTIONALITIES

### 1. Authentication System
- Email/Password login
- Role-based access (Admin/User)
- Password reset
- Session management

### 2. Member Registration Workflow
- Public registration form
- Admin approval system
- Auto-account creation
- Status tracking

### 3. Activity Management
- Create/Edit/Delete activities
- Activity types: MAKESTA, LAKMUD, PELATIHAN, BAKSOS, LAINNYA
- Registration system with quota
- Certificate generation
- Auto status (upcoming/ongoing/completed)

### 4. Article/News System
- Create/Edit/Delete articles
- Categories: Organisasi, Kegiatan, Berita, Pengumuman
- Draft/Published status
- SEO-friendly URLs (slug)

### 5. Organization Structure
- IPNU & IPPNU management
- Period-based organization
- Photo support

### 6. Suggestions System
- Public submission
- Admin reply system
- Status tracking

### 7. Documentation Gallery
- Photo upload
- Category filtering
- Responsive gallery

---

## 🚀 HOW TO RUN

### Prerequisites
- Node.js >= 18.0.0
- MySQL 8.0
- npm or pnpm

### Installation

1. **Install Frontend Dependencies**
```bash
npm install
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Setup Database**
```bash
mysql -u root -p < server/schema.sql
```

4. **Configure Environment**
- Copy `.env.example` to `.env`
- Set database credentials
- Set API URL

5. **Run Development Servers**
```bash
# Terminal 1 - Frontend (port 5173)
npm run dev

# Terminal 2 - Backend (port 4000)
npm run server
```

---

## 📱 PAGES & ROUTES

### Public Routes (13 pages)
- `/` - Landing Page
- `/profil` - Profile
- `/visi-misi` - Vision & Mission
- `/struktur` - Organization Structure
- `/berita` - News List
- `/berita/:slug` - Article Detail
- `/dokumentasi` - Photo Gallery
- `/kontak` - Contact
- `/login` - Login
- `/daftar-anggota` - Member Registration
- `/cek-status` - Check Registration Status
- `/lupa-password` - Forgot Password
- `/reset-password` - Reset Password

### Admin Routes (10 pages)
- `/admin/dashboard` - Dashboard
- `/admin/users` - User Management
- `/admin/members` - Members List
- `/admin/activities` - Activities
- `/admin/registrations` - Activity Registrations
- `/admin/member-registrations` - Member Registrations
- `/admin/structure` - Organization Structure
- `/admin/news` - Articles/News
- `/admin/dokumentasi` - Documentation Gallery
- `/admin/suggestions` - Suggestions

### User Routes (7 pages)
- `/user/dashboard` - Dashboard
- `/user/profile` - Profile
- `/user/members` - Members List
- `/user/activities` - Activities
- `/user/registrations` - My Registrations
- `/user/history` - Activity History
- `/user/suggestions` - My Suggestions

---

## 🎨 UI/UX

- **Design:** Modern, clean, professional
- **Color Scheme:** Green (#1a5f1a) - IPNU/IPPNU brand
- **Responsive:** Mobile-first design
- **Icons:** Lucide React & MUI Icons
- **Animations:** Smooth transitions with Motion library
- **Notifications:** Sonner toast notifications

---

## 📦 DEPENDENCIES SUMMARY

### Frontend: 40+ packages
- Core: React, React DOM, React Router
- UI: MUI, ShadCN, Tailwind CSS
- Forms: React Hook Form
- Icons: Lucide React, MUI Icons
- Utilities: date-fns, clsx, class-variance-authority

### Backend: 10 packages
- Core: Express
- Database: mysql2
- Security: bcryptjs, helmet, cors, express-rate-limit
- Upload: multer
- Utilities: uuid, pdfkit

---

## ✅ PROJECT STATUS

**Status:** Production Ready  
**Version:** 1.0.0  
**Last Updated:** 2026-07-13

### Completed Features:
✅ Full authentication & authorization
✅ Member registration system
✅ Activity management with registration
✅ Article/News management
✅ Organization structure management
✅ Suggestions system
✅ Documentation gallery
✅ Admin & User dashboards
✅ Certificate generation
✅ File upload system
✅ Statistics & reporting
✅ Responsive design
✅ Security features

---

## 📞 TECHNICAL INFO

**Frontend Port:** 5173 (Vite Dev Server)  
**Backend Port:** 4000 (Express Server)  
**Database:** MySQL on localhost:3306  
**Database Name:** ipnu_ippnu

**Default Credentials:**
- Admin: Created manually in database
- User: Auto-created on registration approval
- Default Password: ipnuippnu123

---

**Documentation Generated:** 2026-07-13  
**For:** IPNU IPPNU Ranting Batursari