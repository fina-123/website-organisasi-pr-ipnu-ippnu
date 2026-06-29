import { useEffect, useState } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Calendar, Users, MapPin, X, Search, Filter, Eye, UserCheck, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

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
}

interface Registration {
  id: string;
  user_id: string;
  activity_id: string;
  status: 'pending' | 'approved' | 'rejected';
  registered_date: string;
  title?: string;
  type?: string;
  date?: string;
  location?: string;
  quota?: number;
}

type FilterStatus = 'all' | 'upcoming' | 'ongoing' | 'completed';

export function UserActivities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter((a) => a.status === filter);

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

  const fetchMyRegistrations = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`${API_BASE}/api/my-registrations?userId=${user.id}`);
      if (!res.ok) throw new Error('Gagal memuat riwayat');
      const data = await res.json();
      setMyRegistrations(data);
    } catch (error) {
      console.error('Failed to fetch my registrations:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filter, searchQuery]);

  useEffect(() => {
    fetchMyRegistrations();
  }, [user?.id]);

  const handleRegister = async (activityId: string) => {
    if (!user?.id) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    setRegisteringId(activityId);

    try {
      const res = await fetch(`${API_BASE}/api/activities/${activityId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mendaftar');
      }

      toast.success('Pendaftaran berhasil! Menunggu persetujuan admin.');
      fetchActivities();
      fetchMyRegistrations();
    } catch (error) {
      console.error('Failed to register:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal mendaftar kegiatan');
    } finally {
      setRegisteringId(null);
    }
  };

  const isRegistered = (activityId: string) => {
    return myRegistrations.some((r) => r.activity_id === activityId);
  };

  const getRegistrationStatus = (activityId: string) => {
    const reg = myRegistrations.find((r) => r.activity_id === activityId);
    return reg?.status;
  };

  const openDetailModal = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowDetailModal(true);
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
      <DashboardSidebar role="user" />

      <main className="flex-1 p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Kegiatan</h1>
              <p className="text-gray-600">Daftar kegiatan IPNU IPPNU Batursari</p>
            </div>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <UserCheck size={20} />
              Riwayat Pendaftaran
            </button>
          </div>

          {/* Filter */}
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

          {/* Activities Grid */}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => {
                const registered = isRegistered(activity.id);
                const regStatus = getRegistrationStatus(activity.id);
                const isFull = activity.registered >= activity.quota;
                const canRegister = activity.status === 'upcoming' && !isFull && !registered;

                return (
                  <div key={activity.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className={`h-48 flex items-center justify-center ${
                      activity.status === 'upcoming' ? 'bg-blue-100' :
                      activity.status === 'ongoing' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Calendar size={64} className={
                        activity.status === 'upcoming' ? 'text-blue-600' :
                        activity.status === 'ongoing' ? 'text-green-600' : 'text-gray-600'
                      } />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {getTypeBadge(activity.type)}
                        {getStatusBadge(activity.status)}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{activity.description}</p>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{new Date(activity.date).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          <span>{activity.registered}/{activity.quota} peserta</span>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${Math.min((activity.registered / activity.quota) * 100, 100)}%` }}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetailModal(activity)}
                          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                        >
                          <Eye size={16} />
                          Detail
                        </button>

                        {canRegister && (
                          <button
                            onClick={() => handleRegister(activity.id)}
                            disabled={registeringId === activity.id}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            {registeringId === activity.id ? 'Mendaftar...' : 'Daftar'}
                          </button>
                        )}

                        {registered && regStatus === 'pending' && (
                          <button
                            disabled
                            className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg cursor-not-allowed"
                          >
                            Menunggu
                          </button>
                        )}

                        {registered && regStatus === 'approved' && (
                          <button
                            disabled
                            className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg cursor-not-allowed"
                          >
                            Terdaftar
                          </button>
                        )}

                        {registered && regStatus === 'rejected' && (
                          <button
                            disabled
                            className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg cursor-not-allowed"
                          >
                            Ditolak
                          </button>
                        )}

                        {!registered && isFull && activity.status === 'upcoming' && (
                          <button
                            disabled
                            className="flex-1 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                          >
                            Kuota Penuh
                          </button>
                        )}

                        {activity.status !== 'upcoming' && !registered && (
                          <button
                            disabled
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed"
                          >
                            Ditutup
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredActivities.length === 0 && !loading && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada kegiatan</p>
            </div>
          )}
        </div>
      </main>

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

                {isRegistered(selectedActivity.id) && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Status pendaftaran Anda: {getRegistrationStatusBadge(getRegistrationStatus(selectedActivity.id) || 'pending')}
                    </p>
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

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Riwayat Pendaftaran Saya</h2>
                  <p className="text-sm text-gray-600 mt-1">Daftar kegiatan yang Anda ikuti</p>
                </div>
                <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {myRegistrations.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList size={48} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">Belum ada pendaftaran</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRegistrations.map((registration) => (
                    <div key={registration.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{registration.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeBadge(registration.type || 'LAINNYA')}
                            {getRegistrationStatusBadge(registration.status)}
                          </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{registration.date ? new Date(registration.date).toLocaleDateString('id-ID') : 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>{registration.location || 'N/A'}</span>
                              </div>
                            </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Terdaftar: {registration.registered_date ? new Date(registration.registered_date).toLocaleDateString('id-ID') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => setShowHistoryModal(false)}
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