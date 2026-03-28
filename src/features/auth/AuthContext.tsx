import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "../../auth";

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
      try {
        const result = await authClient.getSession();
        if (result.data?.session && result.data?.user) {
          // Map Neon Auth user to our application User type
          // Note: In a real app, you might fetch additional metadata (like 'role') from a custom table
          const neonUser = result.data.user;
          setUser({
            id: neonUser.id,
            email: neonUser.email,
            name: neonUser.name || '',
            role: (neonUser as any).role || 'customer', // Use metadata if available, else default
            image: neonUser.image || undefined
          });
        }
      } catch (err) {
        console.error("[AUTH] Session sync failed:", err);
      } finally {
        setLoading(false);
      }
    };

    syncSession();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) throw new Error(result.error.message);

    const session = await authClient.getSession();
    if (session.data?.user) {
        const u = session.data.user;
        setUser({
            id: u.id,
            email: u.email,
            name: u.name || '',
            role: (u as any).role || 'customer'
        });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await authClient.signUp.email({ name, email, password });
    if (result.error) throw new Error(result.error.message);

    const session = await authClient.getSession();
    if (session.data?.user) {
        const u = session.data.user;
        setUser({
            id: u.id,
            email: u.email,
            name: u.name || '',
            role: 'customer'
        });
    }
  };

  const logout = async () => {
    await authClient.signOut();
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
