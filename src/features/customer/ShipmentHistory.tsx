import React, { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { Package, Search, History, Filter, ChevronLeft, MapPin, Calendar, CheckCircle2, Clock, AlertTriangle, ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";

export default function ShipmentHistory(): ReactNode {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [shipments, setShipments] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");

    React.useEffect(() => {
        if (!user) return;
        apiFetch(`/api/shipments/me`)
            .then(res => res.json())
            .then(data => {
                setShipments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch history:", err);
                setLoading(false);
            });
    }, [user]);

    const filtered = shipments.filter(s => 
        (s.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.receiver_city || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <h1 className="text-xl font-black tracking-tight dark:text-white">Shipping History</h1>
            </header>

            <main className="px-6 pt-6 space-y-6 max-w-lg mx-auto">
                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search ID or Destination..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                {/* History List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Accessing Archives...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-slate-300 dark:text-slate-700">
                                <History className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-black dark:text-white uppercase tracking-widest">No History Yet</p>
                                <p className="text-xs font-medium text-slate-500 max-w-[200px] mx-auto">Your completed shipments will appear here once processed.</p>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filtered.map((s, idx) => (
                                <HistoryAppCard key={s.id} shipment={s} index={idx} />
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </main>
        </div>
    );
}

function HistoryAppCard({ shipment, index }: { shipment: any, index: number }) {
    const isDelivered = shipment.status === "Delivered";
    const isError = shipment.status === "Held by Customs" || shipment.status === "Delayed";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
            className="p-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner transition-transform group-hover:scale-110",
                    isDelivered ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                    isError ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                    "bg-blue-500/10 border-blue-500/20 text-blue-500"
                )}>
                    {isDelivered ? <CheckCircle2 className="w-6 h-6" /> :
                     isError ? <AlertTriangle className="w-6 h-6" /> :
                     <Package className="w-6 h-6" />}
                </div>
                <div className="min-w-0">
                    <h4 className="text-sm font-black dark:text-white truncate">{shipment.id}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {shipment.receiver_city?.split(',')[0]}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {new Date(shipment.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            <Link 
                to={`/track?id=${shipment.id}`}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors"
            >
                <ArrowUpRight className="w-5 h-5" />
            </Link>
        </motion.div>
    );
}