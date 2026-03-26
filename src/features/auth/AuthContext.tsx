import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";

type UserRole = 'customer' | 'admin' | 'operator';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem("logistics_token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch("/api/auth/me");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("[AUTH] Session restoration failed:", error);
        localStorage.removeItem("logistics_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem("logistics_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("logistics_token");
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
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
