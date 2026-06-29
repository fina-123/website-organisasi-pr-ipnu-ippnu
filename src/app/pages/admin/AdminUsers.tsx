import { useEffect, useState, useMemo } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import {
  UserCog, Plus, Edit, Trash2, KeyRound, Eye, EyeOff, X, Search,
  Filter, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown,
  Users, Shield, User, CheckCircle, XCircle, Loader2, AlertTriangle,
  Mail, Phone, Calendar, Clock, Save, Copy, Check
} from 'lucide-react';
import { toast } from 'sonner';

/* ============================================================
   TIPE DATA
   ============================================================ */
interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
}

type SortField = 'full_name' | 'email' | 'created_at';
type SortDir = 'asc' | 'desc';

/* ============================================================
   LOCAL STORAGE HELPERS
   ============================================================ */
const STORAGE_KEY = 'admin_users';

function loadUsers(): AdminUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }

  // Seed data default
  const defaults: AdminUser[] = [
    {
      id: '1',
      full_name: 'Admin IPNU',
      email: 'admin@ipnuippnu-batursari.org',
      phone: '081234567890',
      role: 'admin',
      status: 'active',
      created_at: '2026-01-01T00:00:00.000Z',
      last_login: new Date().toISOString(),
    },
    {
      id: '2',
      full_name: 'Ahmad Fauzi',
      email: 'ahmad.fauzi@example.com',
      phone: '081234567891',
      role: 'user',
      status: 'active',
      created_at: '2026-02-01T00:00:00.000Z',
    },
    {
      id: '3',
      full_name: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@example.com',
      phone: '081234567892',
      role: 'user',
      status: 'active',
      created_at: '2026-02-20T00:00:00.000Z',
    },
  ];
  saveUsers(defaults);
  return defaults;
}

function saveUsers(users: AdminUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pwd = '';
  for (let i = 0; i < 10; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch { return '-'; }
}

function formatDateTime(iso?: string): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
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
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          </td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-44" /></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28" /></td>
          <td className="px-6 py-4"><div className="flex gap-2"><div className="w-8 h-8 bg-gray-200 rounded" /><div className="w-8 h-8 bg-gray-200 rounded" /><div className="w-8 h-8 bg-gray-200 rounded" /><div className="w-8 h-8 bg-gray-200 rounded" /></div></td>
        </tr>
      ))}
    </tbody>
  );
}

/* ============================================================
   MODAL KOMPONEN
   ============================================================ */
function Modal({ open, onClose, title, children, size = 'md' }: {
  open: boolean; onClose: () => void; title: string;
  children: React.ReactNode; size?: 'sm' | 'md' | 'lg';
}) {
  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };
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
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FORM VALIDASI
   ============================================================ */
interface FormErrors {
  full_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirm_password?: string;
  role?: string;
  status?: string;
}

function validateUserForm(data: Partial<AdminUser> & { password?: string; confirm_password?: string }, isEdit: boolean): FormErrors {
  const errors: FormErrors = {};

  if (!data.full_name?.trim()) errors.full_name = 'Nama lengkap wajib diisi';
  else if (data.full_name.trim().length < 3) errors.full_name = 'Nama minimal 3 karakter';

  if (!data.email?.trim()) errors.email = 'Email wajib diisi';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Format email tidak valid';

  if (!data.phone?.trim()) errors.phone = 'Nomor telepon wajib diisi';
  else if (data.phone.trim().length < 9) errors.phone = 'Nomor telepon tidak valid';

  if (!isEdit) {
    if (!data.password) errors.password = 'Password wajib diisi';
    else if (data.password.length < 8) errors.password = 'Password minimal 8 karakter';

    if (data.password !== data.confirm_password) errors.confirm_password = 'Konfirmasi password tidak sama';
  }

  if (!data.role) errors.role = 'Role wajib dipilih';
  if (!data.status) errors.status = 'Status wajib dipilih';

  return errors;
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export function AdminUsers() {
  // --- Data state ---
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Search & Filter ---
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // --- Sorting ---
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // --- Pagination ---
  const [page, setPage] = useState(1);
  const perPage = 10;

  // --- Modal state ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [detailUser, setDetailUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);

  // --- Form state ---
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', confirm_password: '',
    role: 'user' as 'admin' | 'user', status: 'active' as 'active' | 'inactive',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [resettingId, setResettingId] = useState<string | null>(null);

  /* ---------- Load data ---------- */
  const loadData = () => {
    setLoading(true);
    // Simulasi delay untuk skeleton
    setTimeout(() => {
      setUsers(loadUsers());
      setLoading(false);
    }, 400);
  };

  useEffect(() => { loadData(); }, []);

  /* ---------- Filter & Sort & Paginate ---------- */
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(u =>
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q)
      );
    }

    // Filter role
    if (filterRole !== 'all') result = result.filter(u => u.role === filterRole);

    // Filter status
    if (filterStatus !== 'all') result = result.filter(u => u.status === filterStatus);

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'full_name') cmp = a.full_name.localeCompare(b.full_name);
      else if (sortField === 'email') cmp = a.email.localeCompare(b.email);
      else cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [users, search, filterRole, filterStatus, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / perPage));
  const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, filterRole, filterStatus]);

  /* ---------- Statistik ---------- */
  const stats = useMemo(() => ({
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    user: users.filter(u => u.role === 'user').length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
  }), [users]);

  /* ---------- Sorting handler ---------- */
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortDir === 'asc' ? <ArrowUp size={14} className="text-green-600" /> : <ArrowDown size={14} className="text-green-600" />;
  };

  /* ---------- Helper: simpan ke created_users ---------- */
  const syncToCreatedUsers = (email: string, data: { password: string; fullName: string; phone: string; role: string }) => {
    try {
      const stored = JSON.parse(localStorage.getItem('created_users') || '{}');
      stored[email] = {
        ...data,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('created_users', JSON.stringify(stored));
    } catch { /* ignore */ }
  };

  const removeFromCreatedUsers = (email: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem('created_users') || '{}');
      delete stored[email];
      localStorage.setItem('created_users', JSON.stringify(stored));
    } catch { /* ignore */ }
  };

  /* ---------- Tambah User ---------- */
  const openAddModal = () => {
    setForm({ full_name: '', email: '', phone: '', password: '', confirm_password: '', role: 'user', status: 'active' });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleAdd = async () => {
    const errors = validateUserForm({ ...form }, false);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 500)); // simulasi

    const newUser: AdminUser = {
      id: generateId(),
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
      status: form.status,
      created_at: new Date().toISOString(),
    };

    // Simpan ke admin_users
    const updated = [...users, newUser];
    saveUsers(updated);
    setUsers(updated);

    // Sinkron ke created_users agar bisa login
    syncToCreatedUsers(newUser.email, {
      password: form.password,
      fullName: newUser.full_name,
      phone: newUser.phone,
      role: newUser.role,
    });

    setShowAddModal(false);
    toast.success(`User ${newUser.full_name} berhasil ditambahkan!`, {
      description: `Email: ${newUser.email} | Password: ${form.password}`,
      duration: 8000,
    });
    setSubmitting(false);
  };

  /* ---------- Edit User ---------- */
  const openEditModal = (user: AdminUser) => {
    setEditTarget(user);
    setForm({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      password: '',
      confirm_password: '',
      role: user.role,
      status: user.status,
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    const errors = validateUserForm({ ...form }, true);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 500));

    const updated = users.map(u =>
      u.id === editTarget.id
        ? { ...u, full_name: form.full_name.trim(), email: form.email.trim(), phone: form.phone.trim(), role: form.role, status: form.status }
        : u
    );
    saveUsers(updated);
    setUsers(updated);
    setShowEditModal(false);
    setEditTarget(null);
    toast.success(`Data user ${form.full_name} berhasil diperbarui!`);
    setSubmitting(false);
  };

  /* ---------- Hapus User ---------- */
  const openDeleteConfirm = (user: AdminUser) => {
    setDeleteTarget(user);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    // Hapus dari admin_users
    const updated = users.filter(u => u.id !== deleteTarget.id);
    saveUsers(updated);
    setUsers(updated);
    // Hapus juga dari created_users agar tidak bisa login
    removeFromCreatedUsers(deleteTarget.email);
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    toast.success(`User ${deleteTarget.full_name} telah dihapus!`);
  };

  /* ---------- Detail User ---------- */
  const openDetail = (user: AdminUser) => {
    setDetailUser(user);
    setShowDetailModal(true);
  };

  // --- Password viewer ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState<{ email: string; password: string; fullName: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { prompt('Salin manual:', text); }
  };

  /* ---------- Lihat Password ---------- */
  const handleViewPassword = (user: AdminUser) => {
    try {
      const stored = JSON.parse(localStorage.getItem('created_users') || '{}');
      const data = stored[user.email];
      if (data?.password) {
        setPasswordData({ email: user.email, password: data.password, fullName: user.full_name });
        setShowPasswordModal(true);
      } else {
        toast.error('Password tidak tersedia. Reset password terlebih dahulu.');
      }
    } catch {
      toast.error('Gagal membaca data password.');
    }
  };

  /* ---------- Reset Password ---------- */
  const handleResetPassword = (user: AdminUser) => {
    if (!confirm(`Reset password untuk ${user.full_name}?\n\nPassword baru akan digenerate.\n\nApakah Anda yakin?`)) return;

    const newPassword = generatePassword();
    setResettingId(user.id);

    setTimeout(() => {
      // Simpan password baru ke created_users
      syncToCreatedUsers(user.email, {
        password: newPassword,
        fullName: user.full_name,
        phone: user.phone,
        role: user.role,
      });

      // Tampilkan modal password
      setPasswordData({ email: user.email, password: newPassword, fullName: user.full_name });
      setShowPasswordModal(true);
      setResettingId(null);
    }, 600);
  };

  /* ---------- Toggle Status ---------- */
  const toggleStatus = (user: AdminUser) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const updated = users.map(u =>
      u.id === user.id ? { ...u, status: newStatus as 'active' | 'inactive' } : u
    );
    saveUsers(updated);
    setUsers(updated);
    toast.success(`Status ${user.full_name} diubah menjadi ${newStatus === 'active' ? 'Aktif' : 'Nonaktif'}`);
  };

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* ---------- HEADER ---------- */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Kelola User</h1>
              <p className="text-gray-500">Manajemen akun user dan admin sistem</p>
            </div>
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-sm transition-all hover:shadow-md"
            >
              <Plus size={20} />
              Tambah User
            </button>
          </div>

          {/* ---------- STATISTIK ---------- */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard icon={Users} label="Total User" value={stats.total} color="bg-blue-600" />
            <StatCard icon={Shield} label="Admin" value={stats.admin} color="bg-purple-600" />
            <StatCard icon={User} label="User Biasa" value={stats.user} color="bg-teal-600" />
            <StatCard icon={CheckCircle} label="Aktif" value={stats.active} color="bg-green-600" />
            <StatCard icon={XCircle} label="Nonaktif" value={stats.inactive} color="bg-red-500" />
          </div>

          {/* ---------- SEARCH & FILTER ---------- */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama, email, atau telepon..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                />
              </div>

              {/* Filter Role */}
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value as any)}
                  className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm appearance-none bg-white"
                >
                  <option value="all">Semua Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Filter Status */}
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as any)}
                  className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm appearance-none bg-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>
          </div>

          {/* ---------- TABEL ---------- */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
                      onClick={() => toggleSort('full_name')}
                    >
                      <div className="flex items-center gap-1">
                        Nama <SortIcon field="full_name" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
                      onClick={() => toggleSort('email')}
                    >
                      <div className="flex items-center gap-1">
                        Email <SortIcon field="email" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Telepon
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
                      onClick={() => toggleSort('created_at')}
                    >
                      <div className="flex items-center gap-1">
                        Dibuat <SortIcon field="created_at" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>

                {loading ? (
                  <TableSkeleton rows={5} />
                ) : paginatedUsers.length === 0 ? (
                  <tbody>
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <Users size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 font-medium mb-1">
                          {search || filterRole !== 'all' || filterStatus !== 'all'
                            ? 'Tidak ada user yang cocok dengan filter'
                            : 'Belum ada user'}
                        </p>
                        <p className="text-sm text-gray-400 mb-4">
                          {search || filterRole !== 'all' || filterStatus !== 'all'
                            ? 'Coba ubah kata kunci atau filter'
                            : 'Klik "Tambah User" untuk menambahkan user pertama'}
                        </p>
                        {!search && filterRole === 'all' && filterStatus === 'all' && (
                          <button onClick={openAddModal} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                            <Plus size={16} className="inline mr-1" />
                            Tambah User
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="divide-y divide-gray-100">
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                              {user.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.full_name}</div>
                              <div className="text-xs text-gray-400">ID: #{user.id.slice(0, 8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-300'
                              : 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                          }`}>
                            {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleStatus(user)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-700 ring-1 ring-green-300 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 ring-1 ring-red-300 hover:bg-red-200'
                            }`}
                            title={user.status === 'active' ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                          >
                            {user.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.phone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-400" />
                            {formatDate(user.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openDetail(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Detail"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleViewPassword(user)}
                              className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                              title="Lihat Password"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleResetPassword(user)}
                              disabled={resettingId === user.id}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Reset Password"
                            >
                              {resettingId === user.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <KeyRound size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(user)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>

            {/* ---------- PAGINATION ---------- */}
            {!loading && filteredUsers.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-500">
                  Menampilkan {(page - 1) * perPage + 1} - {Math.min(page * perPage, filteredUsers.length)} dari {filteredUsers.length} user
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} className="text-gray-600" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        page === i + 1
                          ? 'bg-green-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ============================================================
         MODAL TAMBAH USER
         ============================================================ */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah User Baru" size="md">
        <div className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${formErrors.full_name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              placeholder="Masukkan nama lengkap"
            />
            {formErrors.full_name && <p className="text-xs text-red-500 mt-1">{formErrors.full_name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${formErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              placeholder="email@example.com"
            />
            {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon <span className="text-red-500">*</span></label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${formErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              placeholder="08xxxxxxxxxx"
            />
            {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${formErrors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              placeholder="Minimal 8 karakter"
            />
            {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={form.confirm_password}
              onChange={e => setForm(f => ({ ...f, confirm_password: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${formErrors.confirm_password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              placeholder="Ulangi password"
            />
            {formErrors.confirm_password && <p className="text-xs text-red-500 mt-1">{formErrors.confirm_password}</p>}
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
              <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value as 'admin' | 'user' }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleAdd}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ============================================================
         MODAL EDIT USER
         ============================================================ */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit User" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${formErrors.full_name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            />
            {formErrors.full_name && <p className="text-xs text-red-500 mt-1">{formErrors.full_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${formErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            />
            {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon <span className="text-red-500">*</span></label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${formErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            />
            {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
              <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value as 'admin' | 'user' }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">Batal</button>
            <button onClick={handleEdit} disabled={submitting} className="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ============================================================
         MODAL DETAIL USER
         ============================================================ */}
      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)} title="Detail User" size="sm">
        {detailUser && (
          <div className="space-y-5">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-3">
                {detailUser.full_name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{detailUser.full_name}</h3>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${
                detailUser.role === 'admin'
                  ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-300'
                  : 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
              }`}>
                {detailUser.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>

            {/* Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{detailUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Nomor Telepon</p>
                  <p className="text-sm font-medium text-gray-900">{detailUser.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {detailUser.status === 'active' ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                <div>
                  <p className="text-xs text-gray-500">Status Akun</p>
                  <p className={`text-sm font-medium ${detailUser.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>
                    {detailUser.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Tanggal Registrasi</p>
                  <p className="text-sm font-medium text-gray-900">{formatDateTime(detailUser.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Terakhir Login</p>
                  <p className="text-sm font-medium text-gray-900">{formatDateTime(detailUser.last_login)}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowDetailModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">Tutup</button>
              <button onClick={() => { setShowDetailModal(false); openEditModal(detailUser); }} className="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors">
                Edit User
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================
         MODAL PASSWORD VIEWER
         ============================================================ */}
      <Modal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="" size="sm">
        {passwordData && (
          <div className="space-y-5">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <KeyRound size={32} className="text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {passwordData.fullName}
              </h2>
              <p className="text-sm text-gray-500">{passwordData.email}</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
              <p className="text-xs text-orange-700 font-medium mb-2 uppercase tracking-wider">Password</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 bg-white border border-orange-300 px-4 py-3 rounded-lg text-lg font-mono font-bold text-orange-800 text-center select-all">
                  {passwordData.password}
                </code>
                <button
                  onClick={() => copyToClipboard(passwordData.password)}
                  className={`p-3 rounded-lg transition-all ${
                    copied
                      ? 'bg-green-100 text-green-600'
                      : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  }`}
                  title="Salin"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 mt-2 text-center">✓ Tersalin ke clipboard!</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-medium mb-1">📋 Kredensial Login:</p>
              <p>Email: <strong>{passwordData.email}</strong></p>
              <p>Password: <strong>{passwordData.password}</strong></p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  copyToClipboard(`Email: ${passwordData.email}\nPassword: ${passwordData.password}`);
                  toast.success('Kredensial tersalin!');
                }}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
              >
                <Copy size={18} />
                Salin Kredensial
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================
         CONFIRM DELETE
         ============================================================ */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Hapus User?"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.full_name}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
