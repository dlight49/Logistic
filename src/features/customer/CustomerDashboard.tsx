import React, { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { Package, Search, PlusCircle, Clock, CheckCircle2, MapPin, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import CustomerNav from "../../components/navigation/CustomerNav";

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

    // Derived statistics
    const totalShipped = shipments.length;
    const inTransit = shipments.filter(s => s.status !== "Delivered").length;

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col pt-24 space-y-8">
            <CustomerNav />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        Welcome back, {user?.name || "Customer"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Here is the latest update on your shipments.</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link to="/track" className="flex-1 sm:flex-none glass-panel px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Search className="w-4 h-4" /> Track
                    </Link>
                    <Link to="/customer/quote" className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-primary-light text-white px-5 py-2 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:shadow-lg transition-all">
                        <PlusCircle className="w-4 h-4" /> New Quote
                    </Link>
                    <Link to="/customer/settings" className="flex-1 sm:flex-none glass-panel px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                    </Link>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Shipments */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" /> Active Shipments
                        </h2>
                        <Link to="/customer/history" className="text-sm font-semibold text-primary hover:text-primary-light transition-colors">
                            View All History &rarr;
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 glass-panel rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-sm text-slate-500 font-medium animate-pulse">Syncing orders...</p>
                            </div>
                        ) : shipments.length === 0 ? (
                            <div className="py-16 text-center glass-panel rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                <Package className="w-12 h-12 text-slate-300 mx-auto border-transparent mb-4" />
                                <p className="text-slate-500 font-medium">You have no active shipments.</p>
                            </div>
                        ) : shipments.map((shipment, idx) => {
                            const isDelivered = shipment.status === "Delivered";
                            const isError = shipment.status === "Held by Customs" || shipment.status === "Delayed";
                            const color = isDelivered ? "text-emerald-500" : isError ? "text-rose-500" : "text-accent";
                            const bgClass = isDelivered ? "bg-emerald-500/10" : isError ? "bg-rose-500/10" : "bg-accent/10";

                            return (
                                <motion.div
                                    key={shipment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                    className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group hover:shadow-lg transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                >
                                    <div className="flex items-start gap-4 w-full sm:w-auto">
                                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", bgClass)}>
                                            {isDelivered ? <CheckCircle2 className={cn("w-6 h-6", color)} /> :
                                                !isError ? <Clock className={cn("w-6 h-6", color)} /> :
                                                    <MapPin className={cn("w-6 h-6", color)} />}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                                {shipment.id}
                                                <span className={cn("text-xs px-2 py-0.5 rounded-full font-bold", bgClass, color)}>
                                                    {shipment.status}
                                                </span>
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {shipment.sender_city}</span>
                                                <span>&rarr;</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {shipment.receiver_city}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-auto flex justify-end">
                                        <Link to={`/track?id=${shipment.id}`} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full sm:w-auto text-center">
                                            Details
                                        </Link>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* Sidebar: Quick Stats & Support */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Your Shipping Overview</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <p className="text-3xl font-extrabold text-primary">{totalShipped}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase mt-1">Total Shipped</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <p className="text-3xl font-extrabold text-accent">{inTransit}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase mt-1">In Transit</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                        <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-accent/10 rounded-full blur-[50px] pointer-events-none group-hover:scale-110 transition-transform"></div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2 relative z-10">Need Assistance?</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 relative z-10">Reach out to your dedicated account manager for custom quotes or issue resolution.</p>
                        <Link to="/customer/tickets" className="block w-full">
                            <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all relative z-10">
                                Contact Support
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
