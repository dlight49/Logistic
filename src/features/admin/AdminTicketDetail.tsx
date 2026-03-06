import React, { ReactNode } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ChevronLeft, Send, ShieldCheck, Clock, CheckCircle2, User, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";

export default function AdminTicketDetail(): ReactNode {
    const { id } = useParams();
    const { user } = useAuth();
    const [ticket, setTicket] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [reply, setReply] = React.useState("");
    const [sending, setSending] = React.useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const fetchTicket = async () => {
        try {
            const res = await apiFetch(`/api/tickets/${id}`);
            const data = await res.json();
            setTicket(data);
        } catch (err) {
            console.error("Failed to fetch ticket info:", err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchTicket();
    }, [id]);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [ticket?.messages]);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() || sending) return;

        setSending(true);
        try {
            const res = await apiFetch(`/api/tickets/${id}/reply`, {
                method: 'POST',
                body: JSON.stringify({ text: reply })
            });

            if (res.ok) {
                setReply("");
                fetchTicket();
            }
        } catch (err) {
            console.error("Failed to send reply:", err);
        } finally {
            setSending(false);
        }
    };

    const handleCloseTicket = async () => {
        try {
            const res = await apiFetch(`/api/tickets/${id}/close`, { method: 'POST' });
            if (res.ok) fetchTicket();
        } catch (err) {
            console.error("Failed to close ticket:", err);
        }
    }

    if (loading) return (
        <div className="flex-1 flex items-center justify-center pt-24">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    if (!ticket) return (
        <div className="flex-1 flex flex-col items-center justify-center pt-24 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ticket not found</h2>
            <Link to="/admin/support" className="mt-4 text-primary font-bold">Back to Support</Link>
        </div>
    );

    const isClosed = ticket.status === 'CLOSED';

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col pt-24 min-h-[calc(100vh-6rem)] pb-24 lg:pb-8">
            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">

                {/* Left Side: Chat Area */}
                <div className="lg:col-span-3 flex flex-col min-h-[500px] lg:h-[calc(100vh-16rem)]">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 shrink-0">
                        <div className="flex items-center gap-4">
                            <Link to="/admin/support" className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0">
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">{ticket.subject}</h1>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">ID: {ticket.id}</p>
                            </div>
                        </div>
                        {!isClosed && (
                            <button
                                onClick={handleCloseTicket}
                                className="w-full sm:w-auto px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Lock className="w-3.5 h-3.5" /> Close Ticket
                            </button>
                        )}
                    </div>

                    {/* Thread */}
                    <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                        <div
                            ref={scrollRef}
                            className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 scroll-smooth custom-scrollbar min-h-0"
                        >
                            <AnimatePresence initial={false}>
                                {ticket.messages?.map((msg: any) => {
                                    const isMe = msg.sender_id === user?.id;
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={cn(
                                                "flex w-full",
                                                isMe ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "max-w-[90%] sm:max-w-[75%] flex flex-col",
                                                isMe ? "items-end" : "items-start"
                                            )}>
                                                <div className="flex items-center gap-2 mb-1 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    {!isMe && <User className="w-3 h-3" />}
                                                    <span>{isMe ? "You (Admin)" : ticket.user?.name}</span>
                                                    <span className="text-slate-300 ml-1 font-medium">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className={cn(
                                                    "px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-sm font-medium shadow-sm",
                                                    isMe
                                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-tr-none"
                                                        : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700"
                                                )}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Input Area */}
                        {!isClosed ? (
                            <form
                                onSubmit={handleReply}
                                className="p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex gap-2 sm:gap-3 items-center shrink-0"
                            >
                                <input
                                    type="text"
                                    value={reply}
                                    onChange={e => setReply(e.target.value)}
                                    placeholder="Type your response..."
                                    className="flex-1 bg-white dark:bg-slate-900 border-none rounded-2xl px-4 py-3 sm:px-6 sm:py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary transition-all text-slate-900 dark:text-white shadow-inner"
                                />
                                <button
                                    disabled={!reply.trim() || sending}
                                    className="w-11 h-11 sm:w-12 sm:h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-primary/30 shrink-0"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        ) : (
                            <div className="p-4 sm:p-6 bg-rose-500/5 dark:bg-rose-500/10 text-center shrink-0 border-t border-rose-500/10">
                                <p className="text-sm font-bold text-rose-500 flex items-center justify-center gap-2">
                                    <Lock className="w-4 h-4" /> This ticket is closed.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Sidebar Info */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 rounded-3xl space-y-6 border border-slate-200/50 dark:border-slate-800/50 sticky top-24">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3">Customer Profile</label>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-black shrink-0">
                                    {ticket.user?.name?.[0]}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white truncate">{ticket.user?.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{ticket.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3">Ticket Status</label>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500">Status</span>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase px-2 py-1 rounded-md",
                                        isClosed ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                    )}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500">Priority</span>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase px-2 py-1 rounded-md",
                                        ticket.priority === 'HIGH' ? "bg-rose-500/10 text-rose-500" : "bg-primary/10 text-primary"
                                    )}>
                                        {ticket.priority}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500">Created At</span>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Link to={`/admin/operator/1`} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white py-3 rounded-2xl font-bold text-sm block text-center hover:bg-slate-100 transition-colors">
                                View User History
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
