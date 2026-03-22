import React, { useState, useEffect, ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { Package, Search, Calendar, Filter, Plus, MapPin, CheckCircle2, Gavel, Truck, Users, ChevronLeft, MoreVertical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Shipment } from "../../types";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import AssignOperatorModal from "../../components/AssignOperatorModal";
import { motion, AnimatePresence } from "motion/react";

export default function ShipmentRegistry(): ReactNode {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [assigningShipmentId, setAssigningShipmentId] = useState<string | null>(null);

    const fetchShipments = async () => {
        const params = new URLSearchParams();
        if (filterStatus) params.append("status", filterStatus);

        try {
            const res = await apiFetch(`/api/shipments?${params.toString()}`);
            const data = await res.json();
            setShipments(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchShipments();
    }, [filterStatus]);

    const filteredShipments = shipments.filter(s => {
        const query = searchQuery.toLowerCase();
        return (s.id || "").toLowerCase().includes(query) ||
            (s.receiver_name || "").toLowerCase().includes(query) ||
            (s.receiver_city || "").toLowerCase().includes(query);
    });

    return (
        <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans relative pb-32">
            
            {/* App Header */}
            <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin')}
                        className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 active:scale-90 transition-transform"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-white leading-tight">Registry</h1>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">{filteredShipments.length} Records</p>
                    </div>
                </div>
                <Link to="/admin/create" className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-900/50 active:scale-90 transition-transform border border-white/20">
                    <Plus className="w-5 h-5" />
                </Link>
            </header>

            <main className="flex-1 px-5 pt-6 space-y-6 max-w-lg mx-auto w-full z-10">
                {/* Search & Filter Row */}
                <div className="flex gap-2">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-[1.5rem] text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder:text-slate-500 transition-all outline-none"
                            placeholder="Search IDs or locations..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            className="h-full pl-10 pr-8 bg-white/5 border border-white/10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-300 appearance-none"
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                        >
                            <option value="" className="bg-slate-900">All</option>
                            <option value="Order Created" className="bg-slate-900">Created</option>
                            <option value="In Transit" className="bg-slate-900">Transit</option>
                            <option value="Held by Customs" className="bg-slate-900">Customs</option>
                            <option value="Delivered" className="bg-slate-900">Delivered</option>
                        </select>
                    </div>
                </div>

                {/* Vertical App Feed */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredShipments.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="py-20 text-center space-y-4"
                            >
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-700">
                                    <Package className="w-10 h-10" />
                                </div>
                                <p className="text-sm font-bold text-slate-500">No shipments found.</p>
                            </motion.div>
                        ) : (
                            filteredShipments.map((s, idx) => (
                                <AdminShipmentCard 
                                    key={s.id} 
                                    shipment={s} 
                                    index={idx} 
                                    onAssign={() => setAssigningShipmentId(s.id)} 
                                />
                            ))
                        )}
                    </AnimatePresence>
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
        </div>
    );
}

function AdminShipmentCard({ shipment: s, index, onAssign }: { shipment: any, index: number, onAssign: () => void }) {
    const isError = s.status === "Held by Customs" || s.status === "Delayed";
    const isDelivered = s.status === "Delivered";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
            className="p-5 bg-white/5 border border-white/10 rounded-[2rem] shadow-lg relative overflow-hidden group"
        >
            <div className={cn(
                "absolute top-0 left-0 w-1 h-full",
                isDelivered ? "bg-emerald-500" : isError ? "bg-rose-500" : "bg-blue-500"
            )}></div>

            <div className="flex justify-between items-start mb-4 pl-2">
                <div className="flex gap-3 items-center">
                    <div className={cn(
                        "p-2.5 rounded-2xl border shadow-inner",
                        isDelivered ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                        isError ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                        "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    )}>
                        {isDelivered ? <CheckCircle2 className="w-5 h-5" /> : 
                         isError ? <Gavel className="w-5 h-5" /> : 
                         <Truck className="w-5 h-5" />}
                    </div>
                    <div>
                        <h4 className="text-base font-black text-white tracking-tight">{s.id}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.type} • {new Date(s.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                    </div>
                </div>
                
                <div className={cn(
                    "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                    isDelivered ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    isError ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                    "bg-blue-500/10 text-blue-400 border-blue-500/20"
                )}>
                    {s.status}
                </div>
            </div>

            <div className="pl-2 mb-6">
                 <p className="text-sm font-bold text-slate-200 truncate mb-1">{s.receiver_name}</p>
                 <p className="text-[11px] font-medium text-slate-500 truncate flex items-center gap-1.5">
                     <MapPin className="w-3.5 h-3.5 text-slate-600" /> {s.receiver_city}, {s.receiver_country}
                 </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pl-2">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onAssign();
                    }}
                    className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-slate-300 transition-colors"
                >
                    <Users className="w-4 h-4" /> Assign
                </button>
                <Link
                    to={`/admin/shipment/${s.id}`}
                    className="flex items-center justify-center py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-xs font-bold text-blue-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    );
}
