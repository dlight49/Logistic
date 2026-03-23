import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, HelpCircle, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { auth, db } from "../../services/firebase";
import { signInWithEmailAndPassword, getIdToken } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function CustomerLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await getIdToken(userCredential.user);
            
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
            const profile = userDoc.exists() ? userDoc.data() : null;

            const userRole = (profile?.role as any) || 'customer';

            login({
                id: userCredential.user.uid,
                email: userCredential.user.email || '',
                name: profile?.name || 'User',
                role: userRole
            }, token);

            // Role isolation: if an admin tries to login here, they still go to admin,
            // but the UI won't suggest it's possible.
            if (userRole === 'admin') navigate('/admin');
            else if (userRole === 'operator') navigate('/driver');
            else navigate('/customer');
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-sans">
            <header className="p-6">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium">
                    <ArrowLeft size={18} /> Back to Home
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Manage your shipments and quotes</p>
                    </div>

                    <div className="glass-panel p-8 rounded-3xl border border-white/20 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                            {error && (
                                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-sm font-medium flex items-center gap-3">
                                    <HelpCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold ml-1">Email Address</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        placeholder="name@example.com"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Password</label>
                                    <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary to-primary-light text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all transform active:scale-[0.98] mt-4 disabled:opacity-50"
                                type="submit"
                            >
                                {loading ? "Signing in..." : "Login to Portal"}
                            </button>
                        </form>
                    </div>

                    <p className="mt-10 text-center text-slate-600 dark:text-slate-400 font-medium">
                        Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign Up</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
