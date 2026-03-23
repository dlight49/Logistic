import React, { ReactNode, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { 
    User as UserIcon, 
    Bell, 
    Shield, 
    Globe, 
    Moon, 
    LogOut, 
    ChevronRight, 
    ChevronLeft,
    CreditCard,
    HelpCircle,
    Info,
    Mail,
    Phone,
    X,
    CheckCircle2,
    Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import { updatePassword, updateProfile } from "firebase/auth";
import { auth } from "../../services/firebase";

type SettingsSection = 'personal' | 'payment' | 'security' | 'notifications' | 'language' | 'legal' | null;

export default function CustomerSettings(): ReactNode {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<SettingsSection>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form States
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(""); // Assuming we'll fetch this or user can add it
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setNewConfirmPassword] = useState("");

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Update backend (SQL + Firestore via controller)
            const res = await apiFetch(`/api/users/${user?.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ name, phone })
            });

            if (!res.ok) throw new Error("Failed to update profile");

            // 2. Update Firebase Auth display name for consistency
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: name });
            }

            setSuccessMessage("Profile updated successfully");
            setTimeout(() => {
                setSuccessMessage(null);
                setActiveSection(null);
            }, 2000);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            if (auth.currentUser) {
                await updatePassword(auth.currentUser, newPassword);
                setSuccessMessage("Password updated successfully");
                setNewPassword("");
                setNewConfirmPassword("");
                setTimeout(() => {
                    setSuccessMessage(null);
                    setActiveSection(null);
                }, 2000);
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans pb-32">
            {/* App Bar */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-4 py-4 flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 active:scale-90 transition-transform"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-black tracking-tight dark:text-white">Settings</h1>
            </header>

            <main className="px-6 pt-6 space-y-8 max-w-lg mx-auto">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent p-1 shadow-2xl relative">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=0D8ABC&color=fff&size=128`} 
                            className="w-full h-full rounded-full object-cover border-4 border-white dark:border-[#020617]" 
                            alt="Profile" 
                        />
                        <button 
                            onClick={() => setActiveSection('personal')}
                            className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-white/10 text-primary active:scale-90 transition-transform"
                        >
                            <UserIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight dark:text-white">{user?.name}</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{user?.email}</p>
                    </div>
                </div>

                {/* Settings Groups */}
                <div className="space-y-6">
                    <SettingsGroup title="Account">
                        <SettingsItem 
                            icon={<UserIcon />} 
                            label="Personal Information" 
                            sub="Name, email, and phone" 
                            onClick={() => setActiveSection('personal')}
                        />
                        <SettingsItem 
                            icon={<CreditCard />} 
                            label="Payment Methods" 
                            sub="Cards and digital wallets" 
                            onClick={() => setActiveSection('payment')}
                        />
                        <SettingsItem 
                            icon={<Shield />} 
                            label="Security" 
                            sub="Password and 2FA" 
                            onClick={() => setActiveSection('security')}
                        />
                    </SettingsGroup>

                    <SettingsGroup title="Preferences">
                        <SettingsItem 
                            icon={<Bell />} 
                            label="Notifications" 
                            sub="Push, email, and SMS" 
                            onClick={() => setActiveSection('notifications')}
                        />
                        <SettingsItem 
                            icon={<Globe />} 
                            label="Language" 
                            sub="English (US)" 
                            onClick={() => setActiveSection('language')}
                        />
                        <SettingsItem icon={<Moon />} label="Display" sub="Dark mode" toggle />
                    </SettingsGroup>

                    <SettingsGroup title="Support">
                        <SettingsItem 
                            icon={<HelpCircle />} 
                            label="Help Center" 
                            sub="FAQs and guides" 
                            onClick={() => navigate('/customer/tickets')}
                        />
                        <SettingsItem 
                            icon={<Info />} 
                            label="Legal" 
                            sub="Privacy and terms" 
                            onClick={() => setActiveSection('legal')}
                        />
                    </SettingsGroup>
                </div>

                {/* Logout Button */}
                <button 
                    onClick={logout}
                    className="w-full mt-4 flex items-center justify-center gap-3 py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl font-black uppercase tracking-[0.2em] transition-all active:scale-95"
                >
                    <LogOut className="w-5 h-5" /> Sign Out
                </button>

                {/* App Version Info */}
                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] py-8">
                    Lumin Logistics • v2.0.4-production
                </p>
            </main>

            {/* Modals Overlay */}
            <AnimatePresence>
                {activeSection && (
                    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !loading && setActiveSection(null)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-t-[2.5rem] sm:rounded-[2.5rem] border-t sm:border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden p-8 pb-12 sm:pb-8"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black tracking-tight dark:text-white uppercase italic">
                                    {activeSection === 'personal' && "Personal Info"}
                                    {activeSection === 'security' && "Security"}
                                    {activeSection === 'payment' && "Payments"}
                                    {activeSection === 'notifications' && "Notifications"}
                                    {activeSection === 'language' && "Language"}
                                    {activeSection === 'legal' && "Legal Info"}
                                </h2>
                                <button onClick={() => setActiveSection(null)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {successMessage ? (
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center space-y-4">
                                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <p className="font-bold text-slate-900 dark:text-white">{successMessage}</p>
                                </motion.div>
                            ) : (
                                <>
                                    {activeSection === 'personal' && (
                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                                <div className="relative">
                                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input 
                                                        required
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input 
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        placeholder="+1 (555) 000-0000"
                                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                            <button 
                                                type="submit" 
                                                disabled={loading}
                                                className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all"
                                            >
                                                {loading ? "Saving..." : "Update Profile"}
                                            </button>
                                        </form>
                                    )}

                                    {activeSection === 'security' && (
                                        <form onSubmit={handleUpdatePassword} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input 
                                                        required
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        placeholder="••••••••"
                                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Confirm Password</label>
                                                <div className="relative">
                                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <input 
                                                        required
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setNewConfirmPassword(e.target.value)}
                                                        placeholder="••••••••"
                                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                            <button 
                                                type="submit" 
                                                disabled={loading}
                                                className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all"
                                            >
                                                {loading ? "Updating..." : "Secure Account"}
                                            </button>
                                        </form>
                                    )}

                                    {(activeSection === 'payment' || activeSection === 'notifications' || activeSection === 'language' || activeSection === 'legal') && (
                                        <div className="py-12 text-center space-y-4">
                                            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                                                <Info className="w-10 h-10" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="font-bold text-slate-900 dark:text-white">Coming Soon</p>
                                                <p className="text-sm text-slate-500">This feature is currently being optimized for the production environment.</p>
                                            </div>
                                            <button onClick={() => setActiveSection(null)} className="text-primary font-black uppercase tracking-widest text-xs mt-4">Close</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SettingsGroup({ title, children }: { title: string, children: ReactNode }) {
    return (
        <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{title}</h3>
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {children}
                </div>
            </div>
        </div>
    );
}

function SettingsItem({ icon, label, sub, toggle, onClick }: { icon: ReactNode, label: string, sub: string, toggle?: boolean, onClick?: () => void }) {
    return (
        <motion.div 
            whileTap={{ backgroundColor: "rgba(0,0,0,0.02)" }}
            onClick={onClick}
            className="flex items-center justify-between p-4 cursor-pointer group"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                    {React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })}
                </div>
                <div>
                    <p className="text-sm font-black dark:text-white">{label}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{sub}</p>
                </div>
            </div>
            
            {toggle ? (
                <div className="w-10 h-6 bg-primary/20 dark:bg-primary/40 rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-primary rounded-full absolute right-1 top-1"></div>
                </div>
            ) : (
                <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-700 group-hover:text-primary transition-colors" />
            )}
        </motion.div>
    );
}