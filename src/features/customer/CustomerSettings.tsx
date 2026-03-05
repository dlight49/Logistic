import React, { useState, ReactNode, useEffect } from "react";
import { ArrowLeft, User, Phone, Mail, Shield, Save, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../../utils/api";

export default function CustomerSettings(): ReactNode {
    const navigate = useNavigate();
    const { user, login } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setPhone(user.phone || "");
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSaved(false);

        try {
            await apiFetch('/api/users/me', {
                method: 'PUT',
                body: JSON.stringify({ name, phone })
            });

            if (user) {
                login({ ...user, name, phone });
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Failed to save settings", error);
            alert("Failed to save settings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-950 text-slate-100 min-h-screen pb-32 pt-24 relative overflow-hidden font-display">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-2xl mx-auto px-4 relative z-10">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <button onClick={() => navigate('/customer')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-primary transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-extrabold flex items-center gap-3 mb-2">
                        <Shield className="w-8 h-8 text-primary" /> Profile Settings
                    </h1>
                    <p className="text-slate-400 mb-8 text-sm sm:text-base">Manage your personal information and security preferences.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8"
                >
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <input
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        placeholder="Your full name"
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 opacity-60">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address (Locked)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <input
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 cursor-not-allowed"
                                        type="email"
                                        disabled
                                        value={user?.email || ""}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <input
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        placeholder="+1 (555) 000-0000"
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {saved && (
                                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-emerald-400 text-sm font-bold flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4" /> Changes saved
                                    </motion.span>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? "Saving..." : "Save Profile"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
