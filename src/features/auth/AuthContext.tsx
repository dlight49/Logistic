import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole } from "../../types";
import { auth, db } from "../../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verification Mode Check
        const mockUser = localStorage.getItem("mock_user");
        if (mockUser) {
            setUser(JSON.parse(mockUser));
            setLoading(false);
            return;
        }

        // Real Firebase Auth Listener
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch user profile metadata from Firestore based on auth UID
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    const profileData = userDoc.exists() ? userDoc.data() : {};

                    // Get the fresh ID token to use in apiFetch calls
                    const token = await firebaseUser.getIdToken();
                    localStorage.setItem("lumin_token", token);

                    const loggedInUser: User = {
                        id: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        name: profileData.name || firebaseUser.email?.split('@')[0] || 'User',
                        role: (profileData.role as UserRole) || 'customer'
                    };
                    setUser(loggedInUser);
                    localStorage.setItem("lumin_user", JSON.stringify(loggedInUser));
                } catch (e) {
                    console.error("Error fetching user profile from Firestore:", e);
                }
            } else {
                setUser(null);
                localStorage.removeItem("lumin_user");
                localStorage.removeItem("lumin_token");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("lumin_user", JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (e) { }

        setUser(null);
        localStorage.removeItem("lumin_user");
        localStorage.removeItem("lumin_token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
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
