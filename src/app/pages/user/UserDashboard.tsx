import { useEffect, useState } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Calendar, ClipboardList, TrendingUp, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

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

export function UserDashboard() {
  const { user } = useAuth();
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [upcomingActivities, setUpcomingActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Fetch my registrations
      const regRes = await fetch(`${API_BASE}/api/my-registrations?userId=${user.id}`);
      if (regRes.ok) {
        const regs = await regRes.json();
        setMyRegistrations(regs);
      }

      // Fetch upcoming activities
      const actRes = await fetch(`${API_BASE}/api/activities?status=upcoming`);
      if (actRes.ok) {
        const acts = await actRes.json();
        setUpcomingActivities(acts.slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (activityId: string) => {
    if (!user?.id) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

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
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to register:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal mendaftar kegiatan');
    }
  };

  const isRegistered = (activityId: string) => {
    return myRegistrations.some((r) => r.activity_id === activityId);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const stats = [
    {
      label: 'Kegiatan Diikuti',
      value: myRegistrations.filter((r) => r.status === 'approved').length,
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Pendaftaran Aktif',
      value: myRegistrations.filter((r) => r.status === 'pending').length,
      icon: ClipboardList,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Kegiatan Tersedia',
      value: upcomingActivities.length,
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Sertifikat',
      value: myRegistrations.filter((r) => r.status === 'approved').length,
      icon: Award,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="user" />

      <main className="flex-1 p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Selamat datang kembali, {user?.name || 'Anggota'}!</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upcoming Activities */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Kegiatan Mendatang</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Memuat data...</p>
                  </div>
                ) : upcomingActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>Belum ada kegiatan mendatang</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar size={20} className="text-green-600" />
                        </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{activity.title}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(activity.date).toLocaleDateString('id-ID')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.registered}/{activity.quota} peserta
                        </p>
                      </div>
                      <div>
                        {isRegistered(activity.id) ? (
                          <button
                            disabled
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm cursor-not-allowed"
                          >
                            Sudah Terdaftar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRegister(activity.id)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                          >
                            Daftar
                          </button>
                        )}
                      </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* My Registrations */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Pendaftaran Saya</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Memuat data...</p>
                  </div>
                ) : myRegistrations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardList size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>Belum ada pendaftaran</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myRegistrations.map((registration) => (
                      <div key={registration.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          registration.status === 'approved' ? 'bg-green-100' :
                          registration.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          <ClipboardList size={20} className={
                            registration.status === 'approved' ? 'text-green-600' :
                            registration.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                          } />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">{registration.title || 'Kegiatan'}</h3>
                          <p className="text-sm text-gray-600">
                            {registration.registered_date ? new Date(registration.registered_date).toLocaleDateString('id-ID') : 'N/A'}
                          </p>
                          <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                            registration.status === 'approved' ? 'bg-green-100 text-green-700' :
                            registration.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {registration.status === 'approved' ? 'Disetujui' :
                             registration.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
