import React, { ReactNode, useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { MessageSquare, Plus, ChevronLeft, Search, Clock, CheckCircle2, MoreVertical, MessageCircle, ArrowRight, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import CustomerNav from "../../components/navigation/CustomerNav";

export default function TicketList(): ReactNode {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTicketSubject, setNewTicketSubject] = useState("");
    const [newTicketMessage, setNewTicketMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchTickets = async () => {
        try {
            const res = await apiFetch(`/api/tickets`);
            const data = await res.json();
            setTickets(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchTickets();
    }, [user]);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTicketSubject || !newTicketMessage) return;

        setSubmitting(true);
        try {
            const res = await apiFetch("/api/tickets", {
                method: "POST",
                body: JSON.stringify({
                    subject: newTicketSubject,
                    message: newTicketMessage
                })
            });

            if (res.ok) {
                const createdTicket = await res.json();
                setTickets([createdTicket, ...tickets]);
                setIsCreateModalOpen(false);
                setNewTicketSubject("");
                setNewTicketMessage("");
            }
        } catch (error) {
            console.error("Failed to create ticket:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans pb-32">
            {/* App Bar */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 active:scale-90 transition-transform"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-black tracking-tight dark:text-white">Support Inbox</h1>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 active:scale-90 transition-transform"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </header>

            <main className="px-6 pt-6 space-y-6 max-w-lg mx-auto">
                {/* Search Inbox */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                {/* Ticket List */}
                <div className="space-y-1">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Connecting to Support...</p>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-300 dark:text-slate-700">
                                <MessageCircle className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-black dark:text-white uppercase tracking-widest">No Active Sessions</p>
                                <p className="text-xs font-medium text-slate-500 max-w-[200px] mx-auto">Start a new ticket if you have questions about your shipping.</p>
                            </div>
                        </div>
                    ) : (
                        tickets.map((t, idx) => (
                            <TicketAppCard key={t.id} ticket={t} index={idx} />
                        ))
                    )}
                </div>
            </main>

            {/* Create Ticket Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 dark:text-white">
                                        <Plus className="w-8 h-8 text-primary" /> New Ticket
                                    </h2>
                                    <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white p-2">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleCreateTicket} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Subject</label>
                                        <input 
                                            required
                                            value={newTicketSubject}
                                            onChange={(e) => setNewTicketSubject(e.target.value)}
                                            placeholder="What's your issue?"
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Message</label>
                                        <textarea 
                                            required
                                            rows={4}
                                            value={newTicketMessage}
                                            onChange={(e) => setNewTicketMessage(e.target.value)}
                                            placeholder="Describe how we can help..."
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none dark:text-white"
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {submitting ? "Processing..." : "Open Ticket"}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <CustomerNav />
        </div>
    );
}

function TicketAppCard({ ticket, index }: { ticket: any, index: number }) {
    const isClosed = ticket.status === "CLOSED";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
            className="group"
        >
            <Link 
                to={`/customer/tickets/${ticket.id}`}
                className="flex items-center gap-4 p-4 hover:bg-white dark:hover:bg-white/5 rounded-2xl transition-all"
            >
                <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shrink-0 border shadow-inner relative",
                    isClosed ? "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400" : 
                    "bg-primary/10 border-primary/20 text-primary"
                )}>
                    <MessageSquare className="w-6 h-6" />
                    {!isClosed && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#020617] rounded-full"></span>
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                        <h4 className="text-sm font-black dark:text-white truncate pr-4">{ticket.subject}</h4>
                        <span className="text-[9px] font-black text-slate-400 whitespace-nowrap">
                            {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 truncate">
                        ID: {ticket.id?.split('-')[0].toUpperCase()} • {ticket.status}
                    </p>
                </div>

                <div className="text-slate-300 dark:text-slate-700 group-hover:text-primary transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </div>
            </Link>
            <div className="h-px bg-slate-100 dark:bg-white/5 ml-20"></div>
        </motion.div>
    );
}