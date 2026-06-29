import { useEffect, useState } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Newspaper, Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface Article {
  id: number;
  judul: string;
  slug: string;
  konten: string;
  ringkasan?: string;
  kategori: 'Organisasi' | 'Kegiatan' | 'Berita' | 'Pengumuman';
  thumbnail_url?: string;
  penulis: string;
  status: 'draft' | 'published';
  tanggal_publish: string;
  created_at: string;
  updated_at: string;
}

export function AdminNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    judul: '',
    konten: '',
    ringkasan: '',
    kategori: 'Berita' as 'Organisasi' | 'Kegiatan' | 'Berita' | 'Pengumuman',
    thumbnail_url: '',
    penulis: 'Admin',
    status: 'published' as 'draft' | 'published',
    tanggal_publish: new Date().toISOString().split('T')[0],
  });

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/articles`);
      if (!res.ok) throw new Error('Gagal memuat data');
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast.error('Gagal memuat data artikel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const resetForm = () => {
    setFormData({
      judul: '',
      konten: '',
      ringkasan: '',
      kategori: 'Berita',
      thumbnail_url: '',
      penulis: 'Admin',
      status: 'published',
      tanggal_publish: new Date().toISOString().split('T')[0],
    });
    setEditingArticle(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      judul: article.judul,
      konten: article.konten,
      ringkasan: article.ringkasan || '',
      kategori: article.kategori,
      thumbnail_url: article.thumbnail_url || '',
      penulis: article.penulis,
      status: article.status,
      tanggal_publish: article.tanggal_publish,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judul || !formData.konten || !formData.tanggal_publish) {
      toast.error('Mohon lengkapi field yang diperlukan');
      return;
    }

    setSubmitting(true);

    try {
      const url = editingArticle
        ? `${API_BASE}/api/articles/${editingArticle.id}`
        : `${API_BASE}/api/articles`;
      const method = editingArticle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menyimpan data');
      }

      toast.success(editingArticle ? 'Artikel berhasil diperbarui' : 'Artikel berhasil ditambahkan');
      setShowModal(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Failed to save article:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan data');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menghapus data');
      }

      toast.success('Artikel berhasil dihapus');
      setShowDeleteConfirm(null);
      fetchArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus data');
    }
  };

  const handleView = (slug: string) => {
    window.open(`/berita/${slug}`, '_blank');
  };

  const getCategoryBadge = (kategori: string) => {
    const colors = {
      'Organisasi': 'bg-blue-100 text-blue-700',
      'Kegiatan': 'bg-green-100 text-green-700',
      'Berita': 'bg-purple-100 text-purple-700',
      'Pengumuman': 'bg-orange-100 text-orange-700',
    };
    return colors[kategori as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Berita & Artikel</h1>
              <p className="text-gray-600">Kelola berita dan artikel organisasi</p>
            </div>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus size={20} />
              Tulis Artikel
            </button>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Newspaper size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada artikel</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    {article.thumbnail_url ? (
                      <img src={article.thumbnail_url} alt={article.judul} className="w-full h-full object-cover" />
                    ) : (
                      <Newspaper size={48} className="text-gray-400" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 text-xs rounded-full ${getCategoryBadge(article.kategori)}`}>
                        {article.kategori}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(article.tanggal_publish).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{article.judul}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.ringkasan || article.konten.substring(0, 150)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Oleh {article.penulis}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(article.slug)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          title="Lihat"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(article)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(article.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Form for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                  <input
                    type="text"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                    <select
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="Organisasi">Organisasi</option>
                      <option value="Kegiatan">Kegiatan</option>
                      <option value="Berita">Berita</option>
                      <option value="Pengumuman">Pengumuman</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Publish *</label>
                  <input
                    type="date"
                    value={formData.tanggal_publish}
                    onChange={(e) => setFormData({ ...formData, tanggal_publish: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
                  <input
                    type="text"
                    value={formData.penulis}
                    onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Thumbnail (opsional)</label>
                  <input
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan (opsional)</label>
                  <textarea
                    value={formData.ringkasan}
                    onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konten *</label>
                  <textarea
                    value={formData.konten}
                    onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Menyimpan...' : editingArticle ? 'Perbarui' : 'Publikasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}