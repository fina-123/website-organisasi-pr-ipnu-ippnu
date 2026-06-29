import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ requiredRole }: { requiredRole?: 'admin' | 'user' }) {
  const { isAuthenticated, isAdmin, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole === 'admin' && !isAdmin) return <Navigate to="/user/dashboard" replace />;
  if (requiredRole === 'user' && user?.role !== 'user') return <Navigate to="/admin/dashboard" replace />;
  return <Outlet />;
};
