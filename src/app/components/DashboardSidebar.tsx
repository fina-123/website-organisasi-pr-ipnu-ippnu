import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  ClipboardList,
  Newspaper,
  Network,
  MessageSquare,
  UserCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { LogoIPNU } from './LogoIPNU';
import { useAuth } from '../context/AuthContext';

interface DashboardSidebarProps {
  role: 'admin' | 'user';
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Kelola User', icon: UserCog },
    { path: '/admin/members', label: 'Data Anggota', icon: Users },
    { path: '/admin/member-registrations', label: 'Pendaftaran Anggota', icon: UserCircle },
    { path: '/admin/activities', label: 'Data Kegiatan', icon: Calendar },
    { path: '/admin/registrations', label: 'Pendaftaran Kegiatan', icon: ClipboardList },
    { path: '/admin/structure', label: 'Struktur Organisasi', icon: Network },
    { path: '/admin/news', label: 'Berita & Artikel', icon: Newspaper },
    { path: '/admin/suggestions', label: 'Saran Masuk', icon: MessageSquare },
  ];

  const userMenuItems = [
    { path: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/user/profile', label: 'Profil Saya', icon: UserCircle },
    { path: '/user/members', label: 'Daftar Anggota', icon: Users },
    { path: '/user/activities', label: 'Kegiatan', icon: Calendar },
    { path: '/user/registrations', label: 'Pendaftaran Saya', icon: ClipboardList },
    { path: '/user/history', label: 'Riwayat Kegiatan', icon: ClipboardList },
    { path: '/user/suggestions', label: 'Kirim Saran', icon: MessageSquare },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-3">
              <LogoIPNU size={40} />
              <div>
                <div className="font-bold text-gray-900">IPNU IPPNU</div>
                <div className="text-xs text-gray-600">Dashboard {role === 'admin' ? 'Admin' : 'User'}</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <UserCircle size={24} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {role === 'admin' ? 'Admin IPNU IPPNU' : (user?.name || 'Anggota')}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.email || (role === 'admin' ? 'admin@ipnuippnu.org' : 'anggota@ipnuippnu.org')}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/';
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
            >
              <LogOut size={20} />
              <span className="text-sm">Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </>
  );
}
