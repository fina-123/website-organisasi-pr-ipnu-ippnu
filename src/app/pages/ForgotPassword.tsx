import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, KeyRound, Eye, EyeOff, Lock } from 'lucide-react';
import { LogoPair } from '../components/LogoPair';

export function ForgotPassword() {
  const [step, setStep] = useState<'email' | 'newPassword' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      let createdUsers = {};
      try { createdUsers = JSON.parse(localStorage.getItem('created_users') || '{}'); } catch { createdUsers = {}; }
      const user = createdUsers[email];

      if (!user) {
        setError('Email tidak ditemukan. Pastikan email sudah terdaftar dan disetujui oleh admin.');
        setLoading(false);
        return;
      }

      setStep('newPassword');
      setLoading(false);
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      let createdUsers = {};
      try { createdUsers = JSON.parse(localStorage.getItem('created_users') || '{}'); } catch { createdUsers = {}; }
      if (createdUsers[email]) {
        createdUsers[email].password = password;
        localStorage.setItem('created_users', JSON.stringify(createdUsers));
      }

      setStep('success');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Kembali ke Login</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Lupa Password</h1>
            <p className="text-gray-600">{step === 'email' ? 'Verifikasi email Anda' : step === 'newPassword' ? 'Buat password baru' : 'Password berhasil diubah'}</p>
          </div>

          {step === 'email' && (
            <form onSubmit={handleVerifyEmail} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Terdaftar
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                  placeholder="Masukkan email yang terdaftar"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Masukkan email yang telah didaftarkan dan disetujui oleh admin.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Lanjutkan'
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Ingat password Anda?{' '}
                  <Link to="/login" className="text-green-700 hover:text-green-800 font-medium">
                    Login di sini
                  </Link>
                </p>
              </div>
            </form>
          )}

          {step === 'newPassword' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Email terverifikasi: <strong>{email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                    placeholder="Minimal 6 karakter"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                    placeholder="Ulangi password baru"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Simpan Password Baru
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
              >
                Kembali ke verifikasi email
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound size={20} className="text-green-600" />
                  <h3 className="font-bold text-green-900">Berhasil!</h3>
                </div>
                <p className="text-sm text-green-800">
                  Password Anda telah berhasil diubah. Silakan login dengan password baru.
                </p>
              </div>

              <Link
                to="/login"
                className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
              >
                Login Sekarang
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="w-full lg:w-1/2 bg-[#1B5E3A] flex flex-col items-center justify-center p-8 lg:p-16 min-h-[300px] lg:min-h-screen">
        <div className="text-center text-white">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-8">
              <LogoPair ipnuSize={120} ippnuSize={120} gap={24} darkMode={true} />
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">IPNU IPPNU</h2>
          <p className="text-xl text-green-100 mb-8">Ranting Batursari</p>
          <div className="w-32 h-1 bg-white/40 mx-auto mb-8"></div>
          <p className="text-lg text-green-50 max-w-md mx-auto leading-relaxed">
            Sistem Informasi Manajemen<br />Organisasi Pelajar Nahdlatul Ulama
          </p>
        </div>
      </div>
    </div>
  );
}

