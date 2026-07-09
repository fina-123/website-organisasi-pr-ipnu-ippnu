import { useEffect, useState } from 'react';
import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { Image, Calendar, Filter } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface Dokumentasi {
  id: number;
  judul: string;
  kategori: 'Kegiatan' | 'Sosial' | 'Organisasi' | 'Lainnya';
  foto_url: string;
  deskripsi?: string;
  tanggal: string;
  created_at: string;
}

export function Documentation() {
  const [dokumentasiList, setDokumentasiList] = useState<Dokumentasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchDokumentasi = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? `${API_BASE}/api/dokumentasi`
        : `${API_BASE}/api/dokumentasi?kategori=${selectedCategory}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Gagal memuat data');
      const data = await res.json();
      setDokumentasiList(data);
    } catch (error) {
      console.error('Failed to fetch dokumentasi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDokumentasi();
  }, [selectedCategory]);

  const categories = ['all', 'Kegiatan', 'Sosial', 'Organisasi', 'Lainnya'];

  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case 'Kegiatan':
        return 'bg-blue-100 text-blue-700';
      case 'Sosial':
        return 'bg-green-100 text-green-700';
      case 'Organisasi':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

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
          {/* Filter */}
          <div className="mb-8 flex items-center gap-4">
            <Filter size={20} className="text-gray-600" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'Semua' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat data dokumentasi...</p>
            </div>
          ) : dokumentasiList.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <Image size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada dokumentasi untuk kategori ini.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dokumentasiList.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={item.foto_url}
                      alt={item.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className={`inline-block px-2 py-1 text-xs rounded mb-2 ${getCategoryColor(item.kategori)}`}>
                      {item.kategori}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{item.judul}</h3>
                    {item.deskripsi && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.deskripsi}</p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>{new Date(item.tanggal).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
