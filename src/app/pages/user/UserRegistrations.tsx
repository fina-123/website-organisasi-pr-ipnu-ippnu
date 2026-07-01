import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { ClipboardList, Calendar, X } from 'lucide-react';
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

export function UserRegistrations() {
  const { user } = useAuth();
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/my-registrations?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setMyRegistrations(data);
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
      toast.error('Gagal memuat data pendaftaran');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [user?.id]);

  const handleCancel = async (id: string) => {
    if (!confirm('Batalkan pendaftaran ini?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/activity-registrations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!res.ok) {
        throw new Error('Gagal membatalkan pendaftaran');
      }

      toast.success('Pendaftaran berhasil dibatalkan');
      fetchRegistrations();
    } catch (error) {
      console.error('Failed to cancel registration:', error);
      toast.error('Gagal membatalkan pendaftaran');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="user" />

      <main className="flex-1 p-8 lg:ml-0">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pendaftaran Saya</h1>
            <p className="text-gray-600">Status pendaftaran kegiatan yang telah Anda daftarkan</p>
          </div>

          {/* Registrations List */}
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : myRegistrations.length > 0 ? (
            <div className="space-y-4">
              {myRegistrations.map((registration) => (
                <div key={registration.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        registration.status === 'approved' ? 'bg-green-100' :
                        registration.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        <ClipboardList size={24} className={
                          registration.status === 'approved' ? 'text-green-600' :
                          registration.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                        } />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{registration.title || 'Kegiatan'}</h3>
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            registration.status === 'approved' ? 'bg-green-100 text-green-700' :
                            registration.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {registration.status === 'approved' ? 'Disetujui' :
                             registration.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{registration.type || 'Kegiatan'}</p>
                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>Kegiatan: {registration.date ? new Date(registration.date).toLocaleDateString('id-ID') : 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ClipboardList size={16} />
                            <span>Terdaftar: {new Date(registration.registered_date).toLocaleDateString('id-ID')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span>{registration.location || 'N/A'}</span>
                          </div>
                        </div>

                        {registration.status === 'approved' && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                              ✓ Pendaftaran Anda telah disetujui. Harap hadir tepat waktu pada hari kegiatan.
                            </p>
                          </div>
                        )}
                        {registration.status === 'pending' && (
                          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              ⏳ Pendaftaran Anda sedang diproses oleh admin. Mohon ditunggu.
                            </p>
                          </div>
                        )}
                        {registration.status === 'rejected' && (
                          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                              ✗ Mohon maaf, pendaftaran Anda ditolak. Silakan hubungi admin untuk informasi lebih lanjut.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {registration.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(registration.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded ml-4"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <ClipboardList size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Belum Ada Pendaftaran</h3>
              <p className="text-gray-600 mb-6">
                Anda belum mendaftar kegiatan apapun. Lihat kegiatan yang tersedia dan daftar sekarang!
              </p>
              <Link
                to="/user/activities"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 no-underline"
              >
                Lihat Kegiatan
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
