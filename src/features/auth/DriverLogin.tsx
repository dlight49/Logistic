import React, { useState } from "react";
import { Truck, Lock, Eye, EyeOff, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { apiFetch } from "../../utils/api";

export default function DriverLogin() {
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
            const response = await apiFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            // NOTE: Drivers are stored with role='operator' (canonical DB value).
            if (data.user.role !== 'operator' && data.user.role !== 'admin') {
                throw new Error("Access denied. Driver credentials required.");
            }

            login(data.user, data.token);
            navigate('/driver');
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-slate-900 text-white overflow-x-hidden font-sans">
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/20 rounded-full mb-6 ring-4 ring-amber-500/5">
                        <Truck className="text-amber-500 w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold leading-tight tracking-tight">Driver Portal</h1>
                    <p className="text-slate-400 mt-2 text-base mb-10">Sign in to start your shift</p>

                    <form onSubmit={handleLogin} className="space-y-5 text-left">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-xl text-sm font-medium flex items-center gap-2 mb-4">
                                <HelpCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-300 text-sm font-semibold ml-1">Driver ID / Email</label>
                            <input
                                className="w-full px-4 py-4 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                                placeholder="Enter ID or email"
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-slate-300 text-sm font-semibold ml-1">Password</label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-4 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                                    placeholder="Enter password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-900/20 transition-all transform active:scale-[0.98] mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                            type="submit"
                        >
                            {loading ? "Verifying..." : "Start Shift"}
                        </button>
                    </form>
                    <p className="mt-8 text-slate-500 text-sm italic">Issues signing in? Contact Fleet Operations.</p>
                </div>
            </main>
        </div>
    );
}
