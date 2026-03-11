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
import AdminNav from "../../components/navigation/AdminNav";
import AssignOperatorModal from "../../components/AssignOperatorModal";
import LiveDispatchMap from "../../components/LiveDispatchMap";
import { motion, AnimatePresence } from "motion/react";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
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

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10 w-full max-w-[1600px] mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Analytics Overview Section */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-5 px-1">
              <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Network Status
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
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
          <motion.section variants={itemVariants} className="relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl shadow-black/50 bg-slate-900/50 backdrop-blur-md">
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

          {/* Filters & Search */}
          <motion.section variants={itemVariants} className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-4 sm:p-5 rounded-3xl flex flex-col gap-4 shadow-xl">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder:text-slate-500 transition-all hover:bg-black/30 outline-none shadow-inner"
                placeholder="Search shipments by ID, Customer Name, or City..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-none pb-1 shrink-0 items-center">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  className="appearance-none pl-9 pr-8 py-3.5 bg-black/20 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wide focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer text-slate-300 transition-all hover:bg-black/40 hover:border-white/20"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="" className="bg-slate-900">All Statuses</option>
                  <option value="Order Created" className="bg-slate-900">Created</option>
                  <option value="In Transit" className="bg-slate-900">In Transit</option>
                  <option value="Held by Customs" className="bg-slate-900">Customs</option>
                  <option value="Delivered" className="bg-slate-900">Delivered</option>
                  <option value="Delayed" className="bg-slate-900">Delayed</option>
                </select>
              </div>

              <select
                className="py-3.5 px-5 bg-black/20 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wide focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer text-slate-300 transition-all hover:bg-black/40 hover:border-white/20"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="" className="bg-slate-900">All Types</option>
                <option value="Standard" className="bg-slate-900">Standard</option>
                <option value="Express" className="bg-slate-900">Express</option>
                <option value="Priority" className="bg-slate-900">Priority</option>
              </select>

              <div className="h-8 w-px bg-white/10 hidden lg:block mx-2"></div>

              <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-2xl p-1 pr-3 hover:bg-black/30 transition-colors">
                <div className="bg-slate-800/50 p-2.5 rounded-xl border border-white/5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="date"
                  className="bg-transparent border-none text-xs font-bold uppercase text-slate-300 focus:ring-0 outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
                <span className="text-slate-500 font-bold">-</span>
                <input
                  type="date"
                  className="bg-transparent border-none text-xs font-bold uppercase text-slate-300 focus:ring-0 outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </motion.section>

          {/* Shipments List */}
          <motion.section variants={itemVariants} className="bg-slate-900/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="p-5 sm:px-8 sm:py-6 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
              <div>
                <h3 className="font-extrabold text-xl text-white tracking-tight">Active Shipments</h3>
                <p className="text-sm text-slate-400 mt-1 font-medium">{filteredShipments.length} shipments found</p>
              </div>
              <Link to="/admin/create" className="group relative">
                <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 border border-white/20 transition-transform active:scale-95 shadow-lg">
                  <Plus className="w-5 h-5" /> <span className="hidden sm:inline">New Shipment</span>
                </div>
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              <div className="hidden sm:grid grid-cols-12 gap-4 px-8 py-4 bg-black/20 text-xs font-black uppercase tracking-[0.1em] text-slate-500 border-b border-white/5 sticky top-0 backdrop-blur-md z-10">
                <div className="col-span-3">Tracking Reference</div>
                <div className="col-span-3">Destination</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              <AnimatePresence>
                {filteredShipments.map((s, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    key={s.id}
                    className="p-5 sm:px-8 flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:items-center hover:bg-white/5 transition-colors group cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>

                    {/* Col 1 */}
                    <div className="flex items-start gap-4 col-span-3">
                      <div className="bg-slate-800/80 p-3 rounded-2xl border border-white/10 shrink-0 group-hover:bg-blue-900/30 group-hover:border-blue-500/30 transition-colors shadow-inner">
                        <Package className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-200 group-hover:text-white transition-colors truncate">{s.id}</p>
                        <p className="text-[10px] font-black text-slate-400 group-hover:text-blue-400 uppercase tracking-widest mt-1.5 bg-black/30 inline-block px-2.5 py-1 rounded-md border border-white/5">{s.type}</p>
                      </div>
                    </div>

                    {/* Col 2 */}
                    <div className="col-span-3 hidden sm:block">
                      <p className="text-sm font-bold text-slate-300 truncate">{s.receiver_name}</p>
                      <p className="text-xs font-medium text-slate-500 truncate flex items-center gap-1.5 mt-1.5">
                        <MapPin className="w-3 h-3 text-slate-600" /> {s.receiver_city}, {s.receiver_country}
                      </p>
                    </div>

                    {/* Col 3 */}
                    <div className="col-span-2 hidden sm:block">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {new Date(s.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    {/* Col 4 */}
                    <div className="col-span-2">
                      <span className={cn(
                        "text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border flex items-center gap-2 w-max shadow-sm",
                        s.status === 'Delivered' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20" :
                          s.status === 'Held by Customs' ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-900/20" :
                            s.status === 'In Transit' ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-900/20" :
                              "bg-slate-800 text-slate-300 border-slate-700"
                      )}>
                        {s.status === 'Delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {s.status === 'Held by Customs' && <Gavel className="w-3.5 h-3.5" />}
                        {s.status === 'In Transit' && <Truck className="w-3.5 h-3.5" />}
                        {s.status === 'Order Created' && <Package className="w-3.5 h-3.5" />}
                        {s.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-3 mt-3 sm:mt-0">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setAssigningShipmentId(s.id);
                        }}
                        className="text-xs font-bold bg-slate-800/80 hover:bg-slate-700 border border-white/10 px-4 py-2.5 rounded-xl hover:border-blue-500/50 hover:text-white text-slate-300 transition-all flex items-center gap-2 shadow-lg"
                      >
                        <Users className="w-4 h-4" /> <span className="hidden lg:inline">Assign</span>
                      </button>
                      <Link
                        to={`/admin/shipment/${s.id}`}
                        className="text-xs font-bold bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredShipments.length === 0 && (
                <div className="p-20 text-center text-slate-400 text-sm">
                  <div className="bg-slate-800/50 w-20 h-20 rounded-3xl border border-white/5 flex items-center justify-center mx-auto mb-5 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                    <Search className="w-8 h-8 opacity-50 text-blue-400" />
                  </div>
                  <p className="font-extrabold text-xl text-white mb-2 tracking-tight">No shipments found</p>
                  <p className="font-medium text-slate-500 max-w-sm mx-auto">We couldn't find anything matching your current filters. Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          </motion.section>
        </motion.div>
      </main>

      {assigningShipmentId && (
        <AssignOperatorModal
          shipmentId={assigningShipmentId}
          currentOperatorId={shipments.find(s => s.id === assigningShipmentId)?.operator_id}
          onClose={() => setAssigningShipmentId(null)}
          onAssign={() => fetchShipments()}
        />
      )}

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
