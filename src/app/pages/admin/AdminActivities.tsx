import { useEffect, useState } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Calendar, Plus, Edit, Trash2, Users, X, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface Activity {
  id: string;
  title: string;
  type: 'MAKESTA' | 'LAKMUD' | 'PELATIHAN' | 'BAKSOS' | 'LAINNYA';
  description: string;
  date: string;
  location: string;
  quota: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  image?: string;
  created_at?: string;
  updated_at?: string;
}

interface Registration {
  id: string;
  user_id: string;
  activity_id: string;
  status: 'pending' | 'approved' | 'rejected';
  registered_date: string;
  full_name?: string;
  email?: string;
  phone?: string;
}

type FilterStatus = 'all' | 'upcoming' | 'ongoing' | 'completed';

export function AdminActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'LAINNYA' as Activity['type'],
    description: '',
    date: '',
    location: '',
    quota: '',
    image: '',
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`${API_BASE}/api/activities?${params}`);
      if (!res.ok) throw new Error('Gagal memuat data');
      const data = await res.json();
      setActivities(data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      toast.error('Gagal memuat data kegiatan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filter, searchQuery]);

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'LAINNYA',
      description: '',
      date: '',
      location: '',
      quota: '',
      image: '',
    });
    setEditingActivity(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      type: activity.type,
      description: activity.description,
      date: activity.date,
      location: activity.location,
      quota: activity.quota.toString(),
      image: activity.image || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.date || !formData.location || !formData.quota) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const quotaNum = parseInt(formData.quota);
    if (isNaN(quotaNum) || quotaNum < 1) {
      toast.error('Kuota harus berupa angka minimal 1');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        quota: quotaNum,
        image: formData.image || undefined,
      };

      const url = editingActivity
        ? `${API_BASE}/api/activities/${editingActivity.id}`
        : `${API_BASE}/api/activities`;
      const method = editingActivity ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menyimpan kegiatan');
      }

      toast.success(editingActivity ? 'Kegiatan berhasil diperbarui' : 'Kegiatan berhasil ditambahkan');
      setShowModal(false);
      resetForm();
      fetchActivities();
    } catch (error) {
      console.error('Failed to save activity:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan kegiatan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/activities/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menghapus kegiatan');
      }

      toast.success('Kegiatan berhasil dihapus');
      fetchActivities();
    } catch (error) {
      console.error('Failed to delete activity:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus kegiatan');
    }
  };

  const openDetailModal = async (activity: Activity) => {
    setSelectedActivity(activity);
    setShowDetailModal(true);
  };

  const openRegistrationsModal = async (activity: Activity) => {
    setSelectedActivity(activity);
    setShowRegistrationsModal(true);
    setLoadingRegistrations(true);

    try {
      const res = await fetch(`${API_BASE}/api/activities/${activity.id}/registrations`);
      if (!res.ok) throw new Error('Gagal memuat pendaftaran');
      const data = await res.json();
      setRegistrations(data);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
      toast.error('Gagal memuat data pendaftaran');
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const updateRegistrationStatus = async (registrationId: string, status: 'approved' | 'rejected') => {
    if (!selectedActivity) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/activities/${selectedActivity.id}/registrations/${registrationId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal memperbarui status');
      }

      toast.success(`Pendaftaran berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
      // Refresh registrations
      const regRes = await fetch(`${API_BASE}/api/activities/${selectedActivity.id}/registrations`);
      const regData = await regRes.json();
      setRegistrations(regData);
      fetchActivities();
    } catch (error) {
      console.error('Failed to update registration status:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Mendatang</span>;
      case 'ongoing':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Berlangsung</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Selesai</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'MAKESTA':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">MAKESTA</span>;
      case 'LAKMUD':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">LAKMUD</span>;
      case 'PELATIHAN':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">PELATIHAN</span>;
      case 'BAKSOS':
        return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">BAKSOS</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">LAINNYA</span>;
    }
  };

  const getRegistrationStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Menunggu</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Disetujui</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Ditolak</span>;
      default:
        return null;
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Kegiatan</h1>
              <p className="text-gray-600">Manajemen kegiatan IPNU IPPNU</p>
            </div>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus size={20} />
              Tambah Kegiatan
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Cari kegiatan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Filter size={20} className="text-gray-400 self-center" />
                {(['all', 'upcoming', 'ongoing', 'completed'] as FilterStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      filter === status
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'all' ? 'Semua' : status === 'upcoming' ? 'Mendatang' : status === 'ongoing' ? 'Berlangsung' : 'Selesai'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activities List */}
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada kegiatan</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="font-bold text-gray-900">{activity.title}</h3>
                        {getTypeBadge(activity.type)}
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{activity.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>{new Date(activity.date).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📍</span>
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} />
                          <span>{activity.registered}/{activity.quota} peserta</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${Math.min((activity.registered / activity.quota) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openDetailModal(activity)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Detail"
                      >
                        <Calendar size={18} />
                      </button>
                      <button
                        onClick={() => openEditModal(activity)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openRegistrationsModal(activity)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                        title="Pendaftaran"
                      >
                        <Users size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingActivity ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kegiatan *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Kegiatan *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Activity['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="MAKESTA">MAKESTA</option>
                    <option value="LAKMUD">LAKMUD</option>
                    <option value="PELATIHAN">PELATIHAN</option>
                    <option value="BAKSOS">BAKSOS</option>
                    <option value="LAINNYA">LAINNYA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kuota *</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quota}
                      onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar (opsional)</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingActivity ? 'Perbarui' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Detail Kegiatan</h2>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedActivity.title}</h3>
                  <div className="flex gap-2">
                    {getTypeBadge(selectedActivity.type)}
                    {getStatusBadge(selectedActivity.status)}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Deskripsi</h4>
                  <p className="text-gray-600">{selectedActivity.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Tanggal</h4>
                    <p className="text-gray-600">{new Date(selectedActivity.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Lokasi</h4>
                    <p className="text-gray-600">{selectedActivity.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Kuota</h4>
                    <p className="text-gray-600">{selectedActivity.quota} peserta</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Terdaftar</h4>
                    <p className="text-gray-600">{selectedActivity.registered} peserta</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Progress Pendaftaran</h4>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: `${Math.min((selectedActivity.registered / selectedActivity.quota) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.round((selectedActivity.registered / selectedActivity.quota) * 100)}% terisi
                  </p>
                </div>

                {selectedActivity.image && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Gambar</h4>
                    <img
                      src={selectedActivity.image}
                      alt={selectedActivity.title}
                      className="w-full rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registrations Modal */}
      {showRegistrationsModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Pendaftaran Kegiatan</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedActivity.title}</p>
                </div>
                <button onClick={() => setShowRegistrationsModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingRegistrations ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Memuat data pendaftaran...</p>
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">Belum ada pendaftaran</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Nama</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Telepon</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Tanggal Daftar</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{reg.full_name || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-600">{reg.email || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-600">{reg.phone || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(reg.registered_date).toLocaleDateString('id-ID')}
                          </td>
                          <td className="py-3 px-4">{getRegistrationStatusBadge(reg.status)}</td>
                          <td className="py-3 px-4">
                            {reg.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateRegistrationStatus(reg.id, 'approved')}
                                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() => updateRegistrationStatus(reg.id, 'rejected')}
                                  className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                >
                                  Tolak
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => setShowRegistrationsModal(false)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}