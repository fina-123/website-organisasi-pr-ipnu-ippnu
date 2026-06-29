import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { LogoPair } from './LogoPair';

export function PublicNavbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/profil', label: 'Profil' },
    { path: '/visi-misi', label: 'Visi & Misi' },
    { path: '/struktur', label: 'Struktur' },
    { path: '/berita', label: 'Berita' },
    { path: '/dokumentasi', label: 'Dokumentasi' },
    { path: '/kontak', label: 'Kontak' },
    { path: '/daftar-anggota', label: 'Daftar' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <LogoPair ipnuSize={40} ippnuSize={40} gap={6} variant="navbar" />
            <div className="hidden sm:block">
              <div className="font-bold text-gray-900">IPNU IPPNU</div>
              <div className="text-xs text-gray-600">Ranting Batursari</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  location.pathname === link.path
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Login Button */}
          <div className="hidden md:flex items-center gap-2">
            {localStorage.getItem('user') ? (
              <>
                <span className="text-sm text-gray-700">Logged in</span>
                <button 
                  onClick={() => {
                    localStorage.removeItem('user');
                    window.location.reload();
                  }}
                  className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 rounded-md transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/user/dashboard"
                  className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-semibold ${
                  location.pathname === link.path
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-200 mt-2 space-y-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                Masuk
              </Link>
              <Link
                to="/user/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-semibold bg-green-600 text-white hover:bg-green-700"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
