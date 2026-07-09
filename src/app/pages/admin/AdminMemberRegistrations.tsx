import { DashboardSidebar } from '../../components/DashboardSidebar';
import { UserPlus, Check, X, Eye, Users, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MemberRegistrationData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: string;
  address: string;
  organization: 'IPNU' | 'IPPNU';
  education: string;
  school: string;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

interface CreatedAccount {
  id: string;
  registration_id: string;
  full_name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  created_at: string;
}

export function AdminMemberRegistrations() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRegistration, setSelectedRegistration] = useState<MemberRegistrationData | null>(null);
  const [registrations, setRegistrations] = useState<MemberRegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'registrations' | 'accounts'>('registrations');
  const [createdAccounts, setCreatedAccounts] = useState<CreatedAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState<{ email: string; password: string; fullName: string } | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const apiBase = import.meta.env.VITE_API_BASE ?? '';

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBase}/api/member-registrations`, {
        signal: AbortSignal.timeout(8000)
      });
      if (!response.ok) {
        const errBody = await response.text();
        console.error('❌ Backend returned error:', response.status, errBody);
        throw new Error(`Gagal memuat data dari server (${response.status}): ${errBody}`);
      }

      const data = await response.json();
      console.log('✅ Registrations loaded:', data.length, 'items');
      setRegistrations(data);
    } catch (err) {
      console.error('❌ Failed to fetch registrations:', err);
      if (err instanceof DOMException && err.name === 'TimeoutError') {
        setError('⏱️ Timeout: Backend tidak merespon dalam 8 detik. Pastikan server backend berjalan di port 4000.');
      } else {
        setError(`Backend tidak tersedia. Detail: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreatedAccounts = async () => {
    setAccountsLoading(true);
    try {
      const response = await fetch(`${apiBase}/api/created-accounts`, {
        signal: AbortSignal.timeout(8000)
      });
      if (!response.ok) {
        const errBody = await response.text();
        console.error('❌ Failed to fetch created accounts:', response.status, errBody);
        throw new Error(`Gagal memuat akun dari server (${response.status}): ${errBody}`);
      }
      const data = await response.json();
      console.log('✅ Created accounts loaded:', data.length, 'items');
      setCreatedAccounts(data);
    } catch (err) {
      console.error('❌ Failed to fetch created accounts:', err);
      setCreatedAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchCreatedAccounts();
  }, []);

  const handleApprove = async (id: string) => {
  const registration = registrations.find((item) => item.id === id);
  if (!registration) return;

  const password = 'ipnuippnu123';
  const role = 'user';

  setApprovingId(id);

  try {
    const response = await fetch(`${apiBase}/api/created-accounts/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registration_id: id, password, role }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Gagal menyetujui pendaftaran.');
    }

    const result = await response.json();

    setPasswordDialog({
      email: result.email,
      password: result.password,
      fullName: result.full_name,
    });

    await fetchRegistrations();
    await fetchCreatedAccounts();
  } catch (err: any) {
    console.error('Error approving registration:', err);
    alert(`Error: ${err.message}`);
  } finally {
    setApprovingId(null);
  }
};
  const handleReject = async (id: string) => {
    const reason = prompt('Alasan penolakan:');
    if (!reason) return;

    try {
      const response = await fetch(`${apiBase}/api/member-registrations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      await fetchRegistrations();
      alert(`Pendaftaran ditolak. Alasan: ${reason}`);
    } catch (err: any) {
      console.error('Error rejecting registration:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleResetPassword = async (email: string) => {
    const newPasswordInput = prompt('Masukkan password baru (kosongkan untuk generate otomatis):');
    if (newPasswordInput === null) return;

    let newPassword: string;
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    if (newPasswordInput.trim() === '') {
      newPassword = '';
      for (let i = 0; i < 8; i++) {
        newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } else if (newPasswordInput.trim().length < 6) {
      alert('Password minimal 6 karakter. Menggunakan password otomatis.');
      newPassword = '';
      for (let i = 0; i < 8; i++) {
        newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } else {
      newPassword = newPasswordInput.trim();
    }

    try {
      const response = await fetch(`${apiBase}/api/created-accounts/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPassword }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Gagal mereset password.');
      }

      setPasswordDialog({ email, password: newPassword, fullName: email });
      alert(`Password untuk ${email} telah direset! Password baru akan ditampilkan.`);
    } catch (err: any) {
      console.error('Error resetting password:', err);
      alert(`Error: ${err.message}`);
    }
  };const handleResetPassword = async (email: string, fullName: string) => {
  const newPassword = 'ipnuippnu123';

  try {
    const response = await fetch(`${apiBase}/api/created-accounts/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: newPassword }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Gagal mereset password.');
    }

    setPasswordDialog({ email, password: newPassword, fullName });
  } catch (err: any) {
    console.error('Error resetting password:', err);
    alert(`Error: ${err.message}`);
  }
};

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Tersalin ke clipboard!');
  };

  const filteredRegistrations =
    filter === 'all'
      ? registrations
      : registrations.filter((item) => item.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pendaftaran Anggota Baru</h1>
            <p className="text-gray-600">Kelola pendaftaran anggota baru IPNU & IPPNU</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'registrations'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText size={18} />
              Pendaftaran
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'accounts'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users size={18} />
              Akun yang Sudah Dibuat ({createdAccounts.length})
            </button>
          </div>

          {error && activeTab === 'registrations' && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
              <p className="mt-2 text-xs text-red-500">
                Pastikan MySQL/XAMPP berjalan dan server backend sudah di-start (npm run server).
              </p>
            </div>
          )}

          {activeTab === 'registrations' ? (
            <>
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === 'all'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Semua ({registrations.length})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Pending ({registrations.filter((item) => item.status === 'pending').length})
                </button>
                <button
                  onClick={() => setFilter('approved')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === 'approved'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Disetujui ({registrations.filter((item) => item.status === 'approved').length})
                </button>
                <button
                  onClick={() => setFilter('rejected')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Ditolak ({registrations.filter((item) => item.status === 'rejected').length})
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organisasi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontak</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendidikan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Daftar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            Memuat data pendaftaran...
                          </td>
                        </tr>
                      ) : filteredRegistrations.length > 0 ? (
                        filteredRegistrations.map((registration) => (
                          <tr key={registration.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{registration.full_name}</div>
                              <div className="text-xs text-gray-500">{registration.gender}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                registration.organization === 'IPNU'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {registration.organization}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{registration.email}</div>
                              <div className="text-xs text-gray-500">{registration.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{registration.education}</div>
                              <div className="text-xs text-gray-500">{registration.school}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(registration.submitted_at).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                registration.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : registration.status === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {registration.status === 'pending'
                                  ? 'Pending'
                                  : registration.status === 'approved'
                                  ? 'Disetujui'
                                  : 'Ditolak'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setSelectedRegistration(registration)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Lihat Detail"
                                >
                                  <Eye size={16} />
                                </button>
                                {registration.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(registration.id)}
                                      disabled={approvingId === registration.id}
                                      className={`p-2 rounded ${
                                        approvingId === registration.id
                                          ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                          : 'text-green-600 hover:bg-green-50'
                                      }`}
                                      title="Setujui"
                                    >
                                      <Check size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleReject(registration.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                                      title="Tolak"
                                    >
                                      <X size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            Tidak ada pendaftaran untuk filter ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {!loading && filteredRegistrations.length === 0 && registrations.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center mt-6">
                  <UserPlus size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Belum ada pendaftaran anggota.</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Akun Anggota yang Sudah Dibuat</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Daftar akun yang berhasil dibuat saat admin menyetujui pendaftaran.
                  Password hanya ditampilkan satu kali saat pembuatan. Gunakan "Reset Password" jika anggota lupa password.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Lengkap</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telepon</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Dibuat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accountsLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          Memuat data akun...
                        </td>
                      </tr>
                    ) : createdAccounts.length > 0 ? (
                      createdAccounts.map((account) => (
                        <tr key={account.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {account.full_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {account.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {account.phone || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              account.role === 'admin'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {account.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {account.created_at
                              ? new Date(account.created_at).toLocaleDateString('id-ID')
                              : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    `Email: ${account.email}`
                                  )
                                }
                                className="text-xs px-3 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 flex items-center gap-1"
                              >
                                Salin Email
                              </button>
                              <button
                               onClick={() => handleResetPassword(account.email, account.full_name)}
                                className="text-xs px-3 py-2 bg-orange-50 text-orange-700 rounded hover:bg-orange-100 flex items-center gap-1"
                              >
                                Reset Password
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <Users size={48} className="text-gray-300 mx-auto mb-4" />
                          <p>Belum ada akun yang dibuat.</p>
                          <p className="text-sm mt-1">
                            Akun akan muncul di sini setelah admin menyetujui pendaftaran anggota.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Password Dialog */}
      {passwordDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-green-700">Akun Berhasil Dibuat!</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                <p className="mb-2">
                  Kredensial akun untuk <strong>{passwordDialog.fullName}</strong>:
                </p>
                <div className="bg-white rounded p-3 border border-green-200 space-y-1">
                  <p><strong>Email:</strong> {passwordDialog.email}</p>
                  <p>
                    <strong>Password:</strong>{' '}
                    <code className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono">
                      {passwordDialog.password}
                    </code>
                  </p>
                </div>
                <p className="mt-2 text-xs text-green-600">
                  Password ini hanya ditampilkan sekali. Salin dan kirimkan ke anggota via WhatsApp atau email.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(`Email: ${passwordDialog.email}\nPassword: ${passwordDialog.password}`)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Salin Kredensial
                </button>
                <button
                  onClick={() => setPasswordDialog(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Detail Pendaftaran</h2>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                  <p className="text-gray-900">{selectedRegistration.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Jenis Kelamin</label>
                  <p className="text-gray-900">{selectedRegistration.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedRegistration.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Telepon</label>
                  <p className="text-gray-900">{selectedRegistration.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tanggal Lahir</label>
                  <p className="text-gray-900">
                    {new Date(selectedRegistration.birth_date).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Organisasi</label>
                  <p className="text-gray-900">{selectedRegistration.organization}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Pendidikan</label>
                  <p className="text-gray-900">{selectedRegistration.education}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Sekolah/Universitas</label>
                  <p className="text-gray-900">{selectedRegistration.school}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Alamat</label>
                  <p className="text-gray-900">{selectedRegistration.address}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Motivasi</label>
                  <p className="text-gray-900">{selectedRegistration.motivation}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Tanggal Submit</label>
                  <p className="text-gray-900">
                    {new Date(selectedRegistration.submitted_at).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
            {selectedRegistration.status === 'pending' && (
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    handleApprove(selectedRegistration.id);
                    setSelectedRegistration(null);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Setujui Pendaftaran
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedRegistration.id);
                    setSelectedRegistration(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Tolak Pendaftaran
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}