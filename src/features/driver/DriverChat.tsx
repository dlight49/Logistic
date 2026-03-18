import React, { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { Send, MessageCircle, ShieldCheck, ChevronLeft, Phone, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";

export default function DriverChat(): ReactNode {
    const { user } = useAuth();
    const [messages, setMessages] = React.useState<any[]>([]);
    const [newMessage, setNewMessage] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [adminId, setAdminId] = React.useState<string | null>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const fetchAdmin = async () => {
        try {
            const res = await apiFetch('/api/users/admins');
            const admins = await res.json();
            if (admins && admins.length > 0) {
                setAdminId(admins[0].id);
            }
        } catch (err) {
            console.error("Failed to fetch admin:", err);
        }
    };

    const fetchMessages = async () => {
        if (!adminId) return;
        try {
            const res = await apiFetch(`/api/chat/${adminId}`);
            const data = await res.json();
            setMessages(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    React.useEffect(() => {
        fetchAdmin();
    }, []);

    React.useEffect(() => {
        if (adminId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [adminId]);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const text = newMessage;
        setNewMessage("");
        try {
            const res = await apiFetch('/api/chat/send', {
                method: 'POST',
                body: JSON.stringify({ receiver_id: adminId, text })
            });
            if (res.ok) fetchMessages();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col pt-24 h-[calc(100vh-6rem)] pb-24">

            {/* Chat Frame */}
            <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shrink-0 min-h-0">

                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/40 dark:bg-slate-900/40">
                    <div className="flex items-center gap-4">
                        <Link to="/driver" className="lg:hidden w-10 h-10 glass-panel rounded-full flex items-center justify-center">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-900 dark:text-white leading-tight">Fleet Support</h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Team • Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                            <Phone className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Message Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar"
                >
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                    <MessageCircle className="w-16 h-16 mb-4" />
                                    <p className="text-sm font-black uppercase tracking-[0.2em]">Live chat with HQ</p>
                                </div>
                            ) : messages.map((msg) => {
                                const isMe = msg.sender_id === user?.id;
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={cn(
                                            "flex w-full",
                                            isMe ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "max-w-[85%] flex flex-col",
                                            isMe ? "items-end" : "items-start"
                                        )}>
                                            <div className={cn(
                                                "px-5 py-3 rounded-2xl text-sm font-medium shadow-sm",
                                                isMe
                                                    ? "bg-primary text-white rounded-tr-none shadow-primary/20"
                                                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-slate-200/50"
                                            )}>
                                                {msg.text}
                                            </div>
                                            <span className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-tighter px-1">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

                {/* Input Area */}
                <form
                    onSubmit={handleSendMessage}
                    className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-6"
                >
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type message to HQ..."
                        className="flex-1 bg-white dark:bg-slate-900 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all shadow-inner text-slate-900 dark:text-white min-w-0"
                    />
                    <button
                        disabled={!newMessage.trim()}
                        className="w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shrink-0"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </form>
            </div>

            {/* Safety Tip */}
            <div className="mt-6 flex items-center justify-center gap-3 p-4 glass-panel rounded-2xl border-rose-500/20 bg-rose-500/5">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Security Notice: Do not message while driving.</p>
            </div>
        </div>
    );
}
