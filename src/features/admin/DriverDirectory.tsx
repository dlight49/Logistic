import React, { useState, useEffect } from "react";
import { Users, Search, MapPin, Truck, ChevronRight, Activity, Filter, ChevronDown } from "lucide-react";
import { User } from "../../types";
import { apiFetch } from "../../utils/api";
import { cn } from "../../utils";
import AdminNav from "../../components/AdminNav";
import { motion } from "motion/react";

export default function DriverDirectory() {
    const [drivers, setDrivers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [cityFilter, setCityFilter] = useState("all");
    const [filterStatus, setFilterStatus] = useState("");

    useEffect(() => {
        const fetchDrivers = async () => {
            setLoading(true);
            try {
                const res = await apiFetch("/api/users?role=operator");
                const data = await res.json();
                setDrivers(data);
            } catch (err) {
                console.error("Failed to fetch drivers", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDrivers();
    }, []);

    const filteredDrivers = drivers.filter(d =>
    (d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#020817] text-slate-100 font-sans pb-32">
            <AdminNav />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-40 pt-6 sm:pt-8">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 sm:mb-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/20">
                                <Users className="w-5 h-5 text-blue-400" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white italic">Driver Intelligence</h1>
                        </div>
                        <p className="text-[10px] sm:text-sm font-bold text-slate-500 uppercase tracking-[0.2em] ml-11">The Backbone of Global Supply Chains</p>
                    </div>
                </header>

                <div className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-10 text-slate-100">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            className="w-full pl-14 pr-6 py-4 sm:py-4.5 bg-slate-900/40 border border-white/5 rounded-2xl sm:rounded-3xl text-sm font-bold focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all placeholder:text-slate-600 shadow-2xl backdrop-blur-sm"
                            placeholder="Search by name, email, or vehicle..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-64 relative">
                        <select
                            className="w-full pl-6 pr-12 py-4 sm:py-4.5 bg-slate-900/40 border border-white/5 rounded-2xl sm:rounded-3xl text-sm font-bold appearance-none focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all shadow-2xl backdrop-blur-sm"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Drivers</option>
                            <option value="active">Currently Active</option>
                            <option value="idle">Stationary / Idle</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                    </div>
                </div>

                {/* Driver Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-48 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse" />
                        ))
                    ) : filteredDrivers.length > 0 ? (
                        filteredDrivers.map((driver) => (
                            <motion.div
                                key={driver.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900/50 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-primary to-primary-light rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-primary/20">
                                        {driver.name?.[0]?.toUpperCase() || "D"}
                                    </div>
                                    <div className={cn(
                                        "px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                                        driver.current_lat ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"
                                    )}>
                                        <Activity className="w-3 h-3" />
                                        {driver.current_lat ? "Live" : "Offline"}
                                    </div>
                                </div>

                                <h3 className="text-base sm:text-lg font-bold mb-1 truncate">{driver.name}</h3>
                                <p className="text-xs sm:text-sm text-slate-500 mb-6 truncate">{driver.email}</p>

                                <div className="space-y-3 pt-4 border-t border-slate-800">
                                    <div className="flex items-center gap-2 text-[11px] sm:text-sm text-slate-400">
                                        <MapPin className="w-3.5 h-3.5 sm:w-4 h-4 text-primary" />
                                        <span className="truncate">{driver.current_lat ? `${driver.current_lat.toFixed(4)}, ${driver.current_lng?.toFixed(4)}` : "No GPS data"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] sm:text-sm text-slate-400">
                                        <Truck className="w-3.5 h-3.5 sm:w-4 h-4 text-accent" />
                                        <span className="truncate">Assigned Truck: VAN-782</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-2 sm:gap-3">
                                    <button className="flex-1 py-2 sm:py-2.5 bg-slate-800 hover:bg-primary hover:text-white rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold transition-all">
                                        View Route
                                    </button>
                                    <button className="flex-1 py-2 sm:py-2.5 bg-slate-800 hover:bg-primary hover:text-white rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold transition-all">
                                        Message
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-slate-900/50 rounded-2xl sm:rounded-3xl border border-dashed border-slate-800">
                            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-slate-700 mx-auto mb-4" />
                            <p className="text-sm sm:text-base text-slate-500">No drivers found matching your search.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );

}
