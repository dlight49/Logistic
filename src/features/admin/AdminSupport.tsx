import React, { ReactNode } from "react";
import { MessageSquare, Clock, CheckCircle2, ChevronRight, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import AdminNav from "../../components/navigation/AdminNav";

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

            <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col pt-12 sm:pt-24 space-y-8 pb-32 relative z-10">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Support Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Review and respond to customer assistance requests.</p>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by subject or customer name..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 glass-panel border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all text-slate-900 dark:text-white font-medium"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter("ALL")}
                            className={cn("flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                                filter === "ALL" ? "bg-primary text-white shadow-lg shadow-primary/20" : "glass-panel text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("OPEN")}
                            className={cn("flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                                filter === "OPEN" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "glass-panel text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            Open
                        </button>
                        <button
                            onClick={() => setFilter("CLOSED")}
                            className={cn("flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                                filter === "CLOSED" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "glass-panel text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            Closed
                        </button>
                    </div>
                </div>

                {/* Tickets Table/Grid */}
                <div className="glass-panel rounded-3xl overflow-hidden shadow-xl shadow-black/5 dark:shadow-none border border-slate-200/50 dark:border-slate-800/50">
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                        <div className="col-span-5">Ticket Info</div>
                        <div className="col-span-3">Customer</div>
                        <div className="col-span-2">Priority</div>
                        <div className="col-span-2 text-right">Status</div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-medium">Fetching support requests...</p>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center px-6">
                            <MessageSquare className="w-16 h-16 text-slate-200 dark:text-slate-800 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No tickets match your filters</h3>
                            <p className="text-slate-500 max-w-xs mt-2">Try adjusting your search query or filter settings.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredTickets.map((ticket, idx) => (
                                <Link
                                    key={ticket.id}
                                    to={`/admin/support/${ticket.id}`}
                                    className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors relative"
                                >
                                    <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

                                    <div className="col-span-1 md:col-span-5 flex items-center gap-4 min-w-0">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                            ticket.status === 'OPEN' ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                                        )}>
                                            {ticket.status === 'OPEN' ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="md:hidden text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ticket</div>
                                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{ticket.subject}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">#{ticket.id.split('-')[0]}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:col-span-3">
                                        <div className="md:hidden text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{ticket.user?.name}</p>
                                        <p className="text-xs text-slate-500">{ticket.user?.email}</p>
                                    </div>

                                    <div className="col-span-1 md:col-span-2">
                                        <div className="md:hidden text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Priority</div>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                                            ticket.priority === 'HIGH' ? "text-rose-500 bg-rose-500/10" :
                                                ticket.priority === 'MEDIUM' ? "text-amber-500 bg-amber-500/10" :
                                                    "text-primary bg-primary/10"
                                        )}>
                                            {ticket.priority}
                                        </span>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-3 text-right">
                                        <div className="md:hidden text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</div>
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "text-xs font-bold px-3 py-1 rounded-full",
                                                ticket.status === 'OPEN' ? "bg-amber-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
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
                <AdminNav />
            </div>
        </div>
    );
}
