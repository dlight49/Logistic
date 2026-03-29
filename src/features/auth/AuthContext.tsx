import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "../../auth";
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

  // Sync session with Neon Auth and verify with Backend
  useEffect(() => {
    const syncSession = async () => {
      try {
        const result = await authClient.getSession();
        
        if (result.data?.session && result.data?.user) {
          const neonUser = result.data.user;
          const session = result.data.session;
          
          // CRITICAL: We take the session token from Neon and put it in our API's store
          // This allows the Backend to verify the Neon token
          localStorage.setItem('logistics_token', session.token);
          
          // Fetch additional profile data (like Role) from our Logistics DB
          try {
            const backendResponse = await api.get('/auth/me');
            setUser(backendResponse.data);
            localStorage.setItem('logistics_user', JSON.stringify(backendResponse.data));
          } catch (backendErr) {
            console.warn("[AUTH] Backend profile sync failed, using Neon profile", backendErr);
            setUser({
              id: neonUser.id,
              email: neonUser.email,
              name: neonUser.name || '',
              role: 'customer', // Default role if not in backend DB yet
              image: neonUser.image || undefined
            });
          }
        }
      } catch (err) {
        console.error("[AUTH] Session sync failed:", err);
      } finally {
        setLoading(false);
      }
    };

    syncSession();

    const handleSessionExpired = () => setUser(null);
    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) throw new Error(result.error.message);

    const sessionResult = await authClient.getSession();
    if (sessionResult.data?.session) {
        localStorage.setItem('logistics_token', sessionResult.data.session.token);
        const backendResponse = await api.get('/auth/me');
        setUser(backendResponse.data);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await authClient.signUp.email({ name, email, password });
    if (result.error) throw new Error(result.error.message);

    const sessionResult = await authClient.getSession();
    if (sessionResult.data?.session) {
        localStorage.setItem('logistics_token', sessionResult.data.session.token);
        const backendResponse = await api.get('/auth/me');
        setUser(backendResponse.data);
    }
  };

  const logout = async () => {
    await authClient.signOut();
    localStorage.removeItem('logistics_token');
    localStorage.removeItem('logistics_user');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
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
