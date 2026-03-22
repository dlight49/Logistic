import React, { ReactNode } from "react";
import { MessageSquare, Clock, CheckCircle2, ChevronRight, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import AdminNav from "../../components/AdminNav";

export default function AdminSupport(): ReactNode {
    const [tickets, setTickets] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState("ALL");
    const [searchQuery, setSearchQuery] = React.useState("");

    const fetchTickets = async () => {
        try {
            const res = await apiFetch('/api/tickets/admin/all');
            const data = await res.json();
            setTickets(data);
        } catch (err) {
            console.error("Failed to fetch admin tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchTickets();
    }, []);

    const filteredTickets = tickets.filter(t => {
        const matchesFilter = filter === "ALL" || t.status === filter;
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="bg-slate-950 text-slate-100 min-h-screen relative overflow-hidden font-display">
            {/* Background Aesthetics */}
            <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col pt-6 sm:pt-12 space-y-6 sm:space-y-8 pb-40 relative z-10">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white uppercase italic tracking-tight">Support Management</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Review and respond to customer assistance requests.</p>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search tickets or customers..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all text-slate-900 dark:text-white font-medium shadow-inner"
                        />
                    </div>
                    <div className="flex gap-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-2xl">
                        {["ALL", "OPEN", "CLOSED"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn("flex-1 py-2 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all",
                                    filter === f 
                                        ? (f === "OPEN" ? "bg-amber-500 text-white shadow-lg" : f === "CLOSED" ? "bg-emerald-500 text-white shadow-lg" : "bg-primary text-white shadow-lg")
                                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tickets Table/Grid */}
                <div className="bg-white dark:bg-slate-900/30 rounded-3xl overflow-hidden shadow-xl shadow-black/5 dark:shadow-none border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20">
                        <div className="col-span-5">Ticket Info</div>
                        <div className="col-span-3">Customer</div>
                        <div className="col-span-2">Priority</div>
                        <div className="col-span-2 text-right">Status</div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 sm:py-32 gap-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Syncing Requests...</p>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center px-6">
                            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-slate-200 dark:text-slate-800 mb-4" />
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">No tickets match your filters</h3>
                            <p className="text-sm text-slate-500 max-w-xs mt-2">Try adjusting your search query or filter settings.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredTickets.map((ticket, idx) => (
                                <Link
                                    key={ticket.id}
                                    to={`/admin/support/${ticket.id}`}
                                    className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-5 sm:p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors relative"
                                >
                                    <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

                                    <div className="col-span-1 md:col-span-5 flex items-center gap-3 sm:gap-4 min-w-0">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                                            ticket.status === 'OPEN' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                        )}>
                                            {ticket.status === 'OPEN' ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Support Ticket</div>
                                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{ticket.subject}</h4>
                                            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 font-medium">#{ticket.id.split('-')[0]}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:col-span-3">
                                        <div className="md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</div>
                                        <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{ticket.user?.name}</p>
                                        <p className="text-[10px] sm:text-xs text-slate-500 truncate">{ticket.user?.email}</p>
                                    </div>

                                    <div className="col-span-1 md:col-span-2">
                                        <div className="md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Priority</div>
                                        <span className={cn(
                                            "text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border",
                                            ticket.priority === 'HIGH' ? "text-rose-500 bg-rose-500/10 border-rose-500/20" :
                                                ticket.priority === 'MEDIUM' ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                                                    "text-primary bg-primary/10 border-primary/20"
                                        )}>
                                            {ticket.priority}
                                        </span>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-3 text-right pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                                        <div className="md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</div>
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                                                ticket.status === 'OPEN' ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                            )}>
                                                {ticket.status}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <AdminNav />
        </div>
    );
}
