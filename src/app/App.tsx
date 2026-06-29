import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';

// Public Pages
import { Landing } from './pages/Landing';
import { Profile } from './pages/Profile';
import { VisionMission } from './pages/VisionMission';
import { Structure } from './pages/Structure';
import { News } from './pages/News';
import { Documentation } from './pages/Documentation';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { MemberRegistration } from './pages/MemberRegistration';
import { ResetPassword } from './pages/ResetPassword';
import { ForgotPassword } from './pages/ForgotPassword';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminMembers } from './pages/admin/AdminMembers';
import { AdminActivities } from './pages/admin/AdminActivities';
import { AdminRegistrations } from './pages/admin/AdminRegistrations';
import { AdminStructure } from './pages/admin/AdminStructure';
import { AdminNews } from './pages/admin/AdminNews';
import { ArticleDetail } from './pages/ArticleDetail';
import { AdminSuggestions } from './pages/admin/AdminSuggestions';
import { AdminMemberRegistrations } from './pages/admin/AdminMemberRegistrations';

// User Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { UserProfile } from './pages/user/UserProfile';
import { UserMembers } from './pages/user/UserMembers';
import { UserActivities } from './pages/user/UserActivities';
import { UserRegistrations } from './pages/user/UserRegistrations';
import { UserHistory } from './pages/user/UserHistory';
import { UserSuggestions } from './pages/user/UserSuggestions';

// Protected
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/visi-misi" element={<VisionMission />} />
        <Route path="/struktur" element={<Structure />} />
        <Route path="/berita" element={<News />} />
        <Route path="/berita/:slug" element={<ArticleDetail />} />
        <Route path="/dokumentasi" element={<Documentation />} />
        <Route path="/kontak" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/lupa-password" element={<ForgotPassword />} />
        <Route path="/daftar-anggota" element={<MemberRegistration />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="activities" element={<AdminActivities />} />
          <Route path="registrations" element={<AdminRegistrations />} />
          <Route path="structure" element={<AdminStructure />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="suggestions" element={<AdminSuggestions />} />
          <Route path="member-registrations" element={<AdminMemberRegistrations />} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={<ProtectedRoute requiredRole="user" />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="members" element={<UserMembers />} />
          <Route path="activities" element={<UserActivities />} />
          <Route path="registrations" element={<UserRegistrations />} />
          <Route path="history" element={<UserHistory />} />
          <Route path="suggestions" element={<UserSuggestions />} />
        </Route>

        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}
