import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { LogoPair } from '../components/LogoPair';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Panggil fungsi login dari AuthContext
      const result = await login(formData.email, formData.password);

      if (!result.success) {
        setError(result.message || 'Login gagal. Periksa email dan password Anda.');
        setLoading(false);
        return;
      }

      // Login berhasil, redirect berdasarkan role
      if (result.user) {
        navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Back to Home Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Kembali ke Beranda</span>
          </Link>

          {/* Login Title */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-600">Masuk ke sistem IPNU IPPNU</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                placeholder="Masukkan email Anda"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/lupa-password" className="text-xs text-green-700 hover:text-green-800 font-medium">
                  Lupa Password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                placeholder="Masukkan password Anda"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Memasuki sistem...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link to="/daftar-anggota" className="text-green-700 hover:text-green-800 font-medium">
                Daftar Anggota
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Sudah mendaftar tapi belum punya akun?{' '}
              <Link to="/cek-status" className="text-green-700 hover:text-green-800 font-medium">
                Cek Status Pendaftaran →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="w-full lg:w-1/2 bg-[#1B5E3A] flex flex-col items-center justify-center p-8 lg:p-16 min-h-[300px] lg:min-h-screen">
        <div className="text-center text-white">
          {/* Logo IPNU & IPPNU */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-8">
              <LogoPair
                ipnuSize={120}
                ippnuSize={120}
                gap={24}
                darkMode={true}
              />
            </div>
          </div>

          {/* App Name */}
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">IPNU IPPNU</h2>
          <p className="text-xl text-green-100 mb-8">Ranting Batursari</p>

          {/* Divider */}
          <div className="w-32 h-1 bg-white/40 mx-auto mb-8"></div>

          {/* Description */}
          <p className="text-lg text-green-50 max-w-md mx-auto leading-relaxed">
            Sistem Informasi Manajemen<br />Organisasi Pelajar Nahdlatul Ulama
          </p>
        </div>
      </div>
    </div>
  );
}