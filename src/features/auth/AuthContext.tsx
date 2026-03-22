import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole } from "../../types";
import { auth, db } from "../../services/firebase";
import { onAuthStateChanged, signOut, sendEmailVerification } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    sendVerification: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Development-only mock bypass — stripped by Vite in production builds
        // if (import.meta.env.DEV) {
        //     const mockUser = localStorage.getItem("mock_user");
        //     if (mockUser) {
        //         console.warn("[AUTH] Using mock_user from localStorage — dev only");
        //         setUser(JSON.parse(mockUser));
        //         setLoading(false);
        //         return;
        //     }
        // }

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

                    // 1. TRUST FIRESTORE ROLE FIRST (canonical source for Firestore sync)
                    let finalRole: UserRole = profileData.role || 'customer';

                    // 2. Cross-check with Supabase/SQL for redundancy if needed, but Firestore is our primary auth metadata source
                    if (finalRole === 'customer') {
                        try {
                            const { supabase } = await import("../../services/supabase");
                            const { data: profile } = await supabase
                                .from('User')
                                .select('role')
                                .eq('id', firebaseUser.uid)
                                .single();
                            
                            if (profile?.role) {
                                finalRole = profile.role as UserRole;
                            }
                        } catch (e) {
                            console.error("Error fetching Supabase role:", e);
                        }
                    }

                    const loggedInUser: User = {
                        id: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        name: profileData.name || firebaseUser.email?.split('@')[0] || 'User',
                        role: finalRole,
                        emailVerified: firebaseUser.emailVerified
                    };

                    // SYNC WITH SUPABASE: Upsert while keeping the resolved role
                    try {
                        const { supabase } = await import("../../services/supabase");
                        await supabase
                            .from('User')
                            .upsert({
                                id: firebaseUser.uid,
                                email: loggedInUser.email,
                                name: loggedInUser.name,
                                role: loggedInUser.role
                            });
                    } catch (supabaseError) {
                        console.error("Failed to load Supabase client for sync:", supabaseError);
                    }

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

    const sendVerification = async () => {
        if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, sendVerification, loading }}>
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
