import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Mail,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Package,
  Filter,
  Inbox,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import AdminNav from "../../components/AdminNav";

// ── Types ────────────────────────────────────────────────────────
interface NotificationLog {
  id: number;
  user_id: string | null;
  shipment_id: string | null;
  channel: string | null;
  message: string | null;
  status: string | null;
  timestamp: string | null;
}

// ── Helpers ──────────────────────────────────────────────────────
const CHANNEL_CONFIG: Record<string, { label: string; icon: ReactNode; color: string; bg: string; border: string }> = {
  email: {
    label: "Email",
    icon: <Mail className="w-4 h-4" />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  sms: {
    label: "SMS",
    icon: <MessageSquare className="w-4 h-4" />,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  push: {
    label: "Push",
    icon: <Bell className="w-4 h-4" />,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: ReactNode }> = {
  sent:    { label: "Sent",    color: "text-emerald-500", bg: "bg-emerald-500/10", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  failed:  { label: "Failed",  color: "text-rose-500",    bg: "bg-rose-500/10",    icon: <XCircle className="w-3.5 h-3.5" /> },
  pending: { label: "Pending", color: "text-amber-500",   bg: "bg-amber-500/10",   icon: <Clock className="w-3.5 h-3.5" /> },
};

const getChannel = (channel: string | null) =>
  CHANNEL_CONFIG[channel?.toLowerCase() ?? ""] ?? {
    label: channel ?? "System",
    icon: <Bell className="w-4 h-4" />,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
  };

const getStatus = (status: string | null) =>
  STATUS_CONFIG[status?.toLowerCase() ?? ""] ?? {
    label: status ?? "Unknown",
    color: "text-slate-500",
    bg: "bg-slate-500/10",
    icon: <Clock className="w-3.5 h-3.5" />,
  };

const FILTER_OPTIONS = [
  { value: "", label: "All Channels" },
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
];

const STATUS_FILTERS = [
  { value: "", label: "All Status" },
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
];

// ── Component ────────────────────────────────────────────────────
export default function AdminNotifications(): ReactNode {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [channelFilter, setChannelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const LIMIT = 20;

  const fetchLogs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(channelFilter && { channel: channelFilter }),
        ...(statusFilter  && { status:  statusFilter }),
      });
      const res = await apiFetch(`/api/notifications/logs?${params}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        // Legacy fallback if backend still returns plain array
        setLogs(data);
        setTotal(data.length);
      } else {
        setLogs(data.logs ?? []);
        setTotal(data.total ?? 0);
      }
    } catch (err) {
      console.error("Failed to fetch notification logs:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, channelFilter, statusFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Reset to page 1 when filters change
  const handleChannelFilter = (val: string) => { setChannelFilter(val); setPage(1); };
  const handleStatusFilter  = (val: string) => { setStatusFilter(val);  setPage(1); };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  // ── Summary counts from current page (approximate) ────────────
  const sentCount   = logs.filter(l => l.status?.toLowerCase() === "sent").length;
  const failedCount = logs.filter(l => l.status?.toLowerCase() === "failed").length;

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">

      {/* ── App Bar ── */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 flex items-center justify-between pt-safe">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-1.5 rounded-lg">
              <Bell className="text-primary w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Notification Inbox</h1>
              <p className="text-[10px] text-slate-500">
                {total > 0 ? `${total} total log${total !== 1 ? "s" : ""}` : "No logs"}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => fetchLogs(true)}
          disabled={refreshing}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={cn("w-5 h-5", refreshing && "animate-spin")} />
        </button>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6 pb-32">

        {/* ── Page Title ── */}
        <div className="hidden sm:block space-y-1">
          <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-blue-100 dark:to-slate-400">
            Notification Inbox
          </h1>
          <p className="text-sm font-bold text-primary/80 uppercase tracking-widest">
            Email · SMS · Push Delivery Logs
          </p>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "Total", value: total, color: "text-primary", bg: "bg-primary/10", icon: <Inbox className="w-5 h-5" /> },
            { label: "Sent",  value: sentCount, color: "text-emerald-500", bg: "bg-emerald-500/10", icon: <CheckCircle2 className="w-5 h-5" /> },
            { label: "Failed",value: failedCount, color: "text-rose-500", bg: "bg-rose-500/10", icon: <XCircle className="w-5 h-5" /> },
          ].map(({ label, value, color, bg, icon }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-2"
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", bg)}>
                <span className={color}>{icon}</span>
              </div>
              <div>
                <p className={cn("text-2xl font-black", color)}>{value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={channelFilter}
              onChange={e => handleChannelFilter(e.target.value)}
              className="text-sm font-bold bg-transparent outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {FILTER_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
            <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={e => handleStatusFilter(e.target.value)}
              className="text-sm font-bold bg-transparent outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {STATUS_FILTERS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {(channelFilter || statusFilter) && (
            <button
              onClick={() => { handleChannelFilter(""); handleStatusFilter(""); }}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 rounded-xl px-3 py-2 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* ── Log List ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Loading Logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4 bg-white dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center">
              <Inbox className="w-8 h-8 text-primary/60" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-black uppercase tracking-widest">Inbox is Empty</p>
              <p className="text-xs text-slate-500">No notification logs match the current filters.</p>
            </div>
            {(channelFilter || statusFilter) && (
              <button
                onClick={() => { handleChannelFilter(""); handleStatusFilter(""); }}
                className="text-xs font-bold text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${page}-${channelFilter}-${statusFilter}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {logs.map((log, idx) => {
                const ch = getChannel(log.channel);
                const st = getStatus(log.status);
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-primary/20 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Channel Icon */}
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border", ch.bg, ch.border)}>
                        <span className={ch.color}>{ch.icon}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold dark:text-white leading-snug line-clamp-2">
                            {log.message || "No message content"}
                          </p>
                          <span className={cn(
                            "flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full shrink-0 uppercase tracking-wide",
                            st.bg, st.color
                          )}>
                            {st.icon} {st.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          {/* Channel badge */}
                          <span className={cn(
                            "flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full border uppercase",
                            ch.bg, ch.border, ch.color
                          )}>
                            {ch.icon}
                            <span>{ch.label}</span>
                          </span>

                          {/* Shipment link */}
                          {log.shipment_id && (
                            <Link
                              to={`/admin/shipment/${log.shipment_id}`}
                              className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                            >
                              <Package className="w-3 h-3" />
                              {log.shipment_id}
                            </Link>
                          )}

                          {/* Timestamp */}
                          {log.timestamp && (
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold ml-auto">
                              <Clock className="w-3 h-3" />
                              {new Date(log.timestamp).toLocaleString([], {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-500 font-bold">
              Page {page} of {totalPages} · {total} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500 disabled:opacity-40 hover:border-primary/30 hover:text-primary transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers (show up to 5) */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const p = start + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-9 h-9 rounded-xl text-sm font-black transition-all active:scale-95",
                      p === page
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary/30 hover:text-primary"
                    )}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500 disabled:opacity-40 hover:border-primary/30 hover:text-primary transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Settings Link ── */}
        <div className="flex items-center justify-center pt-2">
          <Link
            to="/admin/settings"
            className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 group"
          >
            <Bell className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
            Manage notification preferences in Settings
          </Link>
        </div>
      </main>

      <AdminNav />
    </div>
  );
}
