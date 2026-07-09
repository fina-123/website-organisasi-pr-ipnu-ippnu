import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';
import { LogoPair } from './LogoPair';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <LogoPair ipnuSize={56} ippnuSize={56} gap={12} darkMode={true} />
              <div>
                <div className="font-bold text-white">IPNU IPPNU</div>
                <div className="text-xs">Ranting Batursari</div>
              </div>
            </div>
            <p className="text-sm">
              Organisasi pelajar Nahdlatul Ulama yang membina dan mengembangkan potensi generasi muda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Menu Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/profil" className="hover:text-green-400 transition-colors">
                  Profil Organisasi
                </Link>
              </li>
              <li>
                <Link to="/visi-misi" className="hover:text-green-400 transition-colors">
                  Visi & Misi
                </Link>
              </li>
              <li>
                <Link to="/struktur" className="hover:text-green-400 transition-colors">
                  Struktur Organisasi
                </Link>
              </li>
              <li>
                <Link to="/berita" className="hover:text-green-400 transition-colors">
                  Berita & Kegiatan
                </Link>
              </li>
              <li>
                <Link to="/cek-status" className="hover:text-green-400 transition-colors">
                  Cek Status Pendaftaran
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Desa Batursari, Kecamatan Talun, Kabupaten Pekalongan, Jawa Tengah</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0" />
                <span>081234567890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0" />
                <span>ipnuippnu.batursari@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-white mb-4">Media Sosial</h3>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=100017794368549"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/pr_ipnuippnubatursari?igsh=MXN0NDBtcDZ6MHJkYw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2026 IPNU IPPNU Ranting Batursari. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
