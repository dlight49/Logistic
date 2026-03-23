import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "../../types";
import { auth, db } from "../../services/firebase";
import { onAuthStateChanged, signOut, getIdToken } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
    user: User | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    loading: boolean;
    sendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            if (firebaseUser) {
                try {
                    // Get the latest ID token
                    const token = await getIdToken(firebaseUser);
                    localStorage.setItem("lumin_token", token);

                    // Get user profile from Firestore if not already in state
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    const profile = userDoc.exists() ? userDoc.data() : null;

                    const userData: User = {
                        id: firebaseUser.uid,
                        email: firebaseUser.email || "",
                        name: profile?.name || "User",
                        role: profile?.role || "customer",
                    };

                    localStorage.setItem("lumin_user", JSON.stringify(userData));
                    setUser(userData);
                } catch (e) {
                    console.error("Auth state synchronization failed:", e);
                }
            } else {
                localStorage.removeItem("lumin_token");
                localStorage.removeItem("lumin_user");
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = (userData: User, token: string) => {
        localStorage.setItem("lumin_token", token);
        localStorage.setItem("lumin_user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem("lumin_token");
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
