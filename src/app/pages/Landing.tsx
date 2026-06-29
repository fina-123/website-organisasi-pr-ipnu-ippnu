import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { ArrowRight, Users, Calendar, Newspaper, Award, Sparkles, Target, Heart } from 'lucide-react';
import { mockActivities } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LogoIPNU } from '../components/LogoIPNU';
import { LogoIPPNU } from '../components/LogoIPPNU';
import { LogoPair } from '../components/LogoPair';

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

export function Landing() {
  const [recentNews, setRecentNews] = useState<Article[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const upcomingActivities = mockActivities.filter((a) => a.status === 'upcoming').slice(0, 3);

  useEffect(() => {
    const fetchRecentNews = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/articles?status=published&limit=3`);
        if (!res.ok) throw new Error('Gagal memuat berita');
        const data = await res.json();
        setRecentNews(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch recent news:', error);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchRecentNews();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">Organisasi Pelajar NU</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                IPNU IPPNU<br />
                <span className="text-green-200">Ranting Batursari</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-green-50 leading-relaxed">
                Membina dan mengembangkan potensi generasi muda berdasarkan nilai-nilai Ahlussunnah Wal Jamaah
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/profil" variant="secondary" size="lg">
                  Tentang Kami
                </Button>
                <Button href="/daftar-anggota" variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-green-700">
                  Daftar Anggota
                </Button>
              </div>
            </div>

            {/* Logo Section */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-[#1B5E3A] rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <LogoPair
                    ipnuSize={140}
                    ippnuSize={140}
                    gap={24}
                    showLabels={true}
                    darkMode={true}
                    variant="hero"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card hover className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                <Users size={32} className="text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">150+</div>
              <div className="text-sm text-gray-600 font-medium">Anggota Aktif</div>
            </Card>
            <Card hover className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <Calendar size={32} className="text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">24+</div>
              <div className="text-sm text-gray-600 font-medium">Kegiatan/Tahun</div>
            </Card>
            <Card hover className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                <Award size={32} className="text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">10+</div>
              <div className="text-sm text-gray-600 font-medium">Prestasi</div>
            </Card>
            <Card hover className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                <Newspaper size={32} className="text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">50+</div>
              <div className="text-sm text-gray-600 font-medium">Artikel</div>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-6">
                <Target size={16} />
                <span className="text-sm font-semibold">Tentang Kami</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                IPNU IPPNU<br />Ranting Batursari
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                IPNU (Ikatan Pelajar Nahdlatul Ulama) dan IPPNU (Ikatan Pelajar Putri Nahdlatul Ulama)
                adalah organisasi otonom di bawah naungan Nahdlatul Ulama yang fokus pada pembinaan
                pelajar.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Ranting Batursari merupakan salah satu ranting aktif yang terus berkontribusi dalam
                pembangunan masyarakat melalui berbagai kegiatan edukatif, sosial, dan keagamaan.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Heart size={24} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Berbasis Nilai</div>
                    <div className="text-sm text-gray-600">Aswaja An-Nahdliyah</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Inklusif</div>
                    <div className="text-sm text-gray-600">Terbuka untuk semua</div>
                  </div>
                </div>
              </div>
              <Button href="/profil">
                Selengkapnya
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl transform rotate-3"></div>
              <Card className="relative shadow-xl" padding="lg">
                <div className="flex items-center justify-center">
                  <LogoPair ipnuSize={100} ippnuSize={100} gap={32} />
                </div>
                <div className="text-center mt-6">
                  <div className="font-bold text-gray-900 text-lg mb-1">Logo Resmi</div>
                  <p className="text-gray-600">IPNU & IPPNU</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Activities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Kegiatan Mendatang</h2>
              <p className="text-gray-600">Jangan lewatkan kegiatan menarik kami</p>
            </div>
            <Button href="/user/activities" variant="outline">
              Lihat Semua
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingActivities.map((activity) => (
              <Card key={activity.id} hover padding="none" className="overflow-hidden group">
                <div className="bg-gradient-to-br from-green-500 to-green-600 h-48 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all"></div>
                  <Calendar size={64} className="text-white relative z-10 group-hover:scale-110 transition-transform" />
                </div>
                <CardContent className="p-6">
                  <Badge variant="success" size="sm" className="mb-3">
                    {activity.type}
                  </Badge>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-green-700 transition-colors">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{activity.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{new Date(activity.date).toLocaleDateString('id-ID')}</span>
                    <div className="flex items-center gap-1 text-green-700 font-semibold">
                      <Users size={14} />
                      <span>{activity.registered}/{activity.quota}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent News */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Berita Terbaru</h2>
              <p className="text-gray-600">Update informasi dan kegiatan terkini</p>
            </div>
            <Button href="/berita" variant="outline">
              Lihat Semua
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recentNews.map((article) => (
              <Link key={article.id} to={`/berita/${article.slug}`} className="block">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                    <Newspaper size={64} className="text-gray-400 relative z-10 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mb-3">
                      {article.kategori}
                    </span>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-green-700 transition-colors line-clamp-2">
                      {article.judul}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {article.ringkasan || article.konten.substring(0, 150)}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                      <span className="font-medium">{article.penulis}</span>
                      <span>{new Date(article.tanggal_publish).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Sparkles size={16} />
            <span className="text-sm font-semibold">Bergabung Sekarang</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Mari Berkontribusi<br />Bersama Kami
          </h2>
          <p className="text-xl mb-10 text-green-50 max-w-2xl mx-auto leading-relaxed">
            Jadilah bagian dari gerakan pemuda NU yang membawa perubahan positif untuk masyarakat
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/daftar-anggota" variant="secondary" size="lg">
              Daftar Anggota Baru
            </Button>
            <Button href="/kontak" variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-green-700">
              Hubungi Kami
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
