import { useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  LayoutDashboard,
  Package,
  Users,
  Bell,
  Search,
  Gavel,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Truck,
  MessageSquare,
  MessageCircle,
  FileText,
  TrendingUp,
  MapPin,
  Calendar,
  Filter,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Stats, Shipment } from "../../types";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import AdminNav from "../../components/AdminNav";
import LiveDispatchMap from "../../components/LiveDispatchMap";
import { motion } from "motion/react";

export default function AdminDashboard(): ReactNode {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    apiFetch("/api/stats")
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans relative overflow-hidden pb-32">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* App Header */}
      <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-blue-900/50 border border-white/10">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white leading-tight">Command Center</h1>
            <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em]">{user.name?.split(' ')[0] || "Admin"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/notifications" className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-colors active:scale-95">
            <Bell className="w-5 h-5 text-slate-300" />
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 border-2 border-[#020617]"></span>
            </span>
          </Link>
          <Link to="/admin/settings" className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] shadow-lg active:scale-95 transition-transform">
            <img src={`https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=0D8ABC&color=fff`} className="w-full h-full rounded-full object-cover border-2 border-[#020617]" alt="Profile" />
          </Link>
        </div>
      </header>

      <main className="flex-1 px-5 pt-6 space-y-8 max-w-lg mx-auto w-full z-10">
        
        {/* Horizontal Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
            <QuickAction icon={<Package />} label="Shipments" path="/admin/shipments" color="from-blue-500 to-cyan-500" />
            <QuickAction icon={<Users />} label="Fleet" path="/admin/drivers" color="from-purple-500 to-pink-500" />
            <QuickAction icon={<MessageSquare />} label="Support" path="/admin/support" color="from-emerald-500 to-teal-500" badge={stats?.activeTickets} />
            <QuickAction icon={<MessageCircle />} label="Ops Chat" path="/admin/chat" color="from-fuchsia-500 to-rose-500" />
        </motion.div>

        {/* Global Analytics */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Network Overview</h2>
                <span className="text-[9px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">LIVE</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total Volume" value={stats?.total || 0} icon={<Package className="w-5 h-5 text-blue-400" />} />
              <StatCard label="In Transit" value={stats?.inTransit || 0} icon={<Truck className="w-5 h-5 text-cyan-400" />} />
              <StatCard label="Customs Hold" value={stats?.inCustoms || 0} icon={<Gavel className="w-5 h-5 text-amber-400" />} alert={stats?.inCustoms && stats.inCustoms > 0 ? true : false} />
              <StatCard label="Exceptions" value={stats?.issues || 0} icon={<AlertTriangle className="w-5 h-5 text-rose-400" />} alert={stats?.issues && stats.issues > 0 ? true : false} />
            </div>
        </motion.section>

        {/* Live Dispatch Map */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Global Operations</h2>
            </div>
            
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#020617]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">GPS Sync</span>
                </div>
                <div className="h-[250px] w-full bg-slate-800">
                    <LiveDispatchMap />
                </div>
            </div>
        </motion.section>

        {/* Action Banners */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="space-y-3">
            <Link to="/admin/create" className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-[2rem] hover:bg-blue-600/30 transition-colors active:scale-98">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 shadow-lg shadow-blue-500/40 rounded-2xl flex items-center justify-center text-white">
                        <Plus className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-white text-lg">New Shipment</h3>
                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mt-0.5">Initialize Logistics</p>
                    </div>
                </div>
                <ChevronRight className="text-blue-400" />
            </Link>
        </motion.div>

      </main>

      <AdminNav />
    </div>
  );
}

function QuickAction({ icon, label, path, color, badge }: { icon: ReactNode, label: string, path: string, color: string, badge?: number }) {
    return (
        <Link to={path} className="flex flex-col items-center gap-2 group shrink-0 min-w-[72px]">
            <div className="relative">
                <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl bg-gradient-to-br transition-transform active:scale-90 border border-white/10", color)}>
                    {React.cloneElement(icon as React.ReactElement, { className: "w-7 h-7" })}
                </div>
                {badge ? (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-2 border-[#020617] rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-lg animate-pulse">
                        {badge}
                    </div>
                ) : null}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{label}</span>
        </Link>
    );
}

function StatCard({ label, value, icon, alert }: { label: string, value: number, icon: ReactNode, alert?: boolean }) {
  return (
    <div className={cn(
        "p-4 rounded-[1.5rem] border backdrop-blur-md shadow-lg flex flex-col justify-between min-h-[110px]",
        alert ? "bg-rose-500/10 border-rose-500/20" : "bg-white/5 border-white/10"
    )}>
      <div className="flex justify-between items-start">
        <div className="p-2 bg-[#020617]/50 rounded-xl shadow-inner">
          {icon}
        </div>
      </div>
      <div>
        <h3 className={cn("text-2xl font-black tracking-tighter leading-none mb-1", alert ? "text-rose-400" : "text-white")}>{value}</h3>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
      </div>
    </div>
  );
}
