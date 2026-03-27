import React, { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { Package, Search, Clock, CheckCircle2, MapPin, Settings, Bell, User, MessageSquare, ChevronRight, History } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import { DashboardSkeleton } from "../../components/Skeleton";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function CustomerDashboard(): ReactNode {
    const { user } = useAuth();
    const [shipments, setShipments] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!user) return;

        apiFetch(`/api/shipments/me`)
            .then(res => res.json())
            .then(data => {
                setShipments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load user shipments:", err);
                setLoading(false);
            });
    }, [user]);

    const activeShipments = shipments.filter(s => s.status !== "Delivered");
    const totalShipped = shipments.length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans pb-32">
            {/* Mobile App Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                        <Package className="text-white w-5 h-5" />
                    </div>
                    <span className="font-black text-lg tracking-tighter uppercase italic dark:text-white">Lumin</span>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        aria-label="View notifications"
                        className="p-3 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 active:scale-95 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                        <Bell className="w-5 h-5" />
                    </button>
                    <Link to="/customer/settings" aria-label="Profile settings" className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px] shadow-lg active:scale-95 transition-transform">
                        <img src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=0D8ABC&color=fff`} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-[#020617]" alt="Profile" />
                    </Link>
                </div>
            </header>

            <main className="px-6 pt-6 space-y-8 max-w-lg mx-auto">
                {/* Greeting & Quick Actions */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Welcome Back</p>
                        <h1 className="text-3xl font-black tracking-tight dark:text-white">{user?.name?.split(' ')[0] || "Guest"}</h1>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <QuickAction icon={<Search />} label="Track" path="/track" color="bg-blue-500" />
                        <QuickAction icon={<History />} label="History" path="/customer/history" color="bg-orange-500" />
                        <QuickAction icon={<MessageSquare />} label="Support" path="/customer/tickets" color="bg-emerald-500" />
                    </div>
                </motion.div>

                {/* Horizontal Stats Row */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1 -mx-1">
                    <StatBox label="Total Shipments" value={totalShipped} sub="Overall activity" />
                    <StatBox label="In Transit" value={activeShipments.length} sub="Pending arrival" />
                </motion.div>

                {/* Active Shipments Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Active Shipments</h2>
                        {activeShipments.length > 0 && <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">LIVE</span>}
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <DashboardSkeleton />
                        ) : activeShipments.length === 0 ? (
                            <div className="py-12 text-center bg-white dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/5 shadow-inner">
                                <Package className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                <p className="text-sm font-bold text-slate-500">All systems clear. No active shipments.</p>
                            </div>
                        ) : activeShipments.map((s, idx) => (
                            <ShipmentAppCard key={s.id} shipment={s} index={idx} />
                        ))}
                    </div>
                </section>

                {/* Promotional / Help Card */}
                <Link 
                    to="/customer/tickets"
                    className="block p-6 rounded-[2.5rem] bg-gradient-to-br from-primary to-accent text-white shadow-xl shadow-primary/20 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
                >
                    <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="space-y-2">
                            <h3 className="text-xl font-black italic tracking-tighter uppercase">Support Line</h3>
                            <p className="text-xs font-bold text-blue-100 max-w-[180px]">Have questions about your shipment? Talk to our logistics team.</p>
                        </div>
                        <div className="bg-white/20 p-3 rounded-2xl border border-white/20">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                    </div>
                </Link>
            </main>
        </div>
    );
}

function QuickAction({ icon, label, path, color }: { icon: ReactNode, label: string, path: string, color: string }) {
    return (
        <Link to={path} className="flex flex-col items-center gap-2 group">
            <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/10 transition-transform", color)}
            >
                {React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6" })}
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">{label}</span>
        </Link>
    );
}

function StatBox({ label, value, sub }: { label: string, value: number, sub: string }) {
    return (
        <div className="min-w-[160px] flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-3xl shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">{label}</h4>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-black dark:text-white leading-none tracking-tighter">{value}</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{sub}</span>
            </div>
        </div>
    );
}

function ShipmentAppCard({ shipment, index }: { shipment: any, index: number }) {
    const isError = shipment.status === "Held by Customs" || shipment.status === "Delayed";
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
            className="p-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all relative overflow-hidden group"
        >
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2.5 rounded-2xl border shadow-inner",
                        isError ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                    )}>
                        <Package className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black dark:text-white tracking-tight">{shipment.id}</h4>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{shipment.type}</p>
                    </div>
                </div>
                <div className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    shipment.status === "In Transit" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                    isError ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                    "bg-slate-100 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/5"
                )}>
                    {shipment.status}
                </div>
            </div>

            {/* Visual Route */}
            <div className="relative mb-6 px-2">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-white/5 -translate-y-1/2"></div>
                <div className="relative flex justify-between items-center z-10">
                    <div className="flex flex-col items-start gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/40"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{shipment.sender_city?.split(',')[0]}</span>
                    </div>
                    <div className="p-1.5 bg-white dark:bg-[#020617] border border-slate-100 dark:border-white/10 rounded-full shadow-sm animate-pulse">
                        <Package className="w-3 h-3 text-primary" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{shipment.receiver_city?.split(',')[0]}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500">ETA: {shipment.est_delivery}</span>
                </div>
                <Link 
                    to={`/track?id=${shipment.id}`} 
                    aria-label={`Track shipment ${shipment.id}`}
                    className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                    <ChevronRight className="w-5 h-5" />
                </Link>
            </div>
        </motion.div>
    );
}
