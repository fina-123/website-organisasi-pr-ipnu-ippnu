import { useEffect, useState } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { MessageSquare, Send, History } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface Suggestion {
  id: number;
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
  status: string;
  balasan?: string;
  tanggal_balas?: string;
  created_at: string;
}

export function UserSuggestions() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mySuggestions, setMySuggestions] = useState<Suggestion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMySuggestions = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/my-suggestions?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setMySuggestions(data);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchMySuggestions();
    }
  }, [showHistory, user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email || !user?.name) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: user.name,
          email: user.email,
          subjek: formData.subject,
          pesan: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim saran');
      }

      toast.success('Saran Anda telah terkirim! Terima kasih atas partisipasinya.');
      setFormData({ subject: '', message: '' });
    } catch (error) {
      console.error('Failed to submit suggestion:', error);
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim saran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="user" />

      <main className="flex-1 p-8 lg:ml-0">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kirim Saran</h1>
            <p className="text-gray-600">Berikan masukan dan saran untuk kemajuan organisasi</p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <MessageSquare size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Suara Anda Penting!</h3>
                <p className="text-sm text-blue-800">
                  Kami sangat menghargai setiap masukan dan saran dari anggota. Saran Anda akan membantu
                  kami meningkatkan kualitas organisasi dan program kegiatan yang lebih baik.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjek Saran
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Contoh: Saran untuk Kegiatan Ramadhan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detail Saran
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Tuliskan saran Anda secara detail di sini..."
                />
                <p className="mt-2 text-xs text-gray-500">
                  Minimal 20 karakter. Jelaskan saran Anda dengan detail agar mudah dipahami.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                  {isSubmitting ? 'Mengirim...' : 'Kirim Saran'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ subject: '', message: '' })}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* History Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <History size={20} />
              {showHistory ? 'Sembunyikan' : 'Lihat'} Riwayat Saran
            </button>
          </div>

          {/* History Section */}
          {showHistory && (
            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Riwayat Saran Anda</h3>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Memuat riwayat...</p>
                </div>
              ) : mySuggestions.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={48} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">Belum ada saran yang dikirim</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mySuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{suggestion.subjek}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          suggestion.status === 'baru' ? 'bg-blue-100 text-blue-700' :
                          suggestion.status === 'dibaca' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {suggestion.status === 'baru' ? 'Baru' :
                           suggestion.status === 'dibaca' ? 'Dibaca' : 'Dibalas ✓'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{suggestion.pesan}</p>
                      <p className="text-xs text-gray-500 mb-3">
                        {new Date(suggestion.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      
                      {suggestion.status === 'dibalas' && suggestion.balasan && (
                        <div style={{background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '12px', marginTop: '8px'}}>
                          <p style={{fontWeight: 'bold', color: '#16a34a', marginBottom: '4px'}}>💬 Balasan Admin:</p>
                          <p style={{color: '#333'}}>{suggestion.balasan}</p>
                          <p style={{fontSize: '12px', color: '#888', marginTop: '4px'}}>
                            Dibalas pada: {suggestion.tanggal_balas ? new Date(suggestion.tanggal_balas).toLocaleDateString('id-ID') : '-'}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Guidelines */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-3">Panduan Memberikan Saran:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Gunakan bahasa yang sopan dan konstruktif</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Jelaskan saran dengan spesifik dan detail</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Fokus pada solusi, bukan hanya masalah</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Saran yang membangun akan sangat dihargai</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
