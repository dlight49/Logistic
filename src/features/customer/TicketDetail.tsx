import React, { ReactNode } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ChevronLeft, Send, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";

export default function TicketDetail(): ReactNode {
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

    if (loading) return (
        <div className="flex-1 flex items-center justify-center pt-24">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    if (!ticket) return (
        <div className="flex-1 flex flex-col items-center justify-center pt-24 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ticket not found</h2>
            <Link to="/customer/tickets" className="mt-4 text-primary font-bold">Back to Tickets</Link>
        </div>
    );

    const isClosed = ticket.status === 'CLOSED';

    return (
        <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col pt-24 h-[calc(100vh-6rem)]">
            {/* Nav */}
            <div className="flex items-center gap-4 mb-6 shrink-0">
                <Link to="/customer/tickets" className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white truncate max-w-md">{ticket.subject}</h1>
                    <div className="flex items-center gap-2 text-xs font-bold mt-0.5 uppercase tracking-wider">
                        <span className={cn(
                            "px-2 py-0.5 rounded-md",
                            ticket.priority === 'HIGH' ? "text-rose-500 bg-rose-500/10" : "text-amber-500 bg-amber-500/10"
                        )}>
                            {ticket.priority} Priority
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className={cn(
                            "flex items-center gap-1",
                            isClosed ? "text-emerald-500" : "text-amber-500"
                        )}>
                            {isClosed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            {ticket.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-slate-800/50 mb-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl min-h-0">
                <div
                    ref={scrollRef}
                    className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth custom-scrollbar"
                >
                    <AnimatePresence initial={false}>
                        {ticket.messages?.map((msg: any) => {
                            const isMe = msg.sender_id === user?.id;
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={cn(
                                        "flex w-full group",
                                        isMe ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={cn(
                                        "max-w-[85%] sm:max-w-[70%] flex flex-col",
                                        isMe ? "items-end" : "items-start"
                                    )}>
                                        <div className="flex items-center gap-2 mb-1 px-2">
                                            {!isMe && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {isMe ? "You" : "Logistic Support"}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-300">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className={cn(
                                            "px-5 py-3 rounded-2xl text-sm font-medium shadow-sm",
                                            isMe
                                                ? "bg-primary text-white rounded-tr-none shadow-primary/20"
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
                        className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex gap-3 items-center shrink-0"
                    >
                        <input
                            type="text"
                            value={reply}
                            onChange={e => setReply(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-white dark:bg-slate-900 border-none rounded-2xl px-6 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary transition-all text-slate-900 dark:text-white shadow-inner"
                        />
                        <button
                            disabled={!reply.trim() || sending}
                            className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-primary/30"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                ) : (
                    <div className="p-6 bg-slate-100 dark:bg-slate-800/80 text-center shrink-0">
                        <p className="text-sm font-bold text-slate-500">This ticket is closed. Please create a new one if you need further help.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
