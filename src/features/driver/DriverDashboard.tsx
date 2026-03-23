import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  Truck,
  Package,
  MapPin,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Navigation,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, Variants } from "motion/react";
import { Shipment } from "../../types";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";

import { useDriverTracking } from "../../hooks/useDriverTracking";
import { useShipmentActions } from "../../hooks/useShipmentActions";
import DriverNav from "../../components/navigation/DriverNav";
import { ShiftControls } from "./ShiftControls";

export default function DriverDashboard(): ReactNode {
  const { user, logout } = useAuth();
  const { updating, handleStatusUpdate, handleNavigate } = useShipmentActions();
  useDriverTracking(); // Start real-time GPS sync
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [stats, setStats] = useState({ active: 0, pending: 0, done: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    if (!user?.id) return;

    setLoading(true);
    Promise.all([
      apiFetch(`/api/shipments?operator_id=${user.id}`).then(res => res.json()),
      apiFetch(`/api/stats/driver/${user.id}`).then(res => res.json()),
    ]).then(([shipmentData, statData]) => {
      setShipments(shipmentData);
      setStats(statData);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to fetch driver data", err);
      setLoading(false);
    });
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (id: string, status: string, city: string) => {
    const ok = await handleStatusUpdate(id, status, city);
    if (ok) {
        fetchData(); // Refresh list to show new status
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as const }
  };

  return (
    <div className="bg-slate-950 font-display text-slate-100 min-h-screen flex flex-col relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-accent/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

      <DriverNav />

      <main className="flex-1 overflow-y-auto pb-28 relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-4 space-y-6">
          <ShiftControls />
          <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            <DriverStat
              label="Orders"
              value={stats.active.toString().padStart(2, '0')}
              trend={<TrendingUp className="w-3 h-3" />}
              trendValue="+12%"
              trendColor="text-primary"
              glow="bg-primary/10"
            />
            <DriverStat label="Delivered" value={stats.pending.toString().padStart(2, '0')} trend={<TrendingUp className="w-3 h-3" />} trendValue="+8%" trendColor="text-emerald-500" glow="bg-emerald-500/10" />
            <div className="col-span-2 lg:col-span-1">
              <DriverStat label="Done" value={stats.done.toString().padStart(2, '0')} trend={<TrendingDown className="w-3 h-3" />} trendValue="-5%" trendColor="text-accent" glow="bg-accent/10" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-white">Assigned Routes</h2>
            <Link 
              to="/driver/routes" 
              className="text-primary text-sm font-bold flex items-center gap-1 hover:text-primary/80 transition-colors active:scale-95 p-2"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 font-medium animate-pulse">Syncing routes...</p>
              </div>
            ) : shipments.length === 0 ? (
              <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-20 text-center px-6 glass-panel rounded-3xl border border-dashed border-white/20">
                <div className="bg-white/5 p-4 rounded-full mb-4 ring-1 ring-white/10">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-white">No Routes Assigned</h3>
                <p className="text-sm text-slate-400 mt-2">You don't have any active shipments at the moment. Contact dispatch if this is an error.</p>
              </motion.div>
            ) : (
              shipments.map((s) => (
                <motion.div key={s.id} variants={itemVariants} className="group flex flex-col rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-primary/30 transition-all duration-300">
                  <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${s.id}/400/200`} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500" alt="Route Map" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-background-dark/80 backdrop-blur-md text-accent text-xs font-black tracking-wider rounded-lg border border-accent/20 uppercase shadow-lg">
                      {s.status}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-4 relative z-10 -mt-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-extrabold text-white tracking-tight">{s.id}</h3>
                        <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-1">
                          <MapPin className="w-4 h-4 text-primary" /> {s.receiver_city}
                        </p>
                      </div>
                      <div className="text-right glass-panel bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">ETA</p>
                        <p className="text-sm font-bold text-white leading-none">{s.est_delivery}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <Package className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-300">{s.type}</span>
                      </div>
                      <div className="flex flex-col gap-3 w-full">
                        {(s.status === "Assigned" || s.status === "In Transit") && (
                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => handleNavigate(s.receiver_address)}
                              aria-label="Navigate to destination"
                              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl border border-white/10 transition-all text-xs font-bold active:scale-95"
                            >
                              <Navigation className="w-4 h-4 text-primary" /> Navigate
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(s.id, "Delivered", s.receiver_city)}
                              disabled={updating === s.id}
                              aria-label="Confirm delivery"
                              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl border border-white/10 transition-all text-xs font-bold disabled:opacity-50 active:scale-95"
                            >
                              {updating === s.id ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              )}
                              Delivered
                            </button>
                          </div>
                        )}
                        <Link to={`/driver/shipment/${s.id}`} className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                          <Package className="w-4 h-4" /> Full Details & Scan
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>


    </div>
  );
}

interface DriverStatProps {
  label: string;
  value: string;
  trend: ReactNode;
  trendValue: string;
  trendColor: string;
  glow?: string;
}

function DriverStat({ label, value, trend, trendValue, trendColor, glow }: DriverStatProps): ReactNode {
  return (
    <div className="relative flex flex-col gap-2 rounded-2xl p-4 glass-panel border border-white/10 overflow-hidden group h-full">
      <div className={cn("absolute -inset-4 blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500", glow)}></div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-white text-3xl font-black">{value}</p>
        <div className={cn("flex items-center gap-1 text-[10px] font-bold mt-2 bg-white/5 w-fit px-2 py-1 rounded-md border border-white/5", trendColor)}>
          {trend}
          <span>{trendValue}</span>
        </div>
      </div>
    </div>
  );
}
