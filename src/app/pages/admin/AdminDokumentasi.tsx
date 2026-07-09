import { useEffect, useState } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Image, Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface Dokumentasi {
  id: number;
  judul: string;
  kategori: 'Kegiatan' | 'Sosial' | 'Organisasi' | 'Lainnya';
  foto_url: string;
  deskripsi?: string;
  tanggal: string;
  created_at: string;
  updated_at: string;
}

export function AdminDokumentasi() {
  const [dokumentasiList, setDokumentasiList] = useState<Dokumentasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Dokumentasi | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Kegiatan' as 'Kegiatan' | 'Sosial' | 'Organisasi' | 'Lainnya',
    deskripsi: '',
    tanggal: new Date().toISOString().split('T')[0],
  });

  const fetchDokumentasi = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/dokumentasi`);
      if (!res.ok) throw new Error('Gagal memuat data');
      const data = await res.json();
      setDokumentasiList(data);
    } catch (error) {
      console.error('Failed to fetch dokumentasi:', error);
      toast.error('Gagal memuat data dokumentasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDokumentasi();
  }, []);

  const resetForm = () => {
    setFormData({
      judul: '',
      kategori: 'Kegiatan',
      deskripsi: '',
      tanggal: new Date().toISOString().split('T')[0],
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item: Dokumentasi) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      kategori: item.kategori,
      deskripsi: item.deskripsi || '',
      tanggal: item.tanggal,
    });
    setPreviewUrl(item.foto_url);
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 2MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judul || !formData.tanggal) {
      toast.error('Judul dan tanggal harus diisi');
      return;
    }

    if (!editingItem && !selectedFile) {
      toast.error('Foto harus diunggah');
      return;
    }

    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('judul', formData.judul);
      submitData.append('kategori', formData.kategori);
      submitData.append('tanggal', formData.tanggal);
      if (formData.deskripsi) {
        submitData.append('deskripsi', formData.deskripsi);
      }
      if (selectedFile) {
        submitData.append('foto', selectedFile);
      }

      const url = editingItem ? `${API_BASE}/api/dokumentasi/${editingItem.id}` : `${API_BASE}/api/dokumentasi`;
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: submitData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Gagal menyimpan data');
      }

      toast.success(editingItem ? 'Dokumentasi berhasil diperbarui' : 'Dokumentasi berhasil ditambahkan');
      setShowModal(false);
      resetForm();
      fetchDokumentasi();
    } catch (error: any) {
      console.error('Failed to save dokumentasi:', error);
      toast.error(error.message || 'Gagal menyimpan data');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dokumentasi ini?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/dokumentasi/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Gagal menghapus data');
      }

      toast.success('Dokumentasi berhasil dihapus');
      fetchDokumentasi();
    } catch (error: any) {
      console.error('Failed to delete dokumentasi:', error);
      toast.error(error.message || 'Gagal menghapus data');
    }
  };

  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case 'Kegiatan':
        return 'bg-blue-100 text-blue-700';
      case 'Sosial':
        return 'bg-green-100 text-green-700';
      case 'Organisasi':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Dokumentasi</h1>
              <p className="text-gray-600">Tambah dan kelola galeri foto kegiatan IPNU IPPNU</p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus size={20} />
              Tambah Dokumentasi
            </button>
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat data dokumentasi...</p>
            </div>
          ) : dokumentasiList.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Image size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada dokumentasi.</p>
              <p className="text-sm text-gray-400 mt-1">
                Klik tombol "Tambah Dokumentasi" untuk menambahkan foto pertama.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dokumentasiList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={item.foto_url}
                      alt={item.judul}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                        title="Edit"
                      >
                        <Edit size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                        title="Hapus"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded mb-2">
                      {item.kategori}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{item.judul}</h3>
                    {item.deskripsi && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.deskripsi}</p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Image size={12} />
                      <span>{new Date(item.tanggal).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Dokumentasi' : 'Tambah Dokumentasi'}
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Foto Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-center justify-center w-full">
                  {previewUrl ? (
                    <div className="relative w-full h-64 mb-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl('');
                          setSelectedFile(null);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload size={48} className="text-gray-400 mb-3" />
                        <p className="text-sm text-gray-500 mb-1">Klik untuk upload foto</p>
                        <p className="text-xs text-gray-400">JPG, JPEG, PNG (Max 2MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Judul */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Contoh: MAKESTA 2025"
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Organisasi">Organisasi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Deskripsi dokumentasi (opsional)"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  disabled={submitting}
                >
                  {submitting ? 'Menyimpan...' : editingItem ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}