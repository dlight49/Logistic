import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Shield,
  LogOut,
  ChevronLeft,
  CheckCircle2,
  X,
  Smartphone,
  Info,
  Package,
  Clock,
  Navigation
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import { updatePassword, updateProfile } from "firebase/auth";
import { auth } from "../../services/firebase";
import DriverNav from "../../components/navigation/DriverNav";

type SettingsSection = 'personal' | 'security' | 'stats' | 'legal' | null;

export default function DriverSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SettingsSection>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form States
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [driverStats, setDriverStats] = useState({ active: 0, pending: 0, done: 0 });

  useEffect(() => {
    if (user?.id) {
      apiFetch(`/api/stats/driver/${user.id}`)
        .then(res => res.json())
        .then(data => setDriverStats(data))
        .catch(err => console.error("Failed to fetch driver stats", err));
    }
  }, [user?.id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update backend using the new /me route
      const res = await apiFetch(`/api/users/me`, {
        method: 'PATCH',
        body: JSON.stringify({ name, phone })
      });

      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to update profile");
      }

      // 2. Update Firebase Auth display name
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
        setConfirmPassword("");
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-display relative overflow-hidden pb-32">
      {/* Premium Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-accent/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow" />
      
      {/* App Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black tracking-tight text-white">Driver Profile</h1>
      </header>

      <main className="px-6 pt-6 space-y-8 max-w-lg mx-auto relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent p-1 shadow-2xl relative">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-950">
               <UserIcon className="w-10 h-10 text-primary" />
            </div>
            <button 
              onClick={() => setActiveSection('personal')}
              className="absolute bottom-0 right-0 p-2 bg-primary rounded-full shadow-lg border-2 border-slate-950 text-white active:scale-90 transition-transform"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white italic lowercase">{user?.name}</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{user?.role} • {user?.id?.slice(0, 8)}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Active" value={driverStats.active} color="text-primary" />
          <StatCard label="Pending" value={driverStats.pending} color="text-amber-500" />
          <StatCard label="Done" value={driverStats.done} color="text-emerald-500" />
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          <SettingsGroup title="Personal">
            <SettingsItem 
              icon={<UserIcon />} 
              label="Account Details" 
              sub="Name and phone number" 
              onClick={() => setActiveSection('personal')}
            />
            <SettingsItem 
              icon={<Shield />} 
              label="Security" 
              sub="Updates & passwords" 
              onClick={() => setActiveSection('security')}
            />
          </SettingsGroup>

          <SettingsGroup title="Information">
             <SettingsItem 
              icon={<Info />} 
              label="Legal & Privacy" 
              sub="Terms of service" 
              onClick={() => setActiveSection('legal')}
            />
             <SettingsItem 
              icon={<Package />} 
              label="Performance" 
              sub="Detailed analytics" 
              onClick={() => setActiveSection('stats')}
            />
          </SettingsGroup>
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="w-full mt-4 flex items-center justify-center gap-3 py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-rose-500/10"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>

        <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] py-8">
          Lumin Driver • v.2.1.0
        </p>
      </main>

      {/* Navigation Overlay */}
      <DriverNav />

      {/* Modals Overlay */}
      <AnimatePresence>
        {activeSection && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setActiveSection(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-lg bg-slate-900 rounded-t-[2.5rem] sm:rounded-3xl border-t sm:border border-white/10 shadow-2xl overflow-hidden p-8 pb-12 sm:pb-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                  {activeSection === 'personal' && "Identity"}
                  {activeSection === 'security' && "Vault"}
                  {activeSection === 'stats' && "Metrics"}
                  {activeSection === 'legal' && "Protocol"}
                </h2>
                <button onClick={() => setActiveSection(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {successMessage ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto ring-1 ring-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <p className="font-black uppercase tracking-widest text-white text-sm">{successMessage}</p>
                </motion.div>
              ) : (
                <>
                  {activeSection === 'personal' && (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Fleet Name</label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                          <input 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Comms (Phone)</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                          <input 
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center"
                      >
                        {loading ? <Clock className="w-5 h-5 animate-spin" /> : "Authorize Changes"}
                      </button>
                    </form>
                  )}

                  {activeSection === 'security' && (
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">New Cipher</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                          <input 
                            required
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Verify Cipher</label>
                        <div className="relative">
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                          <input 
                            required
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all text-white"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center"
                      >
                        {loading ? <Clock className="w-5 h-5 animate-spin" /> : "Rotate Keys"}
                      </button>
                    </form>
                  )}

                  {(activeSection === 'stats' || activeSection === 'legal') && (
                    <div className="py-12 text-center space-y-6">
                      <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto rotate-12 ring-1 ring-primary/20">
                        <Info className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-black text-white uppercase tracking-widest italic tracking-tighter">System Link Pending</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-tight px-8">Dispatch protocol is currently restricted. Check back in for local updates.</p>
                      </div>
                      <button onClick={() => setActiveSection(null)} className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mt-4 hover:underline">Close Protocol</button>
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

function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1">
      <p className={cn("text-2xl font-black", color)}>{value}</p>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-2">{title}</h3>
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md shadow-xl">
        <div className="divide-y divide-white/5">
          {children}
        </div>
      </div>
    </div>
  );
}

function SettingsItem({ icon, label, sub, onClick }: { icon: React.ReactNode, label: string, sub: string, onClick?: () => void }) {
  return (
    <motion.div 
      whileTap={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      onClick={onClick}
      className="flex items-center justify-between p-5 cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
          {React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })}
        </div>
        <div>
          <p className="text-sm font-black text-white italic lowercase tracking-tight">{label}</p>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{sub}</p>
        </div>
      </div>
      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 opacity-40 group-hover:opacity-100 transition-all group-hover:bg-primary/20 group-hover:border-primary/20 group-hover:text-primary">
          <ChevronLeft className="w-4 h-4 rotate-180" />
      </div>
    </motion.div>
  );
}
