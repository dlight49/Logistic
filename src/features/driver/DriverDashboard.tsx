import { useState, useEffect } from "react";
import { 
  Truck, 
  Package, 
  MapPin, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Bell,
  Menu,
  Clock,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { Shipment } from "@/src/types";
import { cn } from "@/src/utils";

export default function DriverDashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [stats, setStats] = useState({ active: 0, pending: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user.id) return;
    
    setLoading(true);
    Promise.all([
      fetch(`/api/shipments?operator_id=${user.id}`).then(res => res.json()),
      fetch(`/api/stats/driver/${user.id}`).then(res => res.json())
    ]).then(([shipmentData, statData]) => {
      setShipments(shipmentData);
      setStats(statData);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to fetch driver data", err);
      setLoading(false);
    });
  }, [user.id]);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
        <div className="flex size-12 shrink-0 items-center justify-start text-primary dark:text-slate-100">
          <Menu className="w-6 h-6" />
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold leading-tight tracking-tight">Driver Dashboard</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.name || "Driver"}</p>
        </div>
        <div className="flex w-12 items-center justify-end">
          <button className="relative flex items-center justify-center rounded-lg h-10 w-10 bg-transparent text-primary dark:text-slate-100">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-accent"></span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="grid grid-cols-3 gap-3 p-4">
          <DriverStat label="Active" value={stats.active.toString().padStart(2, '0')} trend={<TrendingUp className="w-3 h-3" />} trendValue="+2%" trendColor="text-emerald-500" />
          <DriverStat label="Pending" value={stats.pending.toString().padStart(2, '0')} trend={<Minus className="w-3 h-3" />} trendValue="0%" trendColor="text-slate-400" />
          <DriverStat label="Done" value={stats.done.toString().padStart(2, '0')} trend={<TrendingDown className="w-3 h-3" />} trendValue="-5%" trendColor="text-accent" />
        </div>

        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Assigned Shipments</h2>
          <button className="text-primary dark:text-slate-300 text-sm font-semibold flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 font-medium">Loading your route...</p>
            </div>
          ) : shipments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
              <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-full mb-4">
                <Truck className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold">No Shipments Assigned</h3>
              <p className="text-sm text-slate-500 mt-1">You don't have any active shipments at the moment. Contact dispatch if this is an error.</p>
            </div>
          ) : (
            shipments.map(s => (
              <div key={s.id} className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative h-32 w-full bg-slate-200 dark:bg-primary/20 overflow-hidden">
                  <img src={`https://picsum.photos/seed/${s.id}/400/200`} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-50" alt="Route" />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-accent text-white text-xs font-bold rounded-full uppercase">
                    {s.status}
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-primary dark:text-slate-100">{s.id}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {s.receiver_city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium">ETA</p>
                      <p className="text-sm font-bold text-primary dark:text-slate-200">{s.est_delivery}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-500">{s.type}</span>
                    </div>
                    <Link to={`/driver/shipment/${s.id}`} className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
                      Update Status
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pb-6 pt-2">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          <Link to="/driver" className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[28px] fill-1">home</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
          </Link>
          <Link to="/driver" className="flex flex-col items-center gap-1 text-slate-400">
            <Truck className="w-7 h-7" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Shipments</span>
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <LogOut className="w-7 h-7" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function DriverStat({ label, value, trend, trendValue, trendColor }: any) {
  return (
    <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="text-primary dark:text-slate-100 text-2xl font-bold">{value}</p>
      <div className={cn("flex items-center gap-1 text-xs font-bold", trendColor)}>
        {trend}
        <span>{trendValue}</span>
      </div>
    </div>
  );
}
