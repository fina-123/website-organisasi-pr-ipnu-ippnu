import { DashboardSidebar } from '../../components/DashboardSidebar';
import { UserCircle, Mail, Phone, Calendar, Save, Camera, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  foto_url?: string;
  organization: string;
  role: string;
  created_at: string;
}

export function UserProfile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/user/profile?userId=${user.id}`);

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
        });
      } else {
        const errorData = await res.json();
        console.error('Profile API error:', errorData);
        toast.error('Gagal memuat data profil');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Gagal memuat data profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal memperbarui profil');
      }

      const updated = await res.json();
      setProfile(updated);
      toast.success('Profil berhasil diperbarui!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format file tidak didukung. Hanya JPG, JPEG, dan PNG yang diizinkan.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('userId', user.id);

      const res = await fetch(`${API_BASE}/api/user/profile/photo`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal mengunggah foto');
      }

      const updated = await res.json();
      setProfile(updated);
      toast.success('Foto profil berhasil diperbarui!');
    } catch (error) {
      console.error('Failed to upload photo:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal mengunggah foto profil');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const photoUrl = profile?.foto_url
    ? `${API_BASE}${profile.foto_url}`
    : null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="user" />

      <main className="flex-1 p-8 lg:ml-0">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
            <p className="text-gray-600">Kelola informasi profil Anda</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Memuat data...</p>
              </div>
            ) : (
              <div className="flex items-center gap-6 mb-8">
                <div className="relative w-24 h-24">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Foto Profil"
                      className="w-24 h-24 rounded-full object-cover border-2 border-green-200"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                      <UserCircle size={64} className="text-green-600" />
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                      <Loader2 size={28} className="text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile?.full_name || 'Anggota'}</h2>
                  <p className="text-gray-600">Anggota {profile?.organization || 'IPNU'}</p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="mt-2 text-sm text-green-700 hover:text-green-800 disabled:text-gray-400 flex items-center gap-1"
                  >
                    <Camera size={16} />
                    {uploading ? 'Mengunggah...' : 'Ubah Foto Profil'}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <UserCircle size={20} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <Mail size={20} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Phone size={20} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Bergabung
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID') : '-'}
                      disabled
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <Calendar size={20} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={20} />
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  type="button"
                  onClick={() => fetchProfile()}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2">Informasi</h3>
            <p className="text-sm text-gray-700">
              Pastikan data profil Anda selalu up-to-date agar memudahkan komunikasi dan administrasi organisasi.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

