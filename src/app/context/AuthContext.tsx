import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured, checkSupabaseConnection } from '../../lib/supabase';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'user' | 'admin', name?: string, userId?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Cek koneksi Supabase dengan timeout
        const connOk = await checkSupabaseConnection(4000);
        if (!mounted) return;

        if (connOk && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (!mounted) return;

          if (session?.user) {
            const { data: memberData } = await supabase
              .from('members')
              .select('role, full_name')
              .eq('auth_id', session.user.id)
              .single();

            const role = memberData?.role || 'user';
            const newUser = { id: session.user.id, email: session.user.email!, role: role as 'user' | 'admin', name: memberData?.full_name };
            if (mounted) {
              setUser(newUser);
              localStorage.setItem('user', JSON.stringify(newUser));
            }
            return;
          }
        }

        // Fallback: cek localStorage
        if (mounted) {
          const saved = localStorage.getItem('user');
          if (saved) {
            try { 
              setUser(JSON.parse(saved)); 
            } catch { /* ignore */ }
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        if (session?.user) {
          const { data: memberData } = await supabase!
            .from('members')
            .select('role, full_name')
            .eq('auth_id', session.user.id)
            .single();

          const role = memberData?.role || 'user';
          const newUser = { id: session.user.id, email: session.user.email!, role: role as 'user' | 'admin', name: memberData?.full_name };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => { mounted = false; };
  }, []);

  const login = (email: string, role: 'user' | 'admin', name?: string, userId?: string) => {
    let actualUserId = userId;
    if (!actualUserId) {
      console.warn('⚠️ [AuthContext] No userId provided! Falling back to Date.now() timestamp. This will cause database JOIN mismatches.');
      console.warn('⚠️ [AuthContext] Make sure Login.tsx fetches userId from /api/users/by-email before calling login().');
      actualUserId = Date.now().toString();
    }
    console.log('🔐 AuthContext.login called with:', { email, role, name, userId });
    console.log('🆔 Final userId stored:', actualUserId);
    const newUser: User = { id: actualUserId, email, role, name };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase!.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('user');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isAdmin: user?.role === 'admin', loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};