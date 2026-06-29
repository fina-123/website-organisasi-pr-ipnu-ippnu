import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { organizationInfo } from '../data/mockData';
import { LogoIPNU } from '../components/LogoIPNU';
import { LogoIPPNU } from '../components/LogoIPPNU';
import { LogoPair } from '../components/LogoPair';

export function Profile() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Profil Organisasi</h1>
          <p className="text-lg text-green-50">Mengenal IPNU dan IPPNU lebih dekat</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* IPNU */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <LogoIPNU size={80} />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{organizationInfo.ipnu.name}</h2>
                <p className="text-gray-600">Didirikan: {organizationInfo.ipnu.established}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {organizationInfo.ipnu.description}
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Tentang IPNU</h3>
              <p className="text-gray-700 leading-relaxed">
                IPNU merupakan organisasi pelajar yang berkhidmat dalam membina generasi muda Islam
                Indonesia dengan nilai-nilai Ahlussunnah Wal Jamaah. Organisasi ini fokus pada
                pengembangan keilmuan, kepemimpinan, dan karakter Islami yang moderat.
              </p>
            </div>
          </div>

          {/* IPPNU */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <LogoIPPNU size={80} />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{organizationInfo.ippnu.name}</h2>
                <p className="text-gray-600">Didirikan: {organizationInfo.ippnu.established}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {organizationInfo.ippnu.description}
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Tentang IPPNU</h3>
              <p className="text-gray-700 leading-relaxed">
                IPPNU hadir sebagai wadah pemberdayaan pelajar putri dengan mengedepankan
                kesetaraan gender dalam pendidikan dan pengembangan diri. Organisasi ini berkomitmen
                untuk melahirkan generasi pelajar putri yang berprestasi dan berakhlak mulia.
              </p>
            </div>
          </div>

          {/* Ranting Batursari */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">IPNU IPPNU Ranting Batursari</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Alamat</h3>
                <p className="text-gray-700 font-medium">{organizationInfo.ranting.address}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Kontak</h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Email:</span> {organizationInfo.ranting.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Telepon:</span> {organizationInfo.ranting.phone}
                </p>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="font-bold text-gray-900 mb-3">Tentang Ranting Batursari</h3>
              <p className="text-gray-700 leading-relaxed">
                IPNU IPPNU Ranting Batursari merupakan organisasi tingkat desa yang aktif dalam
                berbagai kegiatan sosial, pendidikan, dan keagamaan. Dengan anggota yang terus
                bertambah, ranting Batursari berkomitmen untuk menjadi wadah pengembangan potensi
                pelajar di Desa Batursari dan sekitarnya.
              </p>
            </div>
          </div>

          {/* Logo Resmi Section */}
          <div className="mt-16 mb-16">
            <div className="bg-white border border-gray-200 rounded-lg p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Logo Resmi IPNU & IPPNU</h3>
              <div className="flex items-center justify-center">
                <LogoPair ipnuSize={100} ippnuSize={100} gap={32} />
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Pendidikan</h3>
              <p className="text-sm text-gray-600">
                Mengutamakan pengembangan keilmuan dan intelektual anggota
              </p>
            </div>
            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Kebersamaan</h3>
              <p className="text-sm text-gray-600">
                Membangun solidaritas dan kekeluargaan antar anggota
              </p>
            </div>
            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🕌</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Keagamaan</h3>
              <p className="text-sm text-gray-600">
                Menanamkan nilai-nilai Islam Ahlussunnah Wal Jamaah
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
