import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ requiredRole }: { requiredRole?: 'admin' | 'user' }) {
  const { isAuthenticated, isAdmin, user, loading } = useAuth();

  // Tampilkan loading spinner selama auth state sedang diinisialisasi
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole === 'admin' && !isAdmin) return <Navigate to="/user/dashboard" replace />;
  if (requiredRole === 'user' && user?.role !== 'user') return <Navigate to="/admin/dashboard" replace />;
  return <Outlet />;
};
