import { useEffect, useState } from 'react';
import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { Newspaper, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

interface Article {
  id: number;
  judul: string;
  slug: string;
  konten: string;
  ringkasan?: string;
  kategori: 'Organisasi' | 'Kegiatan' | 'Berita' | 'Pengumuman';
  thumbnail_url?: string;
  penulis: string;
  status: 'draft' | 'published';
  tanggal_publish: string;
}

export function News() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/articles?status=published`);
        if (!res.ok) throw new Error('Gagal memuat data');
        const data = await res.json();
        setArticles(data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const categories = ['Semua', 'Organisasi', 'Kegiatan', 'Berita', 'Pengumuman'];

  const filteredNews =
    selectedCategory === 'Semua'
      ? articles
      : articles.filter((article) => article.kategori === selectedCategory);

  const getCategoryBadge = (kategori: string) => {
    const colors = {
      'Organisasi': 'bg-blue-100 text-blue-700',
      'Kegiatan': 'bg-green-100 text-green-700',
      'Berita': 'bg-purple-100 text-purple-700',
      'Pengumuman': 'bg-orange-100 text-orange-700',
    };
    return colors[kategori as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Berita & Kegiatan</h1>
          <p className="text-lg text-green-50">Informasi terbaru seputar IPNU IPPNU Batursari</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* News Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat berita...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada berita dalam kategori ini</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((article) => (
                <Link
                  key={article.id}
                  to={`/berita/${article.slug}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    {article.thumbnail_url ? (
                      <img src={article.thumbnail_url} alt={article.judul} className="w-full h-full object-cover" />
                    ) : (
                      <Newspaper size={48} className="text-gray-400" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 text-xs rounded-full ${getCategoryBadge(article.kategori)}`}>
                        {article.kategori}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(article.tanggal_publish).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{article.judul}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.ringkasan || article.konten.substring(0, 150)}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{article.penulis}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(article.tanggal_publish).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-green-700 font-medium">
                      Baca selengkapnya →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}