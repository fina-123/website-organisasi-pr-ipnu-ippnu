import { useEffect, useState } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Network, Plus, Edit, Trash2, UserCircle, X } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface OrganizationMember {
  id: number;
  nama: string;
  jabatan: string;
  organisasi: 'IPNU' | 'IPPNU';
  periode: string;
  urutan: number;
  foto_url?: string;
  created_at: string;
  updated_at: string;
}

export function AdminStructure() {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<OrganizationMember | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    organisasi: 'IPNU' as 'IPNU' | 'IPPNU',
    periode: '',
    urutan: 0,
    foto_url: '',
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/organization-members`);
      if (!res.ok) throw new Error('Gagal memuat data');
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      toast.error('Gagal memuat data struktur organisasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const resetForm = () => {
    setFormData({
      nama: '',
      jabatan: '',
      organisasi: 'IPNU',
      periode: '',
      urutan: 0,
      foto_url: '',
    });
    setEditingMember(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (member: OrganizationMember) => {
    setEditingMember(member);
    setFormData({
      nama: member.nama,
      jabatan: member.jabatan,
      organisasi: member.organisasi,
      periode: member.periode,
      urutan: member.urutan,
      foto_url: member.foto_url || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama || !formData.jabatan || !formData.periode) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    setSubmitting(true);

    try {
      const url = editingMember
        ? `${API_BASE}/api/organization-members/${editingMember.id}`
        : `${API_BASE}/api/organization-members`;
      const method = editingMember ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menyimpan data');
      }

      toast.success(editingMember ? 'Pengurus berhasil diperbarui' : 'Pengurus berhasil ditambahkan');
      setShowModal(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Failed to save member:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan data');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/organization-members/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menghapus data');
      }

      toast.success('Pengurus berhasil dihapus');
      setShowDeleteConfirm(null);
      fetchMembers();
    } catch (error) {
      console.error('Failed to delete member:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus data');
    }
  };

  const ipnuMembers = members.filter((m) => m.organisasi === 'IPNU');
  const ippnuMembers = members.filter((m) => m.organisasi === 'IPPNU');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Struktur Organisasi</h1>
              <p className="text-gray-600">Kelola pengurus IPNU & IPPNU</p>
            </div>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus size={20} />
              Tambah Pengurus
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : (
            <>
              {/* IPNU Section */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">IP</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Pengurus IPNU</h2>
                </div>
                {ipnuMembers.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">Belum ada pengurus IPNU</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ipnuMembers.map((member) => (
                      <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              {member.foto_url ? (
                                <img src={member.foto_url} alt={member.nama} className="w-12 h-12 rounded-full object-cover" />
                              ) : (
                                <UserCircle size={32} className="text-green-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 truncate">{member.nama}</h3>
                              <p className="text-sm text-green-700">{member.jabatan}</p>
                              <p className="text-xs text-gray-500">{member.periode}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(member)}
                            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center gap-1 text-sm"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(member.id)}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* IPPNU Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">IP</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Pengurus IPPNU</h2>
                </div>
                {ippnuMembers.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">Belum ada pengurus IPPNU</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ippnuMembers.map((member) => (
                      <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                              {member.foto_url ? (
                                <img src={member.foto_url} alt={member.nama} className="w-12 h-12 rounded-full object-cover" />
                              ) : (
                                <UserCircle size={32} className="text-purple-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 truncate">{member.nama}</h3>
                              <p className="text-sm text-purple-700">{member.jabatan}</p>
                              <p className="text-xs text-gray-500">{member.periode}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(member)}
                            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center gap-1 text-sm"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(member.id)}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal Form for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingMember ? 'Edit Pengurus' : 'Tambah Pengurus'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan *</label>
                  <input
                    type="text"
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organisasi *</label>
                  <select
                    value={formData.organisasi}
                    onChange={(e) => setFormData({ ...formData, organisasi: e.target.value as 'IPNU' | 'IPPNU' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="IPNU">IPNU</option>
                    <option value="IPPNU">IPPNU</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Periode *</label>
                  <input
                    type="text"
                    value={formData.periode}
                    onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                    placeholder="Contoh: 2026-2028"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Tampil (opsional)</label>
                  <input
                    type="number"
                    value={formData.urutan}
                    onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Foto (opsional)</label>
                  <input
                    type="url"
                    value={formData.foto_url}
                    onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  {submitting ? 'Menyimpan...' : editingMember ? 'Perbarui' : 'Tambah'}
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
              Apakah Anda yakin ingin menghapus pengurus ini? Tindakan ini tidak dapat dibatalkan.
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
