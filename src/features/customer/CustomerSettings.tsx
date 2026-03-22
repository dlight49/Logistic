import React, { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { 
    User, 
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
    Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "../../utils";
import CustomerNav from "../../components/navigation/CustomerNav";

export default function CustomerSettings(): ReactNode {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
                        <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-white/10 text-primary">
                            <User className="w-4 h-4" />
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
                        <SettingsItem icon={<User />} label="Personal Information" sub="Name, email, and phone" />
                        <SettingsItem icon={<CreditCard />} label="Payment Methods" sub="Cards and digital wallets" />
                        <SettingsItem icon={<Shield />} label="Security" sub="Password and 2FA" />
                    </SettingsGroup>

                    <SettingsGroup title="Preferences">
                        <SettingsItem icon={<Bell />} label="Notifications" sub="Push, email, and SMS" />
                        <SettingsItem icon={<Globe />} label="Language" sub="English (US)" />
                        <SettingsItem icon={<Moon />} label="Display" sub="Dark mode" toggle />
                    </SettingsGroup>

                    <SettingsGroup title="Support">
                        <SettingsItem icon={<HelpCircle />} label="Help Center" sub="FAQs and guides" />
                        <SettingsItem icon={<Info />} label="Legal" sub="Privacy and terms" />
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

            <CustomerNav />
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

function SettingsItem({ icon, label, sub, toggle }: { icon: ReactNode, label: string, sub: string, toggle?: boolean }) {
    return (
        <motion.div 
            whileTap={{ backgroundColor: "rgba(0,0,0,0.02)" }}
            className="flex items-center justify-between p-4 cursor-pointer group"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">
                    {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
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