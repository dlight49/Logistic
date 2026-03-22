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
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { Stats, Shipment } from "../../types";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import AdminNav from "../../components/AdminNav";
import AssignOperatorModal from "../../components/AssignOperatorModal";
import LiveDispatchMap from "../../components/LiveDispatchMap";
import { motion, AnimatePresence } from "motion/react";

// Animation Variants
const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  }
};

export default function AdminDashboard(): ReactNode {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterSenderCountry, setFilterSenderCountry] = useState<string>("");
  const [filterReceiverCountry, setFilterReceiverCountry] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [assigningShipmentId, setAssigningShipmentId] = useState<string | null>(null);

  const fetchShipments = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterStatus) params.append("status", filterStatus);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (filterSenderCountry) params.append("sender_country", filterSenderCountry);
    if (filterReceiverCountry) params.append("receiver_country", filterReceiverCountry);
    if (filterType) params.append("type", filterType);

    apiFetch(`/api/shipments?${params.toString()}`)
      .then(res => res.json())
      .then(setShipments)
      .catch(console.error);
  }, [filterStatus, startDate, endDate, filterSenderCountry, filterReceiverCountry, filterType]);

  useEffect(() => {
    apiFetch("/api/stats")
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const filteredShipments = shipments.filter(s => {
    const query = searchQuery.toLowerCase();
    return (s.id || "").toLowerCase().includes(query) ||
      (s.receiver_name || "").toLowerCase().includes(query) ||
      (s.receiver_city || "").toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#020817] text-slate-100 font-sans relative overflow-hidden pb-32 selection:bg-primary/30">
      {/* Animated Ambient Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#020817]/60 backdrop-blur-2xl px-4 sm:px-6 py-4 flex items-center justify-between shadow-lg shadow-black/20">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-4"
        >
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-xl blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-tr from-blue-600 to-cyan-500 p-2.5 rounded-xl text-white shadow-xl shadow-blue-900/50 border border-white/20">
              <LayoutDashboard className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400">
              Global Logistics
            </h1>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mt-0.5">
              {user.name || "Administrator"} <span className="text-slate-500 ml-1">• Command Center</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-5"
        >
          <Link to="/admin/notifications" className="relative p-2.5 bg-slate-800/50 hover:bg-slate-700/80 rounded-full border border-slate-700/50 transition-all hover:scale-105 active:scale-95 group">
            <Bell className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 border-2 border-[#020817]"></span>
            </span>
          </Link>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-purple-900/20">
            <img src="https://picsum.photos/seed/admin/100/100" referrerPolicy="no-referrer" alt="Admin" className="w-full h-full object-cover rounded-full border-2 border-[#020817]" />
          </div>
        </motion.div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10 w-full max-w-[1600px] mx-auto pb-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 sm:space-y-8"
        >
          {/* Analytics Overview Section */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-4 sm:mb-5 px-1">
              <h2 className="text-[10px] sm:text-sm font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 h-4 text-blue-500" />
                Network Status
              </h2>
            </div>
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
              <StatCard label="Total Volume" value={stats?.total || 0} icon={<Package className="text-blue-400" />} gradient="from-blue-500/10 to-blue-500/5" border="border-blue-500/20" />
              <StatCard label="In Transit" value={stats?.inTransit || 0} icon={<Truck className="text-cyan-400" />} gradient="from-cyan-500/10 to-cyan-500/5" border="border-cyan-500/20" />
              <StatCard label="Customs Hold" value={stats?.inCustoms || 0} icon={<Gavel className="text-amber-400" />} gradient="from-amber-500/10 to-amber-500/5" border="border-amber-500/20" color="text-amber-400" />
              <StatCard label="Exceptions" value={stats?.issues || 0} icon={<AlertTriangle className="text-rose-400" />} gradient="from-rose-500/10 to-rose-500/5" border="border-rose-500/20" color="text-rose-400" />
              <Link to="/admin/support" className="contents">
                <StatCard label="Support" value={stats?.activeTickets || 0} icon={<MessageSquare className="text-indigo-400" />} gradient="from-indigo-500/10 to-indigo-500/5" border="border-indigo-500/20" color="text-indigo-400" />
              </Link>
              <Link to="/admin/chat" className="contents">
                <StatCard label="Fleet Ops" value={stats?.fleetMessages || 0} icon={<MessageCircle className="text-fuchsia-400" />} gradient="from-fuchsia-500/10 to-fuchsia-500/5" border="border-fuchsia-500/20" color="text-fuchsia-400" />
              </Link>
              <Link to="/admin/quotes" className="contents">
                <StatCard label="Quotes" value={stats?.quotes || 0} icon={<FileText className="text-pink-400" />} gradient="from-pink-500/10 to-pink-500/5" border="border-pink-500/20" color="text-pink-400" />
              </Link>
            </div>
          </motion.section>

          {/* Live Dispatch Map */}
          <motion.section variants={itemVariants} className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/5 shadow-2xl shadow-black/50 bg-slate-900/50 backdrop-blur-md">
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2 drop-shadow-md">
                <MapPin className="w-4 h-4 text-blue-400" /> Live Global Operations
              </h3>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider drop-shadow-md">Live Sync</span>
              </div>
            </div>
            <div className="h-[220px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full relative">
              <LiveDispatchMap />
            </div>
          </motion.section>

          {/* Filters & Search - Removed, logic lives in ShipmentRegistry.tsx */}
        </motion.div>
      </main>

      <AdminNav />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  trend?: string;
  icon: ReactNode;
  color?: string;
  gradient?: string;
  border?: string;
}

function StatCard({ label, value, trend, icon, color = "text-white", gradient = "from-slate-800/50 to-slate-800/20", border = "border-white/10" }: StatCardProps): ReactNode {
  return (
    <div className={`relative p-5 rounded-3xl overflow-hidden border ${border} bg-gradient-to-br ${gradient} backdrop-blur-md shadow-lg shadow-black/20 hover:scale-105 transition-transform duration-300 group cursor-pointer`}>
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl bg-black/30 border border-white/5 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm">
            {trend}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <h3 className={cn("text-3xl lg:text-4xl font-black tracking-tighter mb-1 font-mono", color)}>{value}</h3>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
      </div>
    </div>
  );
}
