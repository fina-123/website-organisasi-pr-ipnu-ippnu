import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { UserPlus, User, Mail, Phone, MapPin, Calendar, FileText, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  address: string;
  organization: string;
  education: string;
  school: string;
  motivation: string;
  agreeTerms: boolean;
}

export function MemberRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    address: '',
    organization: '',
    education: '',
    school: '',
    motivation: '',
    agreeTerms: false,
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveToLocalStorage = (data: any) => {
    try {
      const registrations = JSON.parse(localStorage.getItem('member_registrations') || '[]');
      registrations.push({
        ...data,
        id: Date.now().toString(),
        submitted_at: new Date().toISOString(),
      });
      localStorage.setItem('member_registrations', JSON.stringify(registrations));
      return true;
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      return false;
    }
  };

  const apiBase = import.meta.env.VITE_API_BASE ?? '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.agreeTerms) {
      setSubmitError('Anda harus menyetujui syarat dan ketentuan');
      return;
    }

    if (formData.motivation.length < 50) {
      setSubmitError('Motivasi bergabung harus minimal 50 karakter');
      return;
    }

    setIsSubmitting(true);

    const submission = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      birth_date: formData.birthDate,
      gender: formData.gender,
      address: formData.address,
      organization: formData.organization,
      education: formData.education,
      school: formData.school,
      motivation: formData.motivation,
      agree_terms: formData.agreeTerms,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };

    let submitSuccess = false;
    let saveSource = 'server';

    try {
      const response = await fetch(`${apiBase}/api/member-registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        throw new Error(`Gagal menyimpan data ke server (${response.status}).`);
      }

      submitSuccess = true;
    } catch (backendError) {
      console.error('Backend error:', backendError);
      if (saveToLocalStorage(submission)) {
        submitSuccess = true;
        saveSource = 'local storage';
      }
    }

    if (!submitSuccess) {
      setSubmitError('Gagal menyimpan data pendaftaran. Silakan coba lagi.');
      setIsSubmitting(false);
      return;
    }

    // Navigate to success page with user's name
    navigate('/pendaftaran-berhasil', { state: { nama: formData.fullName } });

    setFormData({
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: '',
      address: '',
      organization: '',
      education: '',
      school: '',
      motivation: '',
      agreeTerms: false,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <UserPlus size={40} />
            <h1 className="text-4xl font-bold">Pendaftaran Anggota</h1>
          </div>
          <p className="text-lg text-green-50">
            Bergabunglah bersama IPNU IPPNU Ranting Batursari
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-blue-900 mb-2">Syarat Pendaftaran:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>✓ Pelajar usia 13-25 tahun</li>
              <li>✓ Beragama Islam</li>
              <li>✓ Berdomisili di Desa Batursari atau sekitarnya</li>
              <li>✓ Memiliki komitmen untuk aktif berorganisasi</li>
            </ul>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Formulir Pendaftaran</h2>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900 mb-1">Terjadi Kesalahan</h3>
                  <p className="text-sm text-red-800">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Data Section */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Data Pribadi
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan nama lengkap sesuai KTP/Kartu Pelajar"
                      />
                      <User size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="email@example.com"
                      />
                      <Mail size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon/WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="08xxxxxxxxxx"
                      />
                      <Phone size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <Calendar size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        required
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        placeholder="Jalan, RT/RW, Desa, Kecamatan, Kabupaten"
                      />
                      <MapPin size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Organization Section */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Data Organisasi
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daftar sebagai <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Pilih Organisasi</option>
                      <option value="IPNU">IPNU (Ikatan Pelajar Nahdlatul Ulama)</option>
                      <option value="IPPNU">IPPNU (Ikatan Pelajar Putri Nahdlatul Ulama)</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      IPNU untuk putra, IPPNU untuk putri
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pendidikan Terakhir/Sedang Ditempuh <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Pilih Pendidikan</option>
                      <option value="SMP/MTs">SMP/MTs</option>
                      <option value="SMA/MA">SMA/MA</option>
                      <option value="SMK">SMK</option>
                      <option value="Kuliah">Kuliah/Perguruan Tinggi</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Sekolah/Universitas <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Contoh: SMA Negeri 1 Batursari"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motivasi Bergabung <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        required
                        rows={4}
                        value={formData.motivation}
                        onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        placeholder="Ceritakan mengapa Anda ingin bergabung dengan IPNU/IPPNU..."
                      />
                      <FileText size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Minimal 50 karakter</p>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    Saya menyatakan bahwa data yang saya isi adalah benar dan saya bersedia untuk
                    mengikuti seluruh kegiatan dan peraturan yang ada di IPNU/IPPNU Ranting Batursari.{' '}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg flex items-center gap-2 text-lg font-medium transition-all ${
                    isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Daftar Sekarang
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-bold text-green-900 mb-3">Setelah Mendaftar:</h3>
            <ol className="space-y-2 text-sm text-green-800 list-decimal list-inside">
              <li>Data Anda akan diverifikasi oleh admin dalam 1-3 hari kerja</li>
              <li>Anda akan dihubungi melalui email/WhatsApp untuk konfirmasi</li>
              <li>Setelah disetujui, Anda akan mendapatkan akun untuk login ke dashboard</li>
              <li>Anda dapat mengikuti berbagai kegiatan dan program IPNU/IPPNU</li>
            </ol>
            <p className="mt-4 text-sm text-green-800">
              Sudah pernah mendaftar?{' '}
              <Link to="/cek-status" className="text-green-700 hover:text-green-800 font-medium">
                Cek status pendaftaran Anda di sini →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
