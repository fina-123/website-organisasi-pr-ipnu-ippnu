import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { visionMission } from '../data/mockData';
import { Target, CheckCircle } from 'lucide-react';

export function VisionMission() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Visi & Misi</h1>
          <p className="text-lg text-green-50">Arah dan tujuan organisasi IPNU IPPNU Batursari</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vision */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target size={24} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Visi</h2>
            </div>
            <div className="bg-green-50 border-l-4 border-green-600 p-8 rounded-r-lg">
              <p className="text-lg text-gray-800 leading-relaxed italic">
                "{visionMission.vision}"
              </p>
            </div>
          </div>

          {/* Mission */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Misi</h2>
            </div>
            <div className="space-y-4">
              {visionMission.mission.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8">
            <h3 className="font-bold text-gray-900 mb-4 text-xl">Komitmen Kami</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Visi dan misi ini menjadi pedoman dalam setiap kegiatan dan program kerja IPNU IPPNU
              Ranting Batursari. Kami berkomitmen untuk terus berkontribusi dalam:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Pembinaan karakter pelajar yang berakhlakul karimah</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Peningkatan kualitas pendidikan dan keilmuan</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Pengembangan kepemimpinan generasi muda</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Pemberdayaan masyarakat melalui berbagai program sosial</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
