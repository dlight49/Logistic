import React, { useState, useEffect } from "react";
import { Users, Search, MapPin, Truck, ChevronRight, Activity, Filter } from "lucide-react";
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
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100">
            <AdminNav />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Users className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Driver Fleet</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">Manage and monitor your active logistics operators.</p>
                </header>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="relative group col-span-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, email or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div className="relative group">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <select
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="all">All Locations</option>
                            <option value="active">Currently Active</option>
                            <option value="idle">Stationary / Idle</option>
                        </select>
                    </div>
                </div>

                {/* Driver Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-48 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse" />
                        ))
                    ) : filteredDrivers.length > 0 ? (
                        filteredDrivers.map((driver) => (
                            <motion.div
                                key={driver.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-14 bg-gradient-to-tr from-primary to-primary-light rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                                        {driver.name?.[0]?.toUpperCase() || "D"}
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                                        driver.current_lat ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                    )}>
                                        <Activity className="w-3 h-3" />
                                        {driver.current_lat ? "Live" : "Offline"}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold mb-1">{driver.name}</h3>
                                <p className="text-sm text-slate-500 mb-6 truncate">{driver.email}</p>

                                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{driver.current_lat ? `${driver.current_lat.toFixed(4)}, ${driver.current_lng?.toFixed(4)}` : "No GPS data"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Truck className="w-4 h-4 text-accent" />
                                        <span>Assigned Truck: VAN-782</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white rounded-xl text-sm font-bold transition-all">
                                        View Route
                                    </button>
                                    <button className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white rounded-xl text-sm font-bold transition-all">
                                        Message
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No drivers found matching your search.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
