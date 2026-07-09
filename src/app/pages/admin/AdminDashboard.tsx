import { useEffect, useState } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Users, Calendar, ClipboardList, Newspaper, Check, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Registration } from '../../data/mockData';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface Activity {
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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const [totalActivities, setTotalActivities] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total members from created accounts
      console.log('🔍 [DASHBOARD] Fetching members from /api/created-accounts');
      const membersRes = await fetch(`${API_BASE}/api/created-accounts`);
      console.log('🔍 [DASHBOARD] Members response status:', membersRes.status);
      if (membersRes.ok) {
        const membersData = await membersRes.json();
        console.log('🔍 [DASHBOARD] Members data:', membersData);
        console.log('🔍 [DASHBOARD] Members count:', Array.isArray(membersData) ? membersData.length : 0);
        setTotalMembers(Array.isArray(membersData) ? membersData.length : 0);
      } else {
        console.error('❌ [DASHBOARD] Failed to fetch members:', membersRes.status);
      }

      // Fetch total articles
      console.log('🔍 [DASHBOARD] Fetching articles from /api/articles');
      const articlesRes = await fetch(`${API_BASE}/api/articles`);
      console.log('🔍 [DASHBOARD] Articles response status:', articlesRes.status);
      if (articlesRes.ok) {
        const articlesData = await articlesRes.json();
        console.log('🔍 [DASHBOARD] Articles data:', articlesData);
        console.log('🔍 [DASHBOARD] Articles count:', Array.isArray(articlesData) ? articlesData.length : 0);
        setTotalArticles(Array.isArray(articlesData) ? articlesData.length : 0);
      } else {
        console.error('❌ [DASHBOARD] Failed to fetch articles:', articlesRes.status);
      }

      // Fetch all activities
      console.log('🔍 [DASHBOARD] Fetching activities from /api/activities');
      const activitiesRes = await fetch(`${API_BASE}/api/activities`);
      console.log('🔍 [DASHBOARD] Activities response status:', activitiesRes.status);
      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        console.log('🔍 [DASHBOARD] Activities data:', activitiesData);
        console.log('🔍 [DASHBOARD] Activities count:', Array.isArray(activitiesData) ? activitiesData.length : 0);
        setTotalActivities(Array.isArray(activitiesData) ? activitiesData.length : 0);
        setActivities(Array.isArray(activitiesData) ? activitiesData.slice(0, 5) : []);
      } else {
        console.error('❌ [DASHBOARD] Failed to fetch activities:', activitiesRes.status);
      }

      // Fetch pending member registrations
      console.log('🔍 [DASHBOARD] Fetching member registrations from /api/member-registrations');
      const regRes = await fetch(`${API_BASE}/api/member-registrations`);
      console.log('🔍 [DASHBOARD] Member registrations response status:', regRes.status);
      if (regRes.ok) {
        const registrations = await regRes.json();
        console.log('🔍 [DASHBOARD] Member registrations data:', registrations);
        console.log('🔍 [DASHBOARD] Pending registrations count:', Array.isArray(registrations) ? registrations.filter((r: any) => r.status === 'pending').length : 0);
        
        // Get pending registrations with activity details
        const pendingRegs = Array.isArray(registrations) 
          ? registrations.filter((r: any) => r.status === 'pending').slice(0, 10)
          : [];
        setPendingRegistrations(pendingRegs);
      } else {
        console.error('❌ [DASHBOARD] Failed to fetch member registrations:', regRes.status);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('🔄 [DASHBOARD] Auto-refreshing data...');
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
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
      label: 'Total Kegiatan',
      value: totalActivities,
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
              <p className="text-gray-600">Selamat datang di panel administrasi IPNU IPPNU Batursari</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Memuat...' : 'Refresh'}
            </button>
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
                ) : activities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>Belum ada kegiatan</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
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
