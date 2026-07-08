import { useEffect } from 'react';
import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { CheckCircle, Home, ClipboardList } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function RegistrationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const namaPendaftar = location.state?.nama || 'Pendaftar';

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Success Section */}
      <section className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12 text-center shadow-sm">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={64} className="text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pendaftaran Berhasil Dikirim!
            </h1>

            <p className="text-lg text-gray-600 mb-2">
              Terima kasih, <span className="font-semibold text-green-700">{namaPendaftar}</span>!
            </p>
            <p className="text-gray-600 mb-8">
              Data pendaftaran Anda telah kami terima.
            </p>

            {/* Next Steps */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                <ClipboardList size={20} />
                Langkah Selanjutnya:
              </h3>
              <ol className="space-y-3 text-sm text-green-800">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span className="pt-0.5">
                    Admin akan memverifikasi data Anda dalam <strong>1-3 hari kerja</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span className="pt-0.5">
                    Anda akan dihubungi melalui <strong>email/telepon</strong> yang didaftarkan
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span className="pt-0.5">
                    Setelah disetujui, <strong>akun login</strong> akan dikirimkan ke email Anda
                  </span>
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Home size={20} />
                Kembali ke Beranda
              </button>
              <button
                onClick={() => navigate('/cek-status')}
                className="px-6 py-3 bg-white border-2 border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <ClipboardList size={20} />
                Lihat Status Pendaftaran
              </button>
            </div>

            {/* Note */}
            <p className="text-xs text-gray-500 mt-6">
              * Login ke akun akan tersedia setelah admin menyetujui pendaftaran Anda
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}