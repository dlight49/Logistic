import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole } from "../../types";
import { api } from "../../services/api";

interface AuthContextType {
    user: User | null;
    login: (userData: User, tokens?: { access: string; refresh: string }) => void;
    logout: () => void;
    loading: boolean;
    sendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem("access_token");
            const storedUser = localStorage.getItem("lumin_user");

            if (accessToken && storedUser) {
                try {
                    // Set user from localStorage for immediate UI load
                    setUser(JSON.parse(storedUser));
                    
                    // Note: You can optionally fetch fresh user data from the backend here:
                    // const response = await api.get('/auth/me/');
                    // setUser(response.data);
                    // localStorage.setItem("lumin_user", JSON.stringify(response.data));
                } catch (e) {
                    console.error("Error initializing auth:", e);
                    logout();
                }
            } else {
                logout(); // Ensure clean state
            }
            setLoading(false);
        };

        initializeAuth();

        // Listen for session expiration events from api.ts (401 interceptor)
        const handleSessionExpired = () => {
            setUser(null);
        };
        window.addEventListener('session-expired', handleSessionExpired);

        return () => window.removeEventListener('session-expired', handleSessionExpired);
    }, []);

    const login = (userData: User, tokens?: { access: string; refresh: string }) => {
        if (tokens) {
            localStorage.setItem("access_token", tokens.access);
            localStorage.setItem("refresh_token", tokens.refresh);
        }
        localStorage.setItem("lumin_user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("lumin_user");
        setUser(null);
    };

    const sendVerification = async () => {
        console.log("Verification email sent");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, sendVerification }}>
            {children}
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
