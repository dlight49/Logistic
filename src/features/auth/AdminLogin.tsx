import React, { useState } from "react";
import { Shield, Lock, Eye, EyeOff, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { apiFetch } from "../../utils/api";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { login, user } = useAuth();
    ...
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
            setLoading(false);
        }
    };

    // Separate effect for navigation after login success
    React.useEffect(() => {
        if (user) {
            if (user.role !== 'admin') {
                setError("Access denied. Admin credentials required.");
            } else {
                navigate('/admin');
            }
        }
    }, [user, navigate]);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-slate-950 text-white overflow-x-hidden font-sans">
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-500/20 rounded-full mb-6 ring-4 ring-rose-500/5">
                            <Shield className="text-rose-500 w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold leading-tight tracking-tight">Admin Console</h1>
                        <p className="text-slate-400 mt-2 text-base">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                <HelpCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-300 text-sm font-semibold ml-1">Admin Email</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-800 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                                    placeholder="Enter admin email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-slate-300 text-sm font-semibold ml-1">Security Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-800 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                                    placeholder="Enter password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-rose-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-900/20 transition-all transform active:scale-[0.98] mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                            type="submit"
                        >
                            {loading ? "Authenticating..." : "Establish Secure Session"}
                        </button>
                    </form>
                </div>
            </main>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(244,63,94,0.1),transparent_50%)]" />
        </div>
    );
}
