import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { Newspaper, Calendar, User, ArrowLeft } from 'lucide-react';

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

export function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      try {
        const res = await fetch(`${API_BASE}/api/articles/slug/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Artikel tidak ditemukan');
          } else {
            throw new Error('Gagal memuat data');
          }
          return;
        }
        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.error('Failed to fetch article:', error);
        setError('Gagal memuat artikel');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const getCategoryBadge = (kategori: string) => {
    const colors = {
      'Organisasi': 'bg-blue-100 text-blue-700',
      'Kegiatan': 'bg-green-100 text-green-700',
      'Berita': 'bg-purple-100 text-purple-700',
      'Pengumuman': 'bg-orange-100 text-orange-700',
    };
    return colors[kategori as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Memuat artikel...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Newspaper size={64} className="text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Artikel Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-6">{error || 'Artikel yang Anda cari tidak tersedia.'}</p>
            <Link
              to="/berita"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <ArrowLeft size={20} />
              Kembali ke Berita
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero with thumbnail */}
      {article.thumbnail_url && (
        <div className="bg-gray-200 h-64 md:h-96 flex items-center justify-center">
          <img
            src={article.thumbnail_url}
            alt={article.judul}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <section className={`py-16 bg-white flex-1 ${article.thumbnail_url ? 'pt-8' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 mb-6"
          >
            <ArrowLeft size={20} />
            Kembali ke Berita
          </Link>

          {/* Article header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-xs rounded-full ${getCategoryBadge(article.kategori)}`}>
                {article.kategori}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(article.tanggal_publish).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.judul}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{article.penulis}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(article.tanggal_publish).toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Article content */}
          <div className="prose prose-lg max-w-none">
            {article.ringkasan && (
              <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-8 rounded">
                <p className="text-gray-700 italic">{article.ringkasan}</p>
              </div>
            )}
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {article.konten}
            </div>
          </div>

          {/* Share or additional info could go here */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              to="/berita"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <ArrowLeft size={20} />
              Kembali ke Semua Berita
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}