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
  ChevronRight
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
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark pb-20">
      <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <LayoutDashboard className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Global Logistics</h1>
            <p className="text-xs text-slate-500">Admin Command Center</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/notifications" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full relative">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </Link>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-orange-600 border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
            <img src="https://picsum.photos/seed/admin/100/100" referrerPolicy="no-referrer" alt="Admin" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="Search shipments, IDs, or customers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <select 
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-[10px] font-bold uppercase px-3 py-1.5 focus:ring-1 focus:ring-primary"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">Status</option>
              <option value="Order Created">Created</option>
              <option value="In Transit">In Transit</option>
              <option value="Held by Customs">Customs</option>
              <option value="Delivered">Delivered</option>
              <option value="Delayed">Delayed</option>
            </select>
            <select 
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-[10px] font-bold uppercase px-3 py-1.5 focus:ring-1 focus:ring-primary"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="">Type</option>
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
              <option value="Priority">Priority</option>
            </select>
            <select 
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-[10px] font-bold uppercase px-3 py-1.5 focus:ring-1 focus:ring-primary"
              value={filterSenderCountry}
              onChange={e => setFilterSenderCountry(e.target.value)}
            >
              <option value="">From</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Germany">Germany</option>
              <option value="China">China</option>
            </select>
            <select 
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-[10px] font-bold uppercase px-3 py-1.5 focus:ring-1 focus:ring-primary"
              value={filterReceiverCountry}
              onChange={e => setFilterReceiverCountry(e.target.value)}
            >
              <option value="">To</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Germany">Germany</option>
              <option value="China">China</option>
            </select>
            <input 
              type="date" 
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-[10px] font-bold uppercase px-3 py-1.5 focus:ring-1 focus:ring-primary"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <input 
              type="date" 
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-[10px] font-bold uppercase px-3 py-1.5 focus:ring-1 focus:ring-primary"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Shipments" value={stats?.total || 0} trend="+12%" />
          <StatCard label="In Transit" value={stats?.inTransit || 0} icon={<Package className="text-primary" />} />
          <StatCard label="In Customs" value={stats?.inCustoms || 0} icon={<Gavel className="text-amber-500" />} color="text-amber-500" />
          <StatCard label="Issues" value={stats?.issues || 0} icon={<AlertTriangle className="text-rose-500" />} color="text-rose-500" />
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold">Shipments</h3>
            <Link to="/admin/create" className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
              <Plus className="w-3 h-3" /> New Shipment
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredShipments.map(s => (
              <div key={s.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <Link to={`/admin/shipment/${s.id}`} className="flex items-center gap-3 flex-1">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{s.id}</p>
                    <p className="text-xs text-slate-500">{s.receiver_name} • {s.receiver_city}</p>
                  </div>
                </Link>
                <div className="text-right flex items-center gap-3">
                  <div className="hidden group-hover:block transition-all">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setAssigningShipmentId(s.id);
                      }}
                      className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Users className="w-3 h-3" /> Assign
                    </button>
                  </div>
                  <div>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                      s.status === 'Delivered' ? "bg-emerald-500/10 text-emerald-500" : 
                      s.status === 'Held by Customs' ? "bg-amber-500/10 text-amber-500" :
                      "bg-primary/10 text-primary"
                    )}>
                      {s.status}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">{new Date(s.created_at).toLocaleDateString()}</p>
                  </div>
                  <Link to={`/admin/shipment/${s.id}`}>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </Link>
                </div>
              </div>
            ))}
            {filteredShipments.length === 0 && (
              <div className="p-10 text-center text-slate-400 italic text-sm">
                No shipments found matching filters
              </div>
            )}
          </div>
        </div>
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

function StatCard({ label, value, trend, icon, color = "text-slate-900 dark:text-slate-100" }: any) {
  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <h3 className={cn("text-xl font-bold", color)}>{value}</h3>
        {trend ? (
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">{trend}</span>
        ) : icon}
      </div>
    </div>
  );
}
