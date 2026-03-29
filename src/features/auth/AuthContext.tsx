import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../../services/api";

type UserRole = 'customer' | 'admin' | 'operator';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    const syncSession = async () => {
      const token = localStorage.getItem('lumin_token');
      const savedUser = localStorage.getItem('lumin_user');
      
      if (token && savedUser) {
        try {
          // Verify token with backend
          const response = await api.get('/auth/me');
          setUser(response.data);
          localStorage.setItem('lumin_user', JSON.stringify(response.data));
        } catch (err) {
          console.error("[AUTH] Session sync failed:", err);
          localStorage.removeItem('lumin_token');
          localStorage.removeItem('lumin_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    syncSession();

    // Listen for session expiration from api.ts
    const handleSessionExpired = () => {
      setUser(null);
    };
    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { user: userData, token, refreshToken } = response.data;
    
    localStorage.setItem('lumin_token', token);
    localStorage.setItem('lumin_refresh_token', refreshToken);
    localStorage.setItem('lumin_user', JSON.stringify(userData));
    
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { user: userData, token } = response.data;
    
    localStorage.setItem('lumin_token', token);
    localStorage.setItem('lumin_user', JSON.stringify(userData));
    
    setUser(userData);
  };

  const logout = async () => {
    localStorage.removeItem('lumin_token');
    localStorage.removeItem('lumin_refresh_token');
    localStorage.removeItem('lumin_user');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      const newUser = prev ? { ...prev, ...userData } : null;
      if (newUser) {
        localStorage.setItem('lumin_user', JSON.stringify(newUser));
      }
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
