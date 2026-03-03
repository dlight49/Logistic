import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  Gavel,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ChevronRight,
  Truck
} from "lucide-react";
import { Link } from "react-router-dom";
import { Stats, Shipment } from "@/src/types";
import { cn } from "@/src/utils";
import AdminNav from "@/src/components/AdminNav";
import AssignOperatorModal from "@/src/components/AssignOperatorModal";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSenderCountry, setFilterSenderCountry] = useState("");
  const [filterReceiverCountry, setFilterReceiverCountry] = useState("");
  const [filterType, setFilterType] = useState("");
  const [assigningShipmentId, setAssigningShipmentId] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch("/api/stats").then(res => res.json()).then(setStats);
    fetchShipments();
  }, [filterStatus, startDate, endDate, filterSenderCountry, filterReceiverCountry, filterType]);

  const fetchShipments = async () => {
    const params = new URLSearchParams();
    if (filterStatus) params.append("status", filterStatus);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (filterSenderCountry) params.append("sender_country", filterSenderCountry);
    if (filterReceiverCountry) params.append("receiver_country", filterReceiverCountry);
    if (filterType) params.append("type", filterType);

    fetch(`/api/shipments?${params.toString()}`)
      .then(res => res.json())
      .then(setShipments);
  };

  const filteredShipments = shipments.filter(s =>
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.receiver_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.receiver_city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-sans relative overflow-hidden pb-20">

      {/* Background Decorators */}
      <div className="absolute top-0 right-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-20 border-b border-white/20 dark:border-slate-800/50 bg-background-light/70 dark:bg-background-dark/70 backdrop-blur-xl px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-tr from-primary to-primary-light p-2.5 rounded-xl shadow-lg shadow-primary/20">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight text-slate-900 dark:text-white">Global Logistics</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">{user.name || "Administrator"} • Command Center</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin/notifications" className="p-2.5 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 rounded-full relative backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-colors">
            <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent border-2 border-background-light dark:border-background-dark"></span>
            </span>
          </Link>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent border-2 border-white dark:border-slate-800 overflow-hidden shadow-md cursor-pointer hover:opacity-90 transition-opacity">
            <img src="https://picsum.photos/seed/admin/100/100" referrerPolicy="no-referrer" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 z-10 max-w-7xl mx-auto w-full">

        {/* Analytics Overview Section */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 px-1">Network Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <StatCard label="Total Volume" value={stats?.total || 0} icon={<Package className="text-primary-light" />} />
            <StatCard label="In Transit" value={stats?.inTransit || 0} icon={<Truck className="text-accent" />} />
            <StatCard label="Customs Hold" value={stats?.inCustoms || 0} icon={<Gavel className="text-amber-500" />} color="text-amber-500" />
            <StatCard label="Exceptions" value={stats?.issues || 0} icon={<AlertTriangle className="text-rose-500" />} color="text-rose-500" />
          </div>
        </section>

        {/* Filters & Search */}
        <section className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              className="w-full pl-12 pr-4 py-3 glass-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
              placeholder="Search by ID, Customer Name, or City..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide shrink-0 items-center">
            <select
              className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase px-4 py-3 focus:ring-2 focus:ring-primary outline-none cursor-pointer text-slate-700 dark:text-slate-300 transition-colors hover:bg-white dark:hover:bg-slate-800"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Order Created">Created</option>
              <option value="In Transit">In Transit</option>
              <option value="Held by Customs">Customs</option>
              <option value="Delivered">Delivered</option>
              <option value="Delayed">Delayed</option>
            </select>
            <select
              className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase px-4 py-3 focus:ring-2 focus:ring-primary outline-none cursor-pointer text-slate-700 dark:text-slate-300 transition-colors hover:bg-white dark:hover:bg-slate-800"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
              <option value="Priority">Priority</option>
            </select>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden lg:block mx-1"></div>
            <input
              type="date"
              className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase px-4 py-3 focus:ring-2 focus:ring-primary outline-none cursor-pointer text-slate-700 dark:text-slate-300 transition-colors hover:bg-white dark:hover:bg-slate-800"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <span className="text-slate-400 font-bold">-</span>
            <input
              type="date"
              className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase px-4 py-3 focus:ring-2 focus:ring-primary outline-none cursor-pointer text-slate-700 dark:text-slate-300 transition-colors hover:bg-white dark:hover:bg-slate-800"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </section>

        {/* Shipments List */}
        <section className="glass-panel rounded-2xl overflow-hidden shadow-xl shadow-black/5 dark:shadow-black/20">
          <div className="p-5 sm:px-6 sm:py-5 border-b border-slate-200/50 dark:border-white/10 flex items-center justify-between bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Active Shipments</h3>
            <Link to="/admin/create" className="bg-gradient-to-r from-primary to-primary-light text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Shipment</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-100/50 dark:divide-slate-800/50 bg-white/20 dark:bg-slate-900/10 backdrop-blur-sm">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/50 dark:bg-slate-900/30 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <div className="col-span-3">Tracking Details</div>
              <div className="col-span-3">Destination</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {filteredShipments.map(s => (
              <div key={s.id} className="p-5 sm:px-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:items-center hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Mobile Header / Desktop Col 1 */}
                <Link to={`/admin/shipment/${s.id}`} className="flex items-start gap-4 col-span-3">
                  <div className="bg-primary/10 dark:bg-primary-light/10 p-2.5 rounded-xl border border-primary/20 shrink-0">
                    <Package className="w-5 h-5 text-primary dark:text-primary-light" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{s.id}</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1 bg-slate-100 dark:bg-slate-800 inline-block px-2 py-0.5 rounded">{s.type}</p>
                  </div>
                </Link>

                {/* Col 2 */}
                <div className="col-span-3 hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{s.receiver_name}</p>
                  <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span> {s.receiver_city}, {s.receiver_country}
                  </p>
                </div>

                {/* Col 3 */}
                <div className="col-span-2 hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{new Date(s.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>

                {/* Col 4 */}
                <div className="col-span-2">
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-1.5 rounded-full uppercase tracking-wider border flex items-center gap-1.5 w-max",
                    s.status === 'Delivered' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" :
                      s.status === 'Held by Customs' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" :
                        s.status === 'In Transit' ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" :
                          "bg-primary/10 text-primary dark:text-primary-light border-primary/20"
                  )}>
                    {s.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                    {s.status === 'Held by Customs' && <Gavel className="w-3 h-3" />}
                    {s.status === 'In Transit' && <Truck className="w-3 h-3" />}
                    {s.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAssigningShipmentId(s.id);
                    }}
                    className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Users className="w-3.5 h-3.5" /> <span className="hidden lg:inline">Assign</span>
                  </button>
                  <Link
                    to={`/admin/shipment/${s.id}`}
                    className="text-xs font-bold bg-slate-100 dark:bg-slate-700/50 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white px-3 py-2 rounded-xl transition-colors shadow-sm text-slate-700 dark:text-slate-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
            {filteredShipments.length === 0 && (
              <div className="p-16 text-center text-slate-500 dark:text-slate-400 text-sm">
                <div className="bg-slate-100 dark:bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 opacity-50" />
                </div>
                <p className="font-bold text-lg text-slate-900 dark:text-white mb-1">No shipments found</p>
                <p>Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </section>
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

function StatCard({ label, value, trend, icon, color = "text-slate-900 dark:text-white" }: any) {
  return (
    <div className="glass-panel p-5 rounded-2xl hover:-translate-y-1 transition-transform duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300",
          color === "text-amber-500" ? "bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/10" :
            color === "text-rose-500" ? "bg-rose-500/10 border-rose-500/20 dark:bg-rose-500/10" : ""
        )}>
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className={cn("text-3xl font-extrabold tracking-tight mb-1", color)}>{value}</h3>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}
