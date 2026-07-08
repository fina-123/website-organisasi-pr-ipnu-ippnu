import { useState } from 'react';
import { useEffect } from 'react';
import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { Search, Mail, User, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface RegistrationData {
  full_name: string;
  organization: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function CheckRegistrationStatus() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RegistrationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
      const response = await fetch(`${apiBase}/api/check-registration?email=${encodeURIComponent(email)}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Pendaftaran dengan email tersebut tidak ditemukan. Pastikan Anda menggunakan email yang benar saat mendaftar.');
        } else {
          setError('Terjadi kesalahan saat memeriksa status. Silakan coba lagi.');
        }
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Gagal terhubung ke server. Silakan coba lagi nanti.');
      console.error('Error checking registration:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          icon: <Clock size={16} />,
          label: 'Pending'
        };
      case 'approved':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          icon: <CheckCircle size={16} />,
          label: 'Disetujui'
        };
      case 'rejected':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          icon: <XCircle size={16} />,
          label: 'Ditolak'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: null,
          label: status
        };
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendaftaran Anda sedang diproses. Admin akan menghubungi Anda dalam 1-3 hari kerja.';
      case 'approved':
        return 'Selamat! Pendaftaran Anda telah disetujui. Silakan login menggunakan akun yang telah dikirim ke email Anda.';
      case 'rejected':
        return 'Maaf, pendaftaran Anda tidak dapat diproses. Silakan hubungi admin untuk informasi lebih lanjut.';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Main Content */}
      <section className="flex-1 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Search size={32} className="text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Cek Status Pendaftaran
            </h1>
            <p className="text-lg text-gray-600">
              Masukkan email yang Anda gunakan saat mendaftar untuk melihat status pendaftaran
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Pendaftar <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                  <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-lg font-medium transition-all ${
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memeriksa...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Cek Status
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <XCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900 mb-1">Pendaftaran Tidak Ditemukan</h3>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Detail Pendaftaran</h3>

              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <User size={20} className="text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Nama Lengkap</p>
                    <p className="font-semibold text-gray-900">{result.full_name}</p>
                  </div>
                </div>

                {/* Organization */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <User size={20} className="text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Organisasi</p>
                    <p className="font-semibold text-gray-900">{result.organization}</p>
                  </div>
                </div>

                {/* Registration Date */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar size={20} className="text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Tanggal Pendaftaran</p>
                    <p className="font-semibold text-gray-900">{formatDate(result.submitted_at)}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const badge = getStatusBadge(result.status);
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${badge.bg} ${badge.text} border ${badge.border}`}>
                            {badge.icon}
                            {badge.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                <div className={`mt-6 p-4 rounded-lg border ${
                  result.status === 'approved' ? 'bg-green-50 border-green-200' :
                  result.status === 'rejected' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <p className={`text-sm ${
                    result.status === 'approved' ? 'text-green-800' :
                    result.status === 'rejected' ? 'text-red-800' :
                    'text-yellow-800'
                  }`}>
                    {getStatusMessage(result.status)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-3">Informasi:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Status akan berubah menjadi "Disetujui" setelah admin memverifikasi data Anda</li>
              <li>• Akun login akan dikirimkan ke email Anda setelah pendaftaran disetujui</li>
              <li>• Jika ada pertanyaan, silakan hubungi admin melalui halaman kontak</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}