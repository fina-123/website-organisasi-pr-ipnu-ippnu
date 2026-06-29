import { useEffect, useState, useMemo, useRef } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import {
  Users, Plus, Edit, Trash2, Eye, X, Search,
  Filter, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown,
  Loader2, AlertTriangle, Save, Camera, Download, Printer,
  IdCard, UserCheck, UserX, CheckCircle, XCircle, Mail, Phone,
  Calendar, MapPin, GraduationCap, Briefcase, BookOpen, FileText, Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

/* ============================================================
   TIPE DATA
   ============================================================ */
export interface Member {
  id: string;
  nia: string;
  full_name: string;
  gender: 'Laki-laki' | 'Perempuan';
  organization: 'IPNU' | 'IPPNU';
  birth_place: string;
  birth_date: string;
  address: string;
  phone: string;
  email: string;
  education: string;
  occupation: string;
  kaderisasi_status: 'Belum Kaderisasi' | 'Makesta' | 'Lakmud' | 'Lakut' | 'Lakutama';
  member_status: 'active' | 'inactive';
  photo_url?: string;
  join_date: string;
  auth_id?: string;
  role: string;
  created_at: string;
}

type SortField = 'full_name' | 'nia' | 'join_date';
type SortDir = 'asc' | 'desc';

/* ============================================================
   LOCAL STORAGE HELPERS
   ============================================================ */
const STORAGE_KEY = 'admin_members';

function loadMembers(): Member[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }

  // Seed data default
  const defaults: Member[] = [
    {
      id: 'm1',
      nia: 'IPNU-2026-001',
      full_name: 'Ahmad Fauzi',
      gender: 'Laki-laki',
      organization: 'IPNU',
      birth_place: 'Pekalongan',
      birth_date: '2005-03-15',
      address: 'Batursari RT 01 RW 02, Kec. Talun, Kab. Pekalongan',
      phone: '081234567891',
      email: 'ahmad.fauzi@example.com',
      education: 'SMA/MA',
      occupation: 'Pelajar',
      kaderisasi_status: 'Makesta',
      member_status: 'active',
      join_date: '2026-01-15',
      role: 'user',
      created_at: '2026-01-15T00:00:00.000Z',
    },
    {
      id: 'm2',
      nia: 'IPPNU-2026-002',
      full_name: 'Siti Nurhaliza',
      gender: 'Perempuan',
      organization: 'IPPNU',
      birth_place: 'Pekalongan',
      birth_date: '2004-07-20',
      address: 'Batursari RT 02 RW 03, Kec. Talun, Kab. Pekalongan',
      phone: '081234567892',
      email: 'siti.nurhaliza@example.com',
      education: 'SMA/MA',
      occupation: 'Pelajar',
      kaderisasi_status: 'Belum Kaderisasi',
      member_status: 'active',
      join_date: '2026-02-20',
      role: 'user',
      created_at: '2026-02-20T00:00:00.000Z',
    },
    {
      id: 'm3',
      nia: 'IPNU-2026-003',
      full_name: 'Muhammad Rizki',
      gender: 'Laki-laki',
      organization: 'IPNU',
      birth_place: 'Pekalongan',
      birth_date: '2003-11-10',
      address: 'Batursari RT 03 RW 01, Kec. Talun, Kab. Pekalongan',
      phone: '081234567893',
      email: 'm.rizki@example.com',
      education: 'Kuliah',
      occupation: 'Mahasiswa',
      kaderisasi_status: 'Lakmud',
      member_status: 'active',
      join_date: '2026-03-10',
      role: 'user',
      created_at: '2026-03-10T00:00:00.000Z',
    },
  ];
  saveMembers(defaults);
  return defaults;
}

function saveMembers(members: Member[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function generateNIA(org: string): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100 + Math.random() * 900);
  return `${org}-${year}-${rand}`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch { return '-'; }
}

/* ============================================================
   STATISTIK CARD
   ============================================================ */
function StatCard({ icon: Icon, label, value, color }: {
  icon: any; label: string; value: number; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

/* ============================================================
   SKELETON LOADING
   ============================================================ */
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-200 rounded-full" /><div className="h-4 bg-gray-200 rounded w-28" /></div></td>
          <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
          <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
          <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
          <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-28" /></td>
          <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
          <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
          <td className="px-4 py-3"><div className="flex gap-2"><div className="w-8 h-8 bg-gray-200 rounded" /><div className="w-8 h-8 bg-gray-200 rounded" /><div className="w-8 h-8 bg-gray-200 rounded" /><div className="w-8 h-8 bg-gray-200 rounded" /></div></td>
        </tr>
      ))}
    </tbody>
  );
}

/* ============================================================
   MODAL
   ============================================================ */
function Modal({ open, onClose, title, children, size = 'md' }: {
  open: boolean; onClose: () => void; title: string;
  children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${widths[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ============================================================
   CONFIRM DIALOG
   ============================================================ */
function ConfirmDialog({ open, onClose, onConfirm, title, message }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Batal</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Ya, Hapus</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FORM VALIDASI
   ============================================================ */
interface FormErrors {
  nia?: string;
  full_name?: string;
  gender?: string;
  organization?: string;
  birth_place?: string;
  birth_date?: string;
  address?: string;
  phone?: string;
  email?: string;
  education?: string;
  occupation?: string;
  kaderisasi_status?: string;
  member_status?: string;
}

const KADERISASI_OPTIONS = ['Belum Kaderisasi', 'Makesta', 'Lakmud', 'Lakut', 'Lakutama'] as const;
const EDUCATION_OPTIONS = ['SMP/MTs', 'SMA/MA', 'SMK', 'Kuliah', 'Lainnya'] as const;

function validateMemberForm(data: any, isEdit: boolean): FormErrors {
  const errors: FormErrors = {};
  if (!data.nia?.trim()) errors.nia = 'NIA wajib diisi';
  if (!data.full_name?.trim()) errors.full_name = 'Nama lengkap wajib diisi';
  else if (data.full_name.trim().length < 3) errors.full_name = 'Nama minimal 3 karakter';
  if (!data.gender) errors.gender = 'Jenis kelamin wajib dipilih';
  if (!data.organization) errors.organization = 'Organisasi wajib dipilih';
  if (!data.birth_place?.trim()) errors.birth_place = 'Tempat lahir wajib diisi';
  if (!data.birth_date) errors.birth_date = 'Tanggal lahir wajib diisi';
  if (!data.phone?.trim()) errors.phone = 'Nomor telepon wajib diisi';
  else if (data.phone.trim().length < 9) errors.phone = 'Nomor telepon tidak valid';
  if (!data.email?.trim()) errors.email = 'Email wajib diisi';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Format email tidak valid';
  if (!data.education) errors.education = 'Pendidikan wajib dipilih';
  if (!data.occupation?.trim()) errors.occupation = 'Pekerjaan wajib diisi';
  if (!data.kaderisasi_status) errors.kaderisasi_status = 'Status kaderisasi wajib dipilih';
  if (!data.member_status) errors.member_status = 'Status anggota wajib dipilih';
  return errors;
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [filterOrg, setFilterOrg] = useState<'all' | 'IPNU' | 'IPPNU'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterKader, setFilterKader] = useState<string>('all');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('join_date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [detailMember, setDetailMember] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [editTarget, setEditTarget] = useState<Member | null>(null);

  // Form state
  const [form, setForm] = useState({
    nia: '', full_name: '', gender: '' as string, organization: '' as string,
    birth_place: '', birth_date: '', address: '', phone: '', email: '',
    education: '', occupation: '', kaderisasi_status: '', member_status: 'active' as string,
    photo_url: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Supabase sync state
  const [syncingId, setSyncingId] = useState<string | null>(null);

  /* ==========================================
     LOAD DATA
     ========================================== */
  const loadData = async () => {
    setLoading(true);

    // Load from localStorage first
    const localData = loadMembers();

    // Try Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: supabaseData, error } = await supabase
          .from('members')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && supabaseData && supabaseData.length > 0) {
          // Merge: Supabase data + local data not in Supabase
          const supabaseIds = new Set(supabaseData.map((m: any) => m.id));
          const localOnly = localData.filter(m => !supabaseIds.has(m.id));
          const merged = [...supabaseData.map(mapSupabaseMember), ...localOnly];
          setMembers(merged);
          saveMembers(merged);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Supabase load error:', e);
      }
    }

    setMembers(localData);
    setLoading(false);
  };

  const mapSupabaseMember = (data: any): Member => ({
    id: data.id,
    nia: data.nia || '-',
    full_name: data.full_name || '',
    gender: data.gender || 'Laki-laki',
    organization: data.organization || 'IPNU',
    birth_place: data.birth_place || '',
    birth_date: data.birth_date || '',
    address: data.address || '',
    phone: data.phone || '',
    email: data.email || '',
    education: data.education || '',
    occupation: data.occupation || '',
    kaderisasi_status: data.kaderisasi_status || 'Belum Kaderisasi',
    member_status: data.member_status || 'active',
    photo_url: data.photo_url || '',
    join_date: data.join_date || data.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    auth_id: data.auth_id || undefined,
    role: data.role || 'user',
    created_at: data.created_at || new Date().toISOString(),
  });

  useEffect(() => { loadData(); }, []);

  /* ==========================================
     FILTER, SORT, PAGINATION
     ========================================== */
  const filteredMembers = useMemo(() => {
    let result = [...members];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(m =>
        m.full_name.toLowerCase().includes(q) ||
        m.nia.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q)
      );
    }

    if (filterOrg !== 'all') result = result.filter(m => m.organization === filterOrg);
    if (filterStatus !== 'all') result = result.filter(m => m.member_status === filterStatus);
    if (filterKader !== 'all') result = result.filter(m => m.kaderisasi_status === filterKader);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'full_name') cmp = a.full_name.localeCompare(b.full_name);
      else if (sortField === 'nia') cmp = a.nia.localeCompare(b.nia);
      else cmp = new Date(a.join_date).getTime() - new Date(b.join_date).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [members, search, filterOrg, filterStatus, filterKader, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / perPage));
  const paginatedMembers = filteredMembers.slice((page - 1) * perPage, page * perPage);
  useEffect(() => { setPage(1); }, [search, filterOrg, filterStatus, filterKader]);

  /* ==========================================
     STATISTIK
     ========================================== */
  const stats = useMemo(() => ({
    total: members.length,
    ipnu: members.filter(m => m.organization === 'IPNU').length,
    ippnu: members.filter(m => m.organization === 'IPPNU').length,
    active: members.filter(m => m.member_status === 'active').length,
    inactive: members.filter(m => m.member_status === 'inactive').length,
    makesta: members.filter(m => m.kaderisasi_status === 'Makesta').length,
    lakmud: members.filter(m => m.kaderisasi_status === 'Lakmud').length,
    lakut: members.filter(m => m.kaderisasi_status === 'Lakut').length,
    lakutama: members.filter(m => m.kaderisasi_status === 'Lakutama').length,
    belum_kader: members.filter(m => m.kaderisasi_status === 'Belum Kaderisasi').length,
  }), [members]);

  /* ==========================================
     SORTING
     ========================================== */
  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortDir === 'asc' ? <ArrowUp size={14} className="text-green-600" /> : <ArrowDown size={14} className="text-green-600" />;
  };

  /* ==========================================
     FOTO UPLOAD
     ========================================== */
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran foto maksimal 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhotoPreview(dataUrl);
      setForm(f => ({ ...f, photo_url: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  /* ==========================================
     TAMBAH ANGGOTA
     ========================================== */
  const openAddModal = () => {
    const org = 'IPNU';
    setForm({
      nia: generateNIA(org), full_name: '', gender: '', organization: org,
      birth_place: '', birth_date: '', address: '', phone: '', email: '',
      education: '', occupation: '', kaderisasi_status: '', member_status: 'active',
      photo_url: '',
    });
    setPhotoPreview(null);
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleAdd = async () => {
    const errors = validateMemberForm(form, false);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 300));

    const newMember: Member = {
      id: generateId(),
      nia: form.nia.trim(),
      full_name: form.full_name.trim(),
      gender: form.gender as 'Laki-laki' | 'Perempuan',
      organization: form.organization as 'IPNU' | 'IPPNU',
      birth_place: form.birth_place.trim(),
      birth_date: form.birth_date,
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      education: form.education,
      occupation: form.occupation.trim(),
      kaderisasi_status: form.kaderisasi_status as Member['kaderisasi_status'],
      member_status: form.member_status as 'active' | 'inactive',
      photo_url: form.photo_url || '',
      join_date: new Date().toISOString().slice(0, 10),
      role: 'user',
      created_at: new Date().toISOString(),
    };

    // Try Supabase
    let savedToSupabase = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('members').insert([{
          nia: newMember.nia,
          full_name: newMember.full_name,
          gender: newMember.gender,
          organization: newMember.organization,
          birth_place: newMember.birth_place,
          birth_date: newMember.birth_date,
          address: newMember.address,
          phone: newMember.phone,
          email: newMember.email,
          education: newMember.education,
          occupation: newMember.occupation,
          kaderisasi_status: newMember.kaderisasi_status,
          member_status: newMember.member_status,
          role: 'user',
        }]);
        if (!error) {
          savedToSupabase = true;
          // Reload from Supabase to get the real ID
          loadData();
        }
      } catch (e) { console.error('Supabase insert error:', e); }
    }

    if (!savedToSupabase) {
      const updated = [...members, newMember];
      saveMembers(updated);
      setMembers(updated);
    }

    setShowAddModal(false);
    toast.success(`Anggota ${newMember.full_name} berhasil ditambahkan! (NIA: ${newMember.nia})`);
    setSubmitting(false);
  };

  /* ==========================================
     EDIT ANGGOTA
     ========================================== */
  const openEditModal = (member: Member) => {
    setEditTarget(member);
    setForm({
      nia: member.nia, full_name: member.full_name, gender: member.gender,
      organization: member.organization, birth_place: member.birth_place,
      birth_date: member.birth_date, address: member.address, phone: member.phone,
      email: member.email, education: member.education, occupation: member.occupation,
      kaderisasi_status: member.kaderisasi_status, member_status: member.member_status,
      photo_url: member.photo_url || '',
    });
    setPhotoPreview(member.photo_url || null);
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    const errors = validateMemberForm(form, true);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 300));

    const updatedMember: Partial<Member> = {
      nia: form.nia.trim(), full_name: form.full_name.trim(), gender: form.gender as any,
      organization: form.organization as any, birth_place: form.birth_place.trim(),
      birth_date: form.birth_date, address: form.address.trim(), phone: form.phone.trim(),
      email: form.email.trim(), education: form.education, occupation: form.occupation.trim(),
      kaderisasi_status: form.kaderisasi_status as any, member_status: form.member_status as any,
      photo_url: form.photo_url || '',
    };

    let savedToSupabase = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('members').update(updatedMember).eq('id', editTarget.id);
        if (!error) savedToSupabase = true;
      } catch (e) { console.error('Supabase update error:', e); }
    }

    if (!savedToSupabase) {
      const updated = members.map(m => m.id === editTarget.id ? { ...m, ...updatedMember } : m);
      saveMembers(updated);
      setMembers(updated);
    }

    setShowEditModal(false);
    setEditTarget(null);
    toast.success(`Data ${form.full_name} berhasil diperbarui!`);
    setSubmitting(false);
  };

  /* ==========================================
     HAPUS ANGGOTA
     ========================================== */
  const openDeleteConfirm = (member: Member) => {
    setDeleteTarget(member);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    let savedToSupabase = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('members').delete().eq('id', deleteTarget.id);
        if (!error) savedToSupabase = true;
      } catch (e) { console.error('Supabase delete error:', e); }
    }

    if (!savedToSupabase) {
      const updated = members.filter(m => m.id !== deleteTarget.id);
      saveMembers(updated);
      setMembers(updated);
    }

    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    toast.success(`Anggota ${deleteTarget.full_name} telah dihapus!`);
  };

  /* ==========================================
     DETAIL
     ========================================== */
  const openDetail = (member: Member) => {
    setDetailMember(member);
    setShowDetailModal(true);
  };

  /* ==========================================
     SYNC TO SUPABASE
     ========================================== */
  const syncToSupabase = async (member: Member) => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error('Supabase tidak terkonfigurasi');
      return;
    }
    setSyncingId(member.id);
    try {
      const { error } = await supabase.from('members').upsert([{
        nia: member.nia, full_name: member.full_name, gender: member.gender,
        organization: member.organization, birth_place: member.birth_place,
        birth_date: member.birth_date, address: member.address, phone: member.phone,
        email: member.email, education: member.education, occupation: member.occupation,
        kaderisasi_status: member.kaderisasi_status, member_status: member.member_status,
        photo_url: member.photo_url, role: member.role,
      }]);
      if (error) throw error;
      toast.success(`Data ${member.full_name} disinkronkan ke Supabase!`);
    } catch (err: any) {
      toast.error(`Gagal sinkron: ${err.message}`);
    }
    setSyncingId(null);
  };

  /* ==========================================
     EXPORT CSV
     ========================================== */
  const exportCSV = () => {
    const headers = ['NIA', 'Nama Lengkap', 'Jenis Kelamin', 'Organisasi', 'Tempat Lahir', 'Tanggal Lahir', 'Alamat', 'Telepon', 'Email', 'Pendidikan', 'Pekerjaan', 'Kaderisasi', 'Status', 'Tanggal Bergabung'];
    const rows = filteredMembers.map(m => [
      m.nia, m.full_name, m.gender, m.organization, m.birth_place, m.birth_date,
      `"${m.address.replace(/"/g, '""')}"`, m.phone, m.email, m.education, m.occupation,
      m.kaderisasi_status, m.member_status === 'active' ? 'Aktif' : 'Nonaktif', m.join_date,
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `data-anggota-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success('Data anggota berhasil diexport CSV!');
  };

  /* ==========================================
     CETAK DATA
     ========================================== */
  const printData = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) { toast.error('Izinkan popup untuk mencetak'); return; }
    const rows = filteredMembers.map((m, i) => `<tr>
      <td class="border px-3 py-2">${i + 1}</td>
      <td class="border px-3 py-2">${m.nia}</td>
      <td class="border px-3 py-2">${m.full_name}</td>
      <td class="border px-3 py-2">${m.organization}</td>
      <td class="border px-3 py-2">${m.kaderisasi_status}</td>
      <td class="border px-3 py-2">${m.member_status === 'active' ? 'Aktif' : 'Nonaktif'}</td>
      <td class="border px-3 py-2">${formatDate(m.join_date)}</td>
    </tr>`).join('');

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Data Anggota IPNU IPPNU</title>
    <style>body{font-family:sans-serif;padding:20px}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th{background:#166534;color:white;padding:8px;text-align:left}
    td,th{border:1px solid #ccc;padding:6px}
    h1{text-align:center;color:#166534;margin-bottom:5px}
    .info{text-align:center;color:#666;margin-bottom:20px;font-size:13px}
    @media print{@page{size:landscape;margin:15mm}}
    </style></head><body>
    <h1>DATA ANGGOTA IPNU IPPNU RANTING BATURSARI</h1>
    <p class="info">Total: ${filteredMembers.length} anggota | Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
    <table><thead><tr>
    <th>No</th><th>NIA</th><th>Nama Lengkap</th><th>Organisasi</th><th>Kaderisasi</th><th>Status</th><th>Bergabung</th>
    </tr></thead><tbody>${rows}</tbody></table></body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  /* ==========================================
     CETAK KARTU ANGGOTA
     ========================================== */
  const printCard = (member: Member) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) { toast.error('Izinkan popup untuk mencetak'); return; }
    const photoHtml = member.photo_url
      ? `<img src="${member.photo_url}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #166534;margin-bottom:10px" />`
      : `<div style="width:80px;height:80px;border-radius:50%;background:#166534;display:flex;align-items:center;justify-content:center;color:white;font-size:32px;font-weight:bold;margin:0 auto 10px">${member.full_name.charAt(0)}</div>`;
    const qrText = `IPNU IPPNU Batursari\nNIA: ${member.nia}\nNama: ${member.full_name}\nOrganisasi: ${member.organization}`;

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Kartu Anggota</title>
    <style>
    body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px}
    .card{width:320px;border:2px solid #166534;border-radius:16px;padding:0;overflow:hidden;background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)}
    .card-header{background:#166534;color:white;text-align:center;padding:12px;font-weight:bold;font-size:14px;letter-spacing:1px}
    .card-body{text-align:center;padding:20px}
    .card-body h2{margin:5px 0;font-size:18px;color:#166534}
    .card-body .nia{font-size:13px;color:#666;margin-bottom:5px;font-family:monospace}
    .card-body .org{display:inline-block;background:#166534;color:white;padding:3px 12px;border-radius:20px;font-size:12px;margin:5px 0 10px}
    .card-body .qr{width:80px;height:80px;margin:10px auto;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:8px;color:#333;padding:5px;background:white;word-break:break-all;overflow:hidden;line-height:1.2;text-align:center}
    .card-footer{text-align:center;padding:8px;font-size:10px;color:#888;border-top:1px dashed #ccc}
    </style></head><body>
    <div class="card">
      <div class="card-header">KARTU ANGGOTA IPNU IPPNU</div>
      <div class="card-body">
        ${photoHtml}
        <h2>${member.full_name}</h2>
        <div class="nia">NIA: ${member.nia}</div>
        <div class="org">${member.organization}</div>
        <div style="font-size:12px;color:#666;margin-bottom:5px">${member.kaderisasi_status}</div>
        <div class="qr">${qrText}</div>
        <div style="font-size:11px;color:#666">Ranting Batursari • ${member.organization === 'IPNU' ? 'Putra' : 'Putri'}</div>
      </div>
      <div class="card-footer">Sistem Informasi IPNU IPPNU Batursari</div>
    </div>
    <script>window.print()</script></body></html>`);
    printWindow.document.close();
  };

  /* ==========================================
     CHECK & CREATE ACCOUNT
     ========================================== */
  const checkAccountStatus = (member: Member): 'has_account' | 'no_account' | 'demo_only' => {
    // Check created_users in localStorage
    try {
      const created = JSON.parse(localStorage.getItem('created_users') || '{}');
      if (created[member.email]) return 'has_account';
    } catch { /* ignore */ }
    // Check demo users
    if (member.email === 'ahmad.fauzi@example.com') return 'has_account';
    // Check admin_users
    try {
      const adminUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
      if (adminUsers.some((u: any) => u.email === member.email)) return 'has_account';
    } catch { /* ignore */ }
    return 'no_account';
  };

  const createAccount = (member: Member) => {
    const password = Math.random().toString(36).slice(-8) + 'Aa1!';
    try {
      const created = JSON.parse(localStorage.getItem('created_users') || '{}');
      created[member.email] = {
        password,
        fullName: member.full_name,
        phone: member.phone,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('created_users', JSON.stringify(created));
      toast.success(`Akun untuk ${member.full_name} berhasil dibuat!`, {
        description: `Email: ${member.email}\nPassword: ${password}`,
        duration: 10000,
      });
      // Refresh
      loadData();
    } catch (e) {
      toast.error('Gagal membuat akun');
    }
  };

  /* ====== FORM INPUT HELPER ====== */
  const FormField = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  const kaderisasiBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Belum Kaderisasi': 'bg-gray-100 text-gray-700',
      'Makesta': 'bg-blue-100 text-blue-700',
      'Lakmud': 'bg-yellow-100 text-yellow-700',
      'Lakut': 'bg-orange-100 text-orange-700',
      'Lakutama': 'bg-purple-100 text-purple-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Data Anggota</h1>
              <p className="text-gray-500">Manajemen data anggota IPNU & IPPNU</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium shadow-sm">
                <Download size={18} />
                Export CSV
              </button>
              <button onClick={printData} className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 text-sm font-medium shadow-sm">
                <Printer size={18} />
                Cetak
              </button>
              <button onClick={openAddModal} className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-sm">
                <Plus size={20} />
                Tambah Anggota
              </button>
            </div>
          </div>

          {/* STATISTIK */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard icon={Users} label="Total Anggota" value={stats.total} color="bg-blue-600" />
            <StatCard icon={Users} label="IPNU" value={stats.ipnu} color="bg-green-600" />
            <StatCard icon={Users} label="IPPNU" value={stats.ippnu} color="bg-purple-600" />
            <StatCard icon={CheckCircle} label="Aktif" value={stats.active} color="bg-teal-600" />
            <StatCard icon={XCircle} label="Nonaktif" value={stats.inactive} color="bg-red-500" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-center shadow-sm">
              <p className="text-xs text-gray-500">Belum Kaderisasi</p>
              <p className="text-lg font-bold text-gray-900">{stats.belum_kader}</p>
            </div>
            <div className="bg-white rounded-lg border border-blue-200 px-4 py-3 text-center shadow-sm">
              <p className="text-xs text-blue-600">Makesta</p>
              <p className="text-lg font-bold text-blue-700">{stats.makesta}</p>
            </div>
            <div className="bg-white rounded-lg border border-yellow-200 px-4 py-3 text-center shadow-sm">
              <p className="text-xs text-yellow-600">Lakmud</p>
              <p className="text-lg font-bold text-yellow-700">{stats.lakmud}</p>
            </div>
            <div className="bg-white rounded-lg border border-orange-200 px-4 py-3 text-center shadow-sm">
              <p className="text-xs text-orange-600">Lakut</p>
              <p className="text-lg font-bold text-orange-700">{stats.lakut}</p>
            </div>
            <div className="bg-white rounded-lg border border-purple-200 px-4 py-3 text-center shadow-sm">
              <p className="text-xs text-purple-600">Lakutama</p>
              <p className="text-lg font-bold text-purple-700">{stats.lakutama}</p>
            </div>
          </div>

          {/* SEARCH & FILTER */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Cari nama, NIA, email, atau telepon..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" />
              </div>
              <select value={filterOrg} onChange={e => setFilterOrg(e.target.value as any)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white">
                <option value="all">Semua Organisasi</option>
                <option value="IPNU">IPNU</option>
                <option value="IPPNU">IPPNU</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white">
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
              <select value={filterKader} onChange={e => setFilterKader(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white">
                <option value="all">Semua Kaderisasi</option>
                {KADERISASI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>

          {/* TABEL */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Foto</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100"
                      onClick={() => toggleSort('nia')}><div className="flex items-center gap-1">NIA <SortIcon field="nia" /></div></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100"
                      onClick={() => toggleSort('full_name')}><div className="flex items-center gap-1">Nama <SortIcon field="full_name" /></div></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Organisasi</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kaderisasi</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Akun</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100"
                      onClick={() => toggleSort('join_date')}><div className="flex items-center gap-1">Bergabung <SortIcon field="join_date" /></div></th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                {loading ? <TableSkeleton rows={5} /> : paginatedMembers.length === 0 ? (
                  <tbody><tr><td colSpan={9} className="px-6 py-16 text-center">
                    <Users size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 font-medium mb-1">
                      {search || filterOrg !== 'all' || filterStatus !== 'all' || filterKader !== 'all'
                        ? 'Tidak ada anggota yang cocok dengan filter' : 'Belum ada anggota'}
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      {search || filterOrg !== 'all' || filterStatus !== 'all' || filterKader !== 'all'
                        ? 'Coba ubah kata kunci atau filter' : 'Klik "Tambah Anggota" untuk menambahkan anggota pertama'}
                    </p>
                    {!search && filterOrg === 'all' && filterStatus === 'all' && filterKader === 'all' && (
                      <button onClick={openAddModal} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                        <Plus size={16} className="inline mr-1" /> Tambah Anggota
                      </button>
                    )}
                  </td></tr></tbody>
                ) : (
                  <tbody className="divide-y divide-gray-100">
                    {paginatedMembers.map((member) => {
                      const accountStatus = checkAccountStatus(member);
                      return (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            {member.photo_url ? (
                              <img src={member.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                                {member.full_name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-600">{member.nia}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{member.full_name}</div>
                            <div className="text-xs text-gray-400">{member.gender}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${member.organization === 'IPNU' ? 'bg-green-100 text-green-700 ring-1 ring-green-300' : 'bg-purple-100 text-purple-700 ring-1 ring-purple-300'}`}>
                              {member.organization}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${kaderisasiBadge(member.kaderisasi_status)} ring-1 ring-inset`}>
                              {member.kaderisasi_status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => {
                              const newStatus = member.member_status === 'active' ? 'inactive' : 'active';
                              const updated: Member[] = members.map(m => m.id === member.id ? { ...m, member_status: newStatus as 'active' | 'inactive' } : m);
                              saveMembers(updated); setMembers(updated);
                              toast.success(`Status ${member.full_name} diubah menjadi ${newStatus === 'active' ? 'Aktif' : 'Nonaktif'}`);
                            }} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                              member.member_status === 'active' ? 'bg-green-100 text-green-700 ring-1 ring-green-300 hover:bg-green-200' : 'bg-red-100 text-red-700 ring-1 ring-red-300 hover:bg-red-200'
                            }`}>
                              {member.member_status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                              {member.member_status === 'active' ? 'Aktif' : 'Nonaktif'}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            {accountStatus === 'has_account' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                <UserCheck size={12} /> Ada
                              </span>
                            ) : (
                              <button onClick={() => createAccount(member)}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors">
                                <UserX size={12} /> Buat Akun
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(member.join_date)}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openDetail(member)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Detail"><Eye size={16} /></button>
                              <button onClick={() => openEditModal(member)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Edit"><Edit size={16} /></button>
                              <button onClick={() => printCard(member)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Cetak Kartu"><IdCard size={16} /></button>
                              {isSupabaseConfigured && (
                                <button onClick={() => syncToSupabase(member)} disabled={syncingId === member.id}
                                  className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg disabled:opacity-50" title="Sinkron ke Supabase">
                                  {syncingId === member.id ? <Loader2 size={16} className="animate-spin" /> : <Copy size={16} />}
                                </button>
                              )}
                              <button onClick={() => openDeleteConfirm(member)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Hapus"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
            </div>
            {/* PAGINATION */}
            {!loading && filteredMembers.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-500">Menampilkan {(page - 1) * perPage + 1} - {Math.min(page * perPage, filteredMembers.length)} dari {filteredMembers.length} anggota</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={16} className="text-gray-600" /></button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{i + 1}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={16} className="text-gray-600" /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ===== MODAL TAMBAH ===== */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah Anggota Baru" size="xl">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField label="NIA" error={formErrors.nia}>
              <input type="text" value={form.nia} onChange={e => setForm(f => ({ ...f, nia: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.nia ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent`} />
            </FormField>
            <FormField label="Nama Lengkap" error={formErrors.full_name}>
              <input type="text" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.full_name ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent`} placeholder="Nama lengkap" />
            </FormField>
            <FormField label="Jenis Kelamin" error={formErrors.gender}>
              <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500">
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </FormField>
            <FormField label="Organisasi" error={formErrors.organization}>
              <select value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value, nia: generateNIA(e.target.value as any) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500">
                <option value="IPNU">IPNU</option>
                <option value="IPPNU">IPPNU</option>
              </select>
            </FormField>
            <FormField label="Tempat Lahir" error={formErrors.birth_place}>
              <input type="text" value={form.birth_place} onChange={e => setForm(f => ({ ...f, birth_place: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.birth_place ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-green-500`} />
            </FormField>
            <FormField label="Tanggal Lahir" error={formErrors.birth_date}>
              <input type="date" value={form.birth_date} onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.birth_date ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-green-500`} />
            </FormField>
            <FormField label="Nomor Telepon" error={formErrors.phone}>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-green-500`} placeholder="08xxxxxxxxxx" />
            </FormField>
            <FormField label="Email" error={formErrors.email}>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-green-500`} placeholder="email@example.com" />
            </FormField>
            <FormField label="Pendidikan" error={formErrors.education}>
              <select value={form.education} onChange={e => setForm(f => ({ ...f, education: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500">
                <option value="">Pilih</option>
                {EDUCATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </FormField>
            <FormField label="Pekerjaan" error={formErrors.occupation}>
              <input type="text" value={form.occupation} onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.occupation ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-green-500`} />
            </FormField>
            <FormField label="Status Kaderisasi" error={formErrors.kaderisasi_status}>
              <select value={form.kaderisasi_status} onChange={e => setForm(f => ({ ...f, kaderisasi_status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500">
                <option value="">Pilih</option>
                {KADERISASI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </FormField>
            <FormField label="Status Anggota" error={formErrors.member_status}>
              <select value={form.member_status} onChange={e => setForm(f => ({ ...f, member_status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500">
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </FormField>
          </div>
          <FormField label="Alamat Lengkap" error={formErrors.address}>
            <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={2}
              className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.address ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-green-500`} />
          </FormField>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Anggota</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm">
                <Camera size={18} /> Pilih Foto
              </button>
              {photoPreview && <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />}
              {photoPreview && <button onClick={() => { setPhotoPreview(null); setForm(f => ({ ...f, photo_url: '' })); }} className="text-xs text-red-500 hover:text-red-700">Hapus</button>}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Batal</button>
            <button onClick={handleAdd} disabled={submitting} className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ===== MODAL EDIT ===== */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Anggota" size="xl">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField label="NIA" error={formErrors.nia}>
              <input type="text" value={form.nia} onChange={e => setForm(f => ({ ...f, nia: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.nia ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-green-500`} />
            </FormField>
            <FormField label="Nama Lengkap" error={formErrors.full_name}>
              <input type="text" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.full_name ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-green-500`} />
            </FormField>
            <FormField label="Jenis Kelamin">
              <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select>
            </FormField>
            <FormField label="Organisasi">
              <select value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"><option value="IPNU">IPNU</option><option value="IPPNU">IPPNU</option></select>
            </FormField>
            <FormField label="Tempat Lahir"><input type="text" value={form.birth_place} onChange={e => setForm(f => ({ ...f, birth_place: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" /></FormField>
            <FormField label="Tanggal Lahir"><input type="date" value={form.birth_date} onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" /></FormField>
            <FormField label="Telepon"><input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" /></FormField>
            <FormField label="Email"><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" /></FormField>
            <FormField label="Pendidikan">
              <select value={form.education} onChange={e => setForm(f => ({ ...f, education: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"><option value="">Pilih</option>{EDUCATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </FormField>
            <FormField label="Pekerjaan"><input type="text" value={form.occupation} onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" /></FormField>
            <FormField label="Kaderisasi">
              <select value={form.kaderisasi_status} onChange={e => setForm(f => ({ ...f, kaderisasi_status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"><option value="">Pilih</option>{KADERISASI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}</select>
            </FormField>
            <FormField label="Status">
              <select value={form.member_status} onChange={e => setForm(f => ({ ...f, member_status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select>
            </FormField>
          </div>
          <FormField label="Alamat"><textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" /></FormField>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm"><Camera size={18} /> Ganti Foto</button>
              {photoPreview && <img src={photoPreview} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Batal</button>
            <button onClick={handleEdit} disabled={submitting} className="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ===== MODAL DETAIL ===== */}
      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)} title="Detail Anggota" size="lg">
        {detailMember && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              {detailMember.photo_url ? (
                <img src={detailMember.photo_url} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-green-200 shadow-lg mb-3" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-3">
                  {detailMember.full_name.charAt(0)}
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{detailMember.full_name}</h3>
              <p className="text-sm text-gray-500 font-mono">NIA: {detailMember.nia}</p>
              <div className="flex gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${detailMember.organization === 'IPNU' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{detailMember.organization}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${detailMember.member_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{detailMember.member_status === 'active' ? 'Aktif' : 'Nonaktif'}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${kaderisasiBadge(detailMember.kaderisasi_status)}`}>{detailMember.kaderisasi_status}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 grid md:grid-cols-2 gap-4">
              <InfoItem icon={<Users size={16} />} label="Jenis Kelamin" value={detailMember.gender} />
              <InfoItem icon={<MapPin size={16} />} label="Tempat Lahir" value={`${detailMember.birth_place}, ${formatDate(detailMember.birth_date)}`} />
              <InfoItem icon={<Calendar size={16} />} label="Tanggal Lahir" value={formatDate(detailMember.birth_date)} />
              <InfoItem icon={<MapPin size={16} />} label="Alamat" value={detailMember.address} />
              <InfoItem icon={<Phone size={16} />} label="Telepon" value={detailMember.phone} />
              <InfoItem icon={<Mail size={16} />} label="Email" value={detailMember.email} />
              <InfoItem icon={<GraduationCap size={16} />} label="Pendidikan" value={detailMember.education} />
              <InfoItem icon={<Briefcase size={16} />} label="Pekerjaan" value={detailMember.occupation} />
              <InfoItem icon={<BookOpen size={16} />} label="Kaderisasi" value={detailMember.kaderisasi_status} />
              <InfoItem icon={<Calendar size={16} />} label="Bergabung" value={formatDate(detailMember.join_date)} />
              <InfoItem icon={<FileText size={16} />} label="Role" value={detailMember.role === 'admin' ? 'Admin' : 'User'} />
              <InfoItem icon={<CheckCircle size={16} />} label="Status Akun" value={checkAccountStatus(detailMember) === 'has_account' ? '✅ Punya Akun' : '❌ Belum Punya Akun'} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowDetailModal(false); openEditModal(detailMember); }} className="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium">Edit Anggota</button>
              <button onClick={() => { printCard(detailMember); }} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2"><IdCard size={18} /> Cetak Kartu</button>
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Tutup</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ===== CONFIRM DELETE ===== */}
      <ConfirmDialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={handleDelete}
        title="Hapus Anggota?" message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.full_name}" (NIA: ${deleteTarget?.nia})? Tindakan ini tidak dapat dibatalkan.`} />
    </div>
  );
}

/* ============================================================
   INFO ITEM COMPONENT
   ============================================================ */
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value || '-'}</p>
      </div>
    </div>
  );
}