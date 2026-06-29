import { useEffect, useState } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { ClipboardList, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface Registration {
  id: string;
  user_id: string;
  activity_id: string;
  status: 'pending' | 'approved' | 'rejected';
  registered_date: string;
  created_at: string;
  activity_title: string;
  activity_type: string;
  activity_date: string;
  user_name: string;
  user_email: string;
  user_phone: string;
}

interface Stats {
  total_registrations: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
}

export function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);

      const res = await fetch(`${API_BASE}/api/activity-registrations?${params}`);
      if (!res.ok) throw new Error('Gagal memuat data pendaftaran');
      const data = await res.json();
      setRegistrations(data);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
      toast.error('Gagal memuat data pendaftaran');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/activity-registrations/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchStats();
  }, [filter]);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setUpdatingId(id);

    try {
      const res = await fetch(`${API_BASE}/api/activity-registrations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal memperbarui status');
      }

      toast.success(`Pendaftaran berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
      
      // Refresh data
      fetchRegistrations();
      fetchStats();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pendaftaran Kegiatan</h1>
            <p className="text-gray-600">Kelola pendaftaran kegiatan IPNU IPPNU</p>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Semua ({stats?.total_registrations || 0})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Pending ({stats?.pending_count || 0})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Disetujui ({stats?.approved_count || 0})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Ditolak ({stats?.rejected_count || 0})
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kegiatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pendaftar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tgl Daftar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Tidak ada pendaftaran
                    </td>
                  </tr>
                ) : (
                  registrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{registration.activity_title}</div>
                        <div className="text-sm text-gray-500">{registration.activity_type}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{registration.user_name}</div>
                        <div className="text-xs text-gray-500">{registration.user_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(registration.registered_date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(registration.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {registration.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(registration.id, 'approved')}
                              disabled={updatingId === registration.id}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              <Check size={14} />
                              {updatingId === registration.id ? 'Menyimpan...' : 'Setujui'}
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(registration.id, 'rejected')}
                              disabled={updatingId === registration.id}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              <X size={14} />
                              {updatingId === registration.id ? 'Menyimpan...' : 'Tolak'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
