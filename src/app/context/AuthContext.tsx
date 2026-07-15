import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ==========================================
// TIPE DATA
// ==========================================
interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  phone?: string;
  foto_url?: string;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// ==========================================
// CONTEXT
// ==========================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==========================================
// PROVIDER
// ==========================================
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // CEK SESSION SAAT APP LOAD
  // ==========================================
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('ipnu_user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Session check error:', error);
        localStorage.removeItem('ipnu_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // ==========================================
  // FUNCTION LOGIN - PAKAI MYSQL API
  // ==========================================
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:4000/api/users/by-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Login gagal. Periksa email dan password Anda.',
        };
      }

      // Simpan user ke state
      const userData: User = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        phone: data.phone,
        foto_url: data.foto_url,
        organization: data.organization,
      };

      setUser(userData);
      localStorage.setItem('ipnu_user', JSON.stringify(userData));

      return {
        success: true,
        user: userData,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan. Coba lagi nanti.',
      };
    }
  };

  // ==========================================
  // FUNCTION LOGOUT
  // ==========================================
  const logout = () => {
    setUser(null);
    localStorage.removeItem('ipnu_user');
  };

  // ==========================================
  // VALUE CONTEXT
  // ==========================================
  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// HOOK UNTUK AKSES CONTEXT
// ==========================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};