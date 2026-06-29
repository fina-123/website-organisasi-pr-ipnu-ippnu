import { useEffect, useState } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Calendar, Award, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface Activity {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  description: string;
  status: string;
}

interface Registration {
  id: string;
  user_id: string;
  activity_id: string;
  status: string;
  registered_date: string;
}

export function UserHistory() {
  const { user } = useAuth();
  const [completedActivities, setCompletedActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/my-registrations?userId=${user.id}`);
      if (res.ok) {
        const registrations: Registration[] = await res.json();
        
        // Filter approved registrations
        const approvedRegs = registrations.filter((r) => r.status === 'approved');
        
        // Get activity details for each approved registration
        const activities: Activity[] = [];
        for (const reg of approvedRegs) {
          const actRes = await fetch(`${API_BASE}/api/activities/${reg.activity_id}`);
          if (actRes.ok) {
            const activity: Activity = await actRes.json();
            // Only include completed activities
            if (activity.status === 'completed') {
              activities.push(activity);
            }
          }
        }
        
        setCompletedActivities(activities);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('Gagal memuat riwayat kegiatan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.id]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="user" />

      <main className="flex-1 p-8 lg:ml-0">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Kegiatan</h1>
            <p className="text-gray-600">Kegiatan yang telah Anda ikuti</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar size={24} className="text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{completedActivities.length}</div>
                  <div className="text-sm text-gray-600">Kegiatan Selesai</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Award size={24} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{completedActivities.length}</div>
                  <div className="text-sm text-gray-600">Sertifikat Diperoleh</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {completedActivities.length > 0 ? '100%' : '0%'}
                  </div>
                  <div className="text-sm text-gray-600">Tingkat Kehadiran</div>
                </div>
              </div>
            </div>
          </div>

          {/* History List */}
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : completedActivities.length > 0 ? (
            <div className="space-y-4">
              {completedActivities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar size={24} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{activity.title}</h3>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            Selesai
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{new Date(activity.date).toLocaleDateString('id-ID')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span>{activity.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Award size={16} className="text-green-600" />
                            <span className="text-green-700">Sertifikat tersedia</span>
                          </div>
                          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 text-sm">
                            <Download size={16} />
                            Unduh Sertifikat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Calendar size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Belum Ada Riwayat</h3>
              <p className="text-gray-600 mb-6">
                Anda belum menyelesaikan kegiatan apapun. Daftar dan ikuti kegiatan untuk membangun riwayat Anda!
              </p>
              <a
                href="/user/activities"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Lihat Kegiatan
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
