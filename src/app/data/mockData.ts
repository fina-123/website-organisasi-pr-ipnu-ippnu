// Mock Data untuk IPNU IPPNU Website

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
  joinDate?: string;
  photo?: string;
}

export interface Member {
  id: string;
  name: string;
  organization: 'IPNU' | 'IPPNU';
  position?: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  photo?: string;
  status: 'active' | 'inactive';
}

export interface Activity {
  id: string;
  title: string;
  type: 'MAKESTA' | 'LAKMUD' | 'PELATIHAN' | 'BAKSOS' | 'LAINNYA';
  description: string;
  date: string;
  location: string;
  quota: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  image?: string;
}

export interface Registration {
  id: string;
  userId: string;
  activityId: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredDate: string;
  type: 'activity' | 'member';
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  image?: string;
  category: string;
}

export interface OrganizationStructure {
  id: string;
  name: string;
  position: string;
  organization: 'IPNU' | 'IPPNU';
  photo?: string;
  period: string;
}

export interface Suggestion {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin IPNU IPPNU',
    email: 'admin@ipnuippnu-batursari.org',
    role: 'admin',
    phone: '081234567890',
  },
  {
    id: '2',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@example.com',
    role: 'user',
    phone: '081234567891',
    address: 'Batursari RT 01 RW 02',
    joinDate: '2024-01-15',
  },
  {
    id: '3',
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@example.com',
    role: 'user',
    phone: '081234567892',
    address: 'Batursari RT 02 RW 03',
    joinDate: '2024-02-20',
  },
];

// Mock Members
export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Ahmad Fauzi',
    organization: 'IPNU',
    position: 'Anggota',
    phone: '081234567891',
    email: 'ahmad.fauzi@example.com',
    address: 'Batursari RT 01 RW 02',
    joinDate: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    organization: 'IPPNU',
    position: 'Anggota',
    phone: '081234567892',
    email: 'siti.nurhaliza@example.com',
    address: 'Batursari RT 02 RW 03',
    joinDate: '2024-02-20',
    status: 'active',
  },
  {
    id: '3',
    name: 'Muhammad Rizki',
    organization: 'IPNU',
    position: 'Anggota',
    phone: '081234567893',
    email: 'm.rizki@example.com',
    address: 'Batursari RT 03 RW 01',
    joinDate: '2024-03-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'Dewi Kartika',
    organization: 'IPPNU',
    position: 'Anggota',
    phone: '081234567894',
    email: 'dewi.kartika@example.com',
    address: 'Batursari RT 01 RW 01',
    joinDate: '2024-01-25',
    status: 'active',
  },
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'MAKESTA (Masa Kesetiaan Anggota) 2026',
    type: 'MAKESTA',
    description: 'Kegiatan pengenalan organisasi dan pembinaan anggota baru IPNU IPPNU Batursari periode 2026.',
    date: '2026-05-15',
    location: 'Aula Desa Batursari',
    quota: 50,
    registered: 35,
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'LAKMUD (Latihan Kader Muda) Regional',
    type: 'LAKMUD',
    description: 'Pelatihan kepemimpinan dan kaderisasi untuk anggota IPNU IPPNU tingkat regional.',
    date: '2026-06-20',
    location: 'Gedung Serbaguna Kecamatan',
    quota: 30,
    registered: 18,
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Pelatihan Public Speaking',
    type: 'PELATIHAN',
    description: 'Pelatihan kemampuan berbicara di depan umum untuk anggota IPNU IPPNU.',
    date: '2026-04-25',
    location: 'Online via Zoom',
    quota: 100,
    registered: 67,
    status: 'ongoing',
  },
  {
    id: '4',
    title: 'Bakti Sosial Ramadhan 2026',
    type: 'BAKSOS',
    description: 'Kegiatan sosial berbagi takjil dan sembako kepada masyarakat Desa Batursari.',
    date: '2026-03-25',
    location: 'Desa Batursari',
    quota: 40,
    registered: 40,
    status: 'completed',
  },
];

// Mock News
export const mockNews: News[] = [
  {
    id: '1',
    title: 'Pelantikan Pengurus IPNU IPPNU Batursari Periode 2026-2028',
    excerpt: 'Pelantikan pengurus baru IPNU IPPNU Ranting Batursari dilaksanakan pada hari Minggu, 2 Februari 2026.',
    content: 'Pelantikan pengurus baru IPNU IPPNU Ranting Batursari periode 2026-2028 telah dilaksanakan pada hari Minggu, 2 Februari 2026 di Aula Desa Batursari. Acara dihadiri oleh Pengurus Cabang, tokoh masyarakat, dan seluruh anggota IPNU IPPNU. Dalam sambutannya, Ketua PC IPNU menyampaikan harapan agar pengurus baru dapat membawa organisasi lebih maju dan bermanfaat bagi masyarakat.',
    author: 'Admin',
    date: '2026-02-03',
    category: 'Organisasi',
  },
  {
    id: '2',
    title: 'IPNU IPPNU Batursari Gelar Baksos Ramadhan',
    excerpt: 'Rangkaian kegiatan sosial di bulan Ramadhan sebagai wujud kepedulian kepada masyarakat.',
    content: 'IPNU IPPNU Ranting Batursari menggelar kegiatan bakti sosial dalam rangka menyambut bulan suci Ramadhan 1447 H. Kegiatan ini meliputi pembagian takjil, sembako, dan santunan untuk fakir miskin dan anak yatim di Desa Batursari. Kegiatan ini mendapat apresiasi dari masyarakat dan pemerintah desa.',
    author: 'Ahmad Fauzi',
    date: '2026-03-26',
    category: 'Kegiatan',
  },
  {
    id: '3',
    title: 'Pendaftaran MAKESTA 2026 Dibuka!',
    excerpt: 'Kesempatan emas untuk bergabung dan belajar bersama IPNU IPPNU Batursari.',
    content: 'Pendaftaran peserta MAKESTA (Masa Kesetiaan Anggota) 2026 resmi dibuka mulai 1 April 2026. MAKESTA merupakan wadah pembinaan dan pengenalan organisasi bagi anggota baru. Pendaftaran dapat dilakukan secara online melalui website atau datang langsung ke sekretariat. Kuota terbatas hanya 50 peserta!',
    author: 'Admin',
    date: '2026-04-01',
    category: 'Pengumuman',
  },
];

// Mock Organization Structure
export const mockStructure: OrganizationStructure[] = [
  {
    id: '1',
    name: 'Muhammad Habibi',
    position: 'Ketua',
    organization: 'IPNU',
    period: '2026-2028',
  },
  {
    id: '2',
    name: 'Ahmad Syaifudin',
    position: 'Wakil Ketua',
    organization: 'IPNU',
    period: '2026-2028',
  },
  {
    id: '3',
    name: 'Fatimah Azzahra',
    position: 'Ketua',
    organization: 'IPPNU',
    period: '2026-2028',
  },
  {
    id: '4',
    name: 'Siti Aisyah',
    position: 'Wakil Ketua',
    organization: 'IPPNU',
    period: '2026-2028',
  },
  {
    id: '5',
    name: 'Abdullah Aziz',
    position: 'Sekretaris',
    organization: 'IPNU',
    period: '2026-2028',
  },
  {
    id: '6',
    name: 'Nur Khasanah',
    position: 'Sekretaris',
    organization: 'IPPNU',
    period: '2026-2028',
  },
];

// Mock Registrations
export const mockRegistrations: Registration[] = [
  {
    id: '1',
    userId: '2',
    activityId: '1',
    status: 'approved',
    registeredDate: '2026-04-05',
    type: 'activity',
  },
  {
    id: '2',
    userId: '2',
    activityId: '3',
    status: 'approved',
    registeredDate: '2026-04-10',
    type: 'activity',
  },
  {
    id: '3',
    userId: '3',
    activityId: '1',
    status: 'pending',
    registeredDate: '2026-04-08',
    type: 'activity',
  },
];

// Mock Suggestions
export const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Ahmad Fauzi',
    subject: 'Saran Kegiatan Ramadhan',
    message: 'Saya mengusulkan untuk mengadakan kajian rutin di bulan Ramadhan setiap malam Jumat.',
    date: '2026-03-15',
    status: 'read',
  },
  {
    id: '2',
    userId: '3',
    userName: 'Siti Nurhaliza',
    subject: 'Website Perlu Update',
    message: 'Website organisasi perlu diupdate dengan informasi kegiatan terbaru.',
    date: '2026-04-08',
    status: 'new',
  },
];

// Organization Info
export const organizationInfo = {
  ipnu: {
    name: 'Ikatan Pelajar Nahdlatul Ulama',
    description: 'IPNU adalah organisasi pelajar di bawah naungan Nahdlatul Ulama yang bertujuan membina dan mengembangkan potensi pelajar.',
    established: '24 Februari 1954',
  },
  ippnu: {
    name: 'Ikatan Pelajar Putri Nahdlatul Ulama',
    description: 'IPPNU adalah organisasi pelajar putri di bawah naungan Nahdlatul Ulama yang bertujuan memberdayakan pelajar putri.',
    established: '2 Maret 1955',
  },
  ranting: {
    name: 'IPNU IPPNU Ranting Batursari',
    address: 'Desa Batursari, Kecamatan Talun, Kabupaten Pekalongan, Provinsi Jawa Tengah',
    email: 'ipnuippnu.batursari@gmail.com',
    phone: '081234567890',
  },
};

export const visionMission = {
  vision: 'Terwujudnya pelajar Nahdlatul Ulama yang beriman, berilmu, dan berakhlakul karimah.',
  mission: [
    'Membina dan mengembangkan potensi pelajar berdasarkan nilai-nilai Ahlussunnah Wal Jamaah',
    'Meningkatkan kualitas pendidikan dan keilmuan anggota',
    'Membangun karakter pelajar yang berakhlakul karimah',
    'Berperan aktif dalam pembangunan masyarakat',
    'Menjaga dan melestarikan nilai-nilai ke-NU-an',
  ],
};

// Current logged in user (untuk simulasi)
export let currentUser: User | null = null;

export const login = (email: string, password: string): User | null => {
  // Simulasi login
  const user = mockUsers.find((u) => u.email === email);
  if (user) {
    currentUser = user;
    return user;
  }
  return null;
};

export const logout = () => {
  currentUser = null;
};

export const getCurrentUser = () => currentUser;
