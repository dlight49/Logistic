import React, { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { MessageSquare, Plus, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";

export default function TicketList(): ReactNode {
    const { user } = useAuth();
    const [tickets, setTickets] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [showCreateModal, setShowCreateModal] = React.useState(false);
    const [newTicket, setNewTicket] = React.useState({ subject: "", text: "", priority: "MEDIUM" });

    const fetchTickets = async () => {
        try {
            const res = await apiFetch('/api/tickets/my');
            const data = await res.json();
            setTickets(data);
        } catch (err) {
            console.error("Failed to fetch tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchTickets();
    }, []);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await apiFetch('/api/tickets', {
                method: 'POST',
                body: JSON.stringify(newTicket)
            });
            if (res.ok) {
                setShowCreateModal(false);
                setNewTicket({ subject: "", text: "", priority: "MEDIUM" });
                fetchTickets();
            }
        } catch (err) {
            console.error("Failed to create ticket:", err);
        }
    };

    return (
        <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col pt-24 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Support Tickets</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage your assistance requests.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus className="w-5 h-5" /> New Ticket
                </button>
            </div>

            {/* Tickets Main Section */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium">Loading tickets...</p>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center px-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <MessageSquare className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No active tickets</h3>
                        <p className="text-slate-500 max-w-xs mt-2">If you have any issues with your shipments or account, create a ticket and we'll get back to you soon.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {tickets.map((ticket, idx) => (
                            <Link
                                key={ticket.id}
                                to={`/customer/tickets/${ticket.id}`}
                                className="group flex items-center justify-between p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                        ticket.status === 'OPEN' ? "bg-amber-500/10" : "bg-emerald-500/10"
                                    )}>
                                        {ticket.status === 'OPEN' ?
                                            <Clock className="w-6 h-6 text-amber-500" /> :
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        }
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-slate-900 dark:text-white truncate pr-4">{ticket.subject}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-xs font-semibold uppercase tracking-wider">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-md",
                                                ticket.priority === 'HIGH' ? "text-rose-500 bg-rose-500/10" :
                                                    ticket.priority === 'MEDIUM' ? "text-amber-500 bg-amber-500/10" :
                                                        "text-primary bg-primary/10"
                                            )}>
                                                {ticket.priority}
                                            </span>
                                            <span className="text-slate-400">
                                                Created {new Date(ticket.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 ml-4">
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold",
                                        ticket.status === 'OPEN' ? "bg-amber-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                    )}>
                                        {ticket.status}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Ticket Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowCreateModal(false)}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Create New Ticket</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Tell us what's on your mind and we'll help you out.</p>

                            <form onSubmit={handleCreateTicket} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Subject</label>
                                    <input
                                        required
                                        type="text"
                                        value={newTicket.subject}
                                        onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                                        placeholder="e.g. Shipment Delay, Damaged Goods"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all text-slate-900 dark:text-white font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Priority</label>
                                    <select
                                        value={newTicket.priority}
                                        onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all text-slate-900 dark:text-white font-medium cursor-pointer"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={newTicket.text}
                                        onChange={e => setNewTicket({ ...newTicket, text: e.target.value })}
                                        placeholder="Provide as much detail as possible..."
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all text-slate-900 dark:text-white font-medium resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                                    >
                                        Submit Ticket
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
