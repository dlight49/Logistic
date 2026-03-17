import React, { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { Search, Send, User, MessageCircle, MoreVertical, Phone, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import AdminNav from "../../components/navigation/AdminNav";

export default function AdminChat(): ReactNode {
    const { user } = useAuth();
    const [drivers, setDrivers] = React.useState<any[]>([]);
    const [selectedDriver, setSelectedDriver] = React.useState<any>(null);
    const [messages, setMessages] = React.useState<any[]>([]);
    const [newMessage, setNewMessage] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [search, setSearch] = React.useState("");
    const [view, setView] = React.useState<"list" | "chat">("list");
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const fetchDrivers = async () => {
        try {
            const res = await apiFetch('/api/operators');
            const data = await res.json();
            setDrivers(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchMessages = async (driverId: string) => {
        try {
            const res = await apiFetch(`/api/chat/${driverId}`);
            const data = await res.json();
            setMessages(data);
        } catch (err) { console.error(err); }
    };

    React.useEffect(() => {
        fetchDrivers();
    }, []);

    React.useEffect(() => {
        if (selectedDriver) {
            setView("chat");
            fetchMessages(selectedDriver.id);
            const interval = setInterval(() => fetchMessages(selectedDriver.id), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedDriver]);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedDriver) return;

        const text = newMessage;
        setNewMessage("");
        try {
            const res = await apiFetch('/api/chat/send', {
                method: 'POST',
                body: JSON.stringify({ receiver_id: selectedDriver.id, text })
            });
            if (res.ok) fetchMessages(selectedDriver.id);
        } catch (err) { console.error(err); }
    };

    const filteredDrivers = drivers.filter(d =>
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-slate-950 text-slate-100 min-h-screen relative overflow-hidden font-display">
            {/* Background Aesthetics */}
            <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex-1 w-full max-w-7xl mx-auto p-0 sm:p-6 lg:p-8 flex flex-col pt-12 sm:pt-24 h-[calc(100vh-2rem)] pb-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 glass-panel rounded-none sm:rounded-3xl overflow-hidden h-full shadow-2xl border-x-0 sm:border-x border-y border-slate-200/50 dark:border-slate-800/50 relative z-20">

                    {/* Sidebar: Driver List */}
                    <div className={cn(
                        "lg:col-span-1 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/30",
                        view === "chat" ? "hidden lg:flex" : "flex"
                    )}>
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">Messages</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search drivers..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                            {loading ? (
                                <div className="py-20 text-center"><div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" /></div>
                            ) : filteredDrivers.length === 0 ? (
                                <p className="p-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No drivers found</p>
                            ) : filteredDrivers.map(driver => (
                                <button
                                    key={driver.id}
                                    onClick={() => setSelectedDriver(driver)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-2xl transition-all mb-1 hover:bg-white dark:hover:bg-slate-800",
                                        selectedDriver?.id === driver.id ? "bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" : ""
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center font-black text-primary">
                                        {driver.name?.[0]}
                                    </div>
                                    <div className="text-left min-w-0 flex-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{driver.name}</p>
                                        <p className="text-[10px] font-medium text-slate-400 truncate uppercase tracking-wider">Driver</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main: Chat View */}
                    <div className={cn(
                        "lg:col-span-3 flex flex-col bg-white dark:bg-slate-900 relative",
                        view === "list" ? "hidden lg:flex" : "flex"
                    )}>
                        {selectedDriver ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setView("list")}
                                            className="lg:hidden p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-black">
                                            {selectedDriver.name?.[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-900 dark:text-white leading-tight truncate">{selectedDriver.name}</h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Driver</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="hidden sm:block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-colors"><Phone className="w-5 h-5" /></button>
                                        <button className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div
                                    ref={scrollRef}
                                    className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar"
                                >
                                    <AnimatePresence initial={false}>
                                        {messages.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale scale-90">
                                                <MessageCircle className="w-12 h-12 mb-4" />
                                                <p className="text-xs font-black uppercase tracking-[0.2em]">Start of conversation</p>
                                            </div>
                                        ) : messages.map(msg => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={cn(
                                                    "flex w-full",
                                                    msg.sender_id === user?.id ? "justify-end" : "justify-start"
                                                )}
                                            >
                                                <div className={cn(
                                                    "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-medium",
                                                    msg.sender_id === user?.id
                                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-tr-none"
                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none"
                                                )}>
                                                    {msg.text}
                                                    <div className={cn(
                                                        "text-[9px] mt-1 font-bold uppercase tracking-tight opacity-50",
                                                        msg.sender_id === user?.id ? "text-right" : "text-left"
                                                    )}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Input */}
                                <form
                                    onSubmit={handleSendMessage}
                                    className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-6"
                                >
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        placeholder="Type message..."
                                        className="flex-1 bg-white dark:bg-slate-800 border-none rounded-2xl px-6 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary transition-all shadow-inner"
                                    />
                                    <button
                                        className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all shadow-primary/30"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                    <MessageCircle className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Secure Fleet Messaging</h3>
                                <p className="text-slate-500 max-w-xs mt-2 text-sm font-medium">Select a driver from the list to start a direct secure conversation.</p>
                            </div>
                        )}
                    </div>
                </div>

                <AdminNav />
            </div>
        </div>
    );
}
