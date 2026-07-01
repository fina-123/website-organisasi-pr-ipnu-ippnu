import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Users, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  foto_url?: string;
  organization: string;
  address?: string;
  created_at: string;
}

export function UserMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOrg, setFilterOrg] = useState<'ALL' | 'IPNU' | 'IPPNU'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesOrg = filterOrg === 'ALL' || member.organization === filterOrg;
    const matchesSearch = member.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOrg && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="user" />

      <main className="flex-1 p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Anggota</h1>
            <p className="text-gray-600">Direktori anggota IPNU & IPPNU Batursari</p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari nama anggota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterOrg('ALL')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filterOrg === 'ALL'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterOrg('IPNU')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filterOrg === 'IPNU'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                IPNU
              </button>
              <button
                onClick={() => setFilterOrg('IPPNU')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filterOrg === 'IPPNU'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                IPPNU
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Loader2 size={48} className="text-gray-300 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Memuat data anggota...</p>
            </div>
          ) : (
            <>
              {/* Members Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${
                        member.organization === 'IPNU' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        <Users size={32} className={member.organization === 'IPNU' ? 'text-green-600' : 'text-purple-600'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 break-words">{member.full_name}</h3>
                        <p className="text-sm text-gray-600">Anggota</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                          member.organization === 'IPNU'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {member.organization}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <span>📧</span>
                        <span className="truncate">{member.email}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span>📱</span>
                        <span>{member.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span>📍</span>
                        <span className="truncate">{member.address || '-'}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredMembers.length === 0 && !loading && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Users size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Tidak ada anggota ditemukan</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
