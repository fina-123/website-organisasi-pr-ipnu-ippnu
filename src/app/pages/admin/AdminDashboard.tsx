import { useEffect, useState } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Users, Calendar, ClipboardList, Newspaper, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { mockMembers, mockNews } from '../../data/mockData';
import type { Registration } from '../../data/mockData';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface ActivityStats {
  total_activities: number;
  upcoming_count: number;
  ongoing_count: number;
  completed_count: number;
  total_quota: number;
  total_registered: number;
}

interface RecentActivity {
  id: string;
  title: string;
  type: string;
  date: string;
  registered: number;
  quota: number;
  status: string;
}

interface RegistrationWithDetails extends Registration {
  title?: string;
  full_name?: string;
  registered_date?: string;
  activity_id?: string;
}

export function AdminDashboard() {
  const [pendingRegistrations, setPendingRegistrations] = useState<RegistrationWithDetails[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total members from created accounts
      const membersRes = await fetch(`${API_BASE}/api/created-accounts`);
      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setTotalMembers(membersData.length);
      }

      // Fetch total articles
      const articlesRes = await fetch(`${API_BASE}/api/articles?status=published`);
      if (articlesRes.ok) {
        const articlesData = await articlesRes.json();
        setTotalArticles(articlesData.length);
      }

      // Fetch activity stats
      const statsRes = await fetch(`${API_BASE}/api/activities/stats`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setActivityStats(statsData.overview);
        setRecentActivities(statsData.recent || []);
      }

      // Fetch pending registrations
      const regRes = await fetch(`${API_BASE}/api/activities?status=upcoming`);
      if (regRes.ok) {
        const activities = await regRes.json();
        const allRegistrations: RegistrationWithDetails[] = [];

        for (const activity of activities.slice(0, 5)) {
          const regRes = await fetch(`${API_BASE}/api/activities/${activity.id}/registrations`);
          if (regRes.ok) {
            const regs = await regRes.json();
            allRegistrations.push(...regs.filter((r: Registration) => r.status === 'pending'));
          }
        }

        setPendingRegistrations(allRegistrations.slice(0, 10));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (registrationId: string, activityId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/activities/${activityId}/registrations/${registrationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menyetujui');
      }

      toast.success('Pendaftaran disetujui!');
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to approve:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyetujui pendaftaran');
    }
  };

  const handleReject = async (registrationId: string, activityId: string) => {
    if (!confirm('Tolak pendaftaran ini?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/activities/${activityId}/registrations/${registrationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menolak');
      }

      toast.success('Pendaftaran ditolak!');
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to reject:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menolak pendaftaran');
    }
  };

  const stats = [
    {
      label: 'Total Anggota',
      value: totalMembers,
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Kegiatan Aktif',
      value: activityStats?.upcoming_count || 0,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Pendaftaran Pending',
      value: pendingRegistrations.length,
      icon: ClipboardList,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Total Berita',
      value: totalArticles,
      icon: Newspaper,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
            <p className="text-gray-600">Selamat datang di panel administrasi IPNU IPPNU Batursari</p>
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
            {/* Recent Activities */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Kegiatan Terbaru</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Memuat data...</p>
                  </div>
                ) : recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>Belum ada kegiatan</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar size={20} className="text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{activity.title}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(activity.date).toLocaleDateString('id-ID')} • {activity.registered}/{activity.quota} peserta
                          </p>
                          <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                            activity.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                            activity.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {activity.status === 'upcoming' ? 'Mendatang' : activity.status === 'ongoing' ? 'Berlangsung' : 'Selesai'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pending Registrations */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Pendaftaran Menunggu</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Memuat data...</p>
                  </div>
                ) : pendingRegistrations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardList size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>Tidak ada pendaftaran yang menunggu</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRegistrations.map((registration) => (
                      <div key={registration.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ClipboardList size={20} className="text-yellow-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">{registration.title || 'Kegiatan'}</h3>
                          <p className="text-sm text-gray-600">
                            {registration.full_name || 'User'} • {registration.registered_date ? new Date(registration.registered_date).toLocaleDateString('id-ID') : 'N/A'}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={() => handleApprove(registration.id, registration.activity_id || '')}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center gap-1"
                            >
                              <Check size={14} />
                              Setujui
                            </button>
                            <button 
                              onClick={() => handleReject(registration.id, registration.activity_id || '')}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 flex items-center gap-1"
                            >
                              <X size={14} />
                              Tolak
                            </button>
                          </div>
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
