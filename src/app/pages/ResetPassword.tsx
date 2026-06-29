import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import { LogoPair } from '../components/LogoPair';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passwords.newPassword.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: updateError } = await supabase.auth.updateUser({
          password: passwords.newPassword,
        });

        if (updateError) throw updateError;
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } catch (err: any) {
        setError(err.message || 'Gagal reset password');
      }
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Lock size={32} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Masukkan password baru Anda</p>
          </div>

          {success ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              Password berhasil direset! Mengalihkan ke halaman login...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Baru
                </label>
                <input
                  type="password"
                  required
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Masukkan password baru"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Masukkan password lagi"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-[#1B5E3A] flex flex-col items-center justify-center p-8 lg:p-16 min-h-[300px] lg:min-h-screen">
        <div className="text-center text-white">
          <div className="flex items-center justify-center mb-8">
            <LogoPair
              ipnuSize={100}
              ippnuSize={100}
              gap={20}
              darkMode={true}
            />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">IPNU IPPNU</h2>
          <p className="text-xl text-green-100 mb-8">Ranting Batursari</p>
        </div>
      </div>
    </div>
  );
}