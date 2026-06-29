import { DashboardSidebar } from '../../components/DashboardSidebar';
import { MessageSquare, Check, Mail, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface Suggestion {
  id: number;
  nama: string;
  email?: string;
  telepon?: string;
  subjek: string;
  pesan: string;
  status: 'baru' | 'dibaca' | 'dibalas';
  balasan?: string;
  tanggal_balas?: string;
  created_at: string;
  updated_at: string;
}

export function AdminSuggestions() {
  const [filter, setFilter] = useState<'all' | 'baru' | 'dibaca' | 'dibalas'>('all');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = filter === 'all' 
        ? `${API_BASE}/api/suggestions`
        : `${API_BASE}/api/suggestions?status=${filter}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Gagal memuat data');
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setError('Gagal memuat data saran');
      toast.error('Gagal memuat data saran');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [filter]);

  const handleViewDetail = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/suggestions/${id}`);
      if (!res.ok) throw new Error('Gagal memuat detail');
      const data = await res.json();
      setSelectedSuggestion(data);
      setReplyText('');
    } catch (error) {
      console.error('Failed to fetch suggestion detail:', error);
      toast.error('Gagal memuat detail saran');
    }
  };

  const handleReply = async () => {
    if (!selectedSuggestion || !replyText.trim()) {
      toast.error('Balasan tidak boleh kosong');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/suggestions/${selectedSuggestion.id}/balas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balasan: replyText }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal membalas');
      }

      toast.success('Balasan berhasil dikirim');
      setSelectedSuggestion(null);
      setReplyText('');
      fetchSuggestions();
    } catch (error) {
      console.error('Failed to reply:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal membalas saran');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus saran ini?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/suggestions/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menghapus');
      }

      toast.success('Saran berhasil dihapus');
      fetchSuggestions();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus saran');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'baru': 'bg-blue-100 text-blue-700',
      'dibaca': 'bg-yellow-100 text-yellow-700',
      'dibalas': 'bg-green-100 text-green-700',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (status: string) => {
    const texts = {
      'baru': 'Baru',
      'dibaca': 'Dibaca',
      'dibalas': 'Dibalas',
    };
    return texts[status as keyof typeof texts] || status;
  };

  const filteredCount = (status: string) => {
    if (status === 'all') return suggestions.length;
    return suggestions.filter((s) => s.status === status).length;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Saran Masuk</h1>
            <p className="text-gray-600">Kelola saran dan masukan dari pengunjung</p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Semua ({filteredCount('all')})
            </button>
            <button
              onClick={() => setFilter('baru')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'baru'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Baru ({filteredCount('baru')})
            </button>
            <button
              onClick={() => setFilter('dibaca')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'dibaca'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Dibaca ({filteredCount('dibaca')})
            </button>
            <button
              onClick={() => setFilter('dibalas')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'dibalas'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Dibalas ({filteredCount('dibalas')})
            </button>
          </div>

          {/* Suggestions List */}
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada saran</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        suggestion.status === 'baru' ? 'bg-blue-100' :
                        suggestion.status === 'dibaca' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        <MessageSquare size={24} className={
                          suggestion.status === 'baru' ? 'text-blue-600' :
                          suggestion.status === 'dibaca' ? 'text-yellow-600' : 'text-green-600'
                        } />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{suggestion.subjek}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(suggestion.status)}`}>
                            {getStatusText(suggestion.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Dari: <span className="font-medium">{suggestion.nama}</span> • {new Date(suggestion.created_at).toLocaleDateString('id-ID')}
                        </p>
                        <p className="text-sm text-gray-700 mt-3 line-clamp-2">{suggestion.pesan}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleViewDetail(suggestion.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm"
                    >
                      <Mail size={16} />
                      Lihat Detail
                    </button>
                    {suggestion.status !== 'dibalas' && (
                      <button
                        onClick={() => {
                          setSelectedSuggestion(suggestion);
                          setReplyText('');
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 text-sm"
                      >
                        <Mail size={16} />
                        Balas
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(suggestion.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2 text-sm"
                    >
                      <X size={16} />
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Detail Saran</h2>
                <button
                  onClick={() => {
                    setSelectedSuggestion(null);
                    setReplyText('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <p className="text-gray-900">{selectedSuggestion.nama}</p>
                </div>

                {selectedSuggestion.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedSuggestion.email}</p>
                  </div>
                )}

                {selectedSuggestion.telepon && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                    <p className="text-gray-900">{selectedSuggestion.telepon}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
                  <p className="text-gray-900">{selectedSuggestion.subjek}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedSuggestion.pesan}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kirim</label>
                  <p className="text-gray-900">{new Date(selectedSuggestion.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusBadge(selectedSuggestion.status)}`}>
                    {getStatusText(selectedSuggestion.status)}
                  </span>
                </div>

                {selectedSuggestion.balasan && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Balasan</label>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-gray-900 whitespace-pre-wrap mb-2">{selectedSuggestion.balasan}</p>
                      {selectedSuggestion.tanggal_balas && (
                        <p className="text-xs text-gray-500">
                          Dibalas pada: {new Date(selectedSuggestion.tanggal_balas).toLocaleDateString('id-ID')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedSuggestion.status !== 'dibalas' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tulis Balasan</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Tulis balasan Anda..."
                    />
                  </div>
                )}
              </div>

              {selectedSuggestion.status !== 'dibalas' && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setSelectedSuggestion(null);
                      setReplyText('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={submitting || !replyText.trim()}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Mengirim...' : 'Kirim Balasan'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}