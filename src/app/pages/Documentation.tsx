import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { Image, Calendar } from 'lucide-react';

const mockGallery = [
  {
    id: '1',
    title: 'MAKESTA 2025',
    date: '2025-05-20',
    category: 'Kegiatan',
  },
  {
    id: '2',
    title: 'Bakti Sosial Ramadhan',
    date: '2026-03-25',
    category: 'Sosial',
  },
  {
    id: '3',
    title: 'Pelantikan Pengurus 2026',
    date: '2026-02-03',
    category: 'Organisasi',
  },
  {
    id: '4',
    title: 'LAKMUD Regional',
    date: '2025-11-15',
    category: 'Kegiatan',
  },
  {
    id: '5',
    title: 'Pelatihan Public Speaking',
    date: '2026-04-10',
    category: 'Pelatihan',
  },
  {
    id: '6',
    title: 'Kajian Rutin Jumat',
    date: '2026-04-05',
    category: 'Keagamaan',
  },
];

export function Documentation() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Dokumentasi</h1>
          <p className="text-lg text-green-50">Galeri foto kegiatan IPNU IPPNU Batursari</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Gallery Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockGallery.map((item) => (
              <div
                key={item.id}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="bg-gradient-to-br from-green-100 to-blue-100 h-48 flex items-center justify-center relative overflow-hidden">
                  <Image size={48} className="text-green-600 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
                </div>
                <div className="p-4">
                  <div className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded mb-2">
                    {item.category}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8 border border-gray-200 text-center">
            <Image size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Dokumentasi Kegiatan</h3>
            <p className="text-gray-600">
              Setiap kegiatan IPNU IPPNU Batursari didokumentasikan dengan baik sebagai arsip dan
              kenangan berharga bagi seluruh anggota.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
