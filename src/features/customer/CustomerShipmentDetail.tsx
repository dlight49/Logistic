import React, { useState, useEffect, ReactNode } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Package,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Truck,
  User,
  Phone,
  Mail,
  FileText,
  Gavel,
  ExternalLink,
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";

// ── Status helpers ──────────────────────────────────────────────
const STATUS_MAP: Record<string, { color: string; bg: string; border: string; icon: ReactNode }> = {
  "Order Created":   { color: "text-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    icon: <Clock className="w-5 h-5" /> },
  "Picked Up":       { color: "text-indigo-500",  bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  icon: <Package className="w-5 h-5" /> },
  "In Transit":      { color: "text-violet-500",  bg: "bg-violet-500/10",  border: "border-violet-500/20",  icon: <Truck className="w-5 h-5" /> },
  "Out for Delivery":{ color: "text-amber-500",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   icon: <Navigation className="w-5 h-5" /> },
  "Delivered":       { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: <CheckCircle2 className="w-5 h-5" /> },
  "Held by Customs": { color: "text-rose-500",    bg: "bg-rose-500/10",    border: "border-rose-500/20",    icon: <AlertTriangle className="w-5 h-5" /> },
  "Delayed":         { color: "text-orange-500",  bg: "bg-orange-500/10",  border: "border-orange-500/20",  icon: <AlertTriangle className="w-5 h-5" /> },
};

const getStatus = (status: string) =>
  STATUS_MAP[status] ?? { color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", icon: <Package className="w-5 h-5" /> };

// ── Progress Steps ──────────────────────────────────────────────
const STEPS = ["Order Created", "Picked Up", "In Transit", "Out for Delivery", "Delivered"];

function progressIndex(status: string): number {
  const i = STEPS.indexOf(status);
  return i >= 0 ? i : (status === "Held by Customs" || status === "Delayed" ? -1 : 0);
}

// ── Main Component ──────────────────────────────────────────────
export default function CustomerShipmentDetail(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiFetch(`/api/shipments/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setShipment(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Shipment not found or you don't have access.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Loading Shipment...</p>
    </div>
  );

  if (error || !shipment) return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center border border-rose-500/20">
        <AlertCircle className="w-10 h-10 text-rose-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black dark:text-white">Shipment Not Found</h2>
        <p className="text-sm text-slate-500 max-w-xs">{error || "This shipment does not exist."}</p>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
      >
        <ChevronLeft className="w-4 h-4" /> Go Back
      </button>
    </div>
  );

  const status = getStatus(shipment.status);
  const stepIdx = progressIndex(shipment.status);
  const isHeld = shipment.status === "Held by Customs" || shipment.status === "Delayed";
  const sortedUpdates = [...(shipment.updates || [])].sort(
    (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans pb-32">

      {/* ── App Bar ── */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-black tracking-tight dark:text-white truncate">{shipment.id}</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Shipment Detail</p>
        </div>
        <Link
          to={`/track?id=${shipment.id}`}
          className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary active:scale-90 transition-transform"
          title="Open public tracker"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </header>

      <main className="px-4 pt-6 space-y-5 max-w-lg mx-auto">

        {/* ── Status Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-5 rounded-3xl border flex items-center gap-4",
            status.bg, status.border
          )}
        >
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border", status.bg, status.border, status.color)}>
            {status.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Status</p>
            <p className={cn("text-lg font-black leading-tight", status.color)}>{shipment.status}</p>
            {sortedUpdates[0]?.timestamp && (
              <p className="text-[10px] text-slate-400 mt-0.5">
                Updated {new Date(sortedUpdates[0].timestamp).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
              </p>
            )}
          </div>
        </motion.div>

        {/* ── Alert for held/delayed ── */}
        {isHeld && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-rose-600 dark:text-rose-400">Action May Be Required</p>
              <p className="text-xs text-rose-500/80 mt-1">
                Your shipment is currently <span className="font-bold">{shipment.status}</span>. Please contact our support team if you have questions.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Progress Stepper ── */}
        {!isHeld && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-5"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Progress</p>
            <div className="flex items-center gap-0.5">
              {STEPS.map((step, i) => {
                const done = i <= stepIdx;
                const active = i === stepIdx;
                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all text-[10px] font-black",
                        done
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                          : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400"
                      )}>
                        {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
                      </div>
                      <p className={cn(
                        "text-[8px] font-black uppercase tracking-wide text-center leading-tight hidden sm:block",
                        active ? "text-primary" : done ? "text-slate-600 dark:text-slate-400" : "text-slate-400"
                      )}>
                        {step.replace("Out for ", "")}
                      </p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={cn(
                        "h-0.5 flex-1 transition-all mb-4",
                        i < stepIdx ? "bg-primary" : "bg-slate-200 dark:bg-white/10"
                      )} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Package Info ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Package Info</h3>
          </div>
          <div className="px-5 py-4 grid grid-cols-2 gap-4">
            {[
              { label: "Weight", value: shipment.weight ? `${shipment.weight} kg` : "—" },
              { label: "Description", value: shipment.package_description || "—" },
              { label: "Fragile", value: shipment.is_fragile ? "Yes" : "No" },
              { label: "Est. Delivery", value: shipment.estimated_delivery ? new Date(shipment.estimated_delivery).toLocaleDateString([], { dateStyle: "medium" }) : "TBD" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                <p className="text-sm font-bold dark:text-white mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── From → To ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Route</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {/* From */}
            <div className="px-5 py-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">From (Sender)</p>
                <p className="font-black text-sm dark:text-white mt-0.5">{shipment.sender_name}</p>
                <p className="text-xs text-slate-500">{shipment.sender_address}</p>
                <p className="text-xs text-slate-500">{shipment.sender_city}, {shipment.sender_country}</p>
              </div>
            </div>
            {/* Arrow */}
            <div className="px-5 py-2 flex items-center gap-3">
              <div className="w-8 flex justify-center">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-0.5 h-2 bg-slate-200 dark:bg-white/10" />
                  <Truck className="w-4 h-4 text-primary" />
                  <div className="w-0.5 h-2 bg-slate-200 dark:bg-white/10" />
                </div>
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">In Transit</p>
            </div>
            {/* To */}
            <div className="px-5 py-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">To (Recipient)</p>
                <p className="font-black text-sm dark:text-white mt-0.5">{shipment.receiver_name}</p>
                <p className="text-xs text-slate-500">{shipment.receiver_address}</p>
                <p className="text-xs text-slate-500">{shipment.receiver_city}, {shipment.receiver_country}</p>
                <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
                  {shipment.receiver_phone && (
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Phone className="w-3 h-3" /> {shipment.receiver_phone}
                    </span>
                  )}
                  {shipment.receiver_email && (
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Mail className="w-3 h-3" /> {shipment.receiver_email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Tracking Timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-3 px-1">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Tracking History</h3>
            <span className="ml-auto text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {sortedUpdates.length} Events
            </span>
          </div>

          {sortedUpdates.length === 0 ? (
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 text-center">
              <Clock className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-400">No tracking events yet</p>
              <p className="text-xs text-slate-400 mt-1">Events will appear here as your shipment moves.</p>
            </div>
          ) : (
            <div className="space-y-0 relative">
              <AnimatePresence>
                {sortedUpdates.map((update: any, idx: number) => {
                  const s = getStatus(update.status);
                  const isLatest = idx === 0;
                  return (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="relative pl-10 pb-5"
                    >
                      {/* Vertical line */}
                      {idx !== sortedUpdates.length - 1 && (
                        <div className="absolute left-[14px] top-7 bottom-0 w-[2px] bg-slate-200 dark:bg-white/10" />
                      )}
                      {/* Dot */}
                      <div className={cn(
                        "absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center z-10 border-4 border-slate-50 dark:border-[#020617] transition-all",
                        isLatest ? "bg-primary shadow-lg shadow-primary/30" : "bg-slate-200 dark:bg-slate-700"
                      )}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      {/* Card */}
                      <div className={cn(
                        "bg-white dark:bg-white/5 rounded-2xl p-4 border transition-all",
                        isLatest
                          ? "border-primary/20 shadow-sm shadow-primary/10"
                          : "border-slate-200 dark:border-white/10"
                      )}>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className={cn("text-sm font-black leading-tight", isLatest ? s.color : "dark:text-white")}>
                            {update.status}
                          </span>
                          {isLatest && (
                            <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0", s.bg, s.color)}>
                              Latest
                            </span>
                          )}
                        </div>
                        {update.notes && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{update.notes}</p>
                        )}
                        <div className="flex items-center gap-3 flex-wrap">
                          {update.location && (
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                              <MapPin className="w-2.5 h-2.5" /> {update.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                            <Calendar className="w-2.5 h-2.5" />
                            {new Date(update.timestamp).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* ── Customs Documents ── */}
        {shipment.docs && shipment.docs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gavel className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Customs Documents</h3>
              </div>
              <span className="text-[9px] font-black bg-slate-100 dark:bg-white/5 text-slate-500 px-2 py-0.5 rounded-full">
                {shipment.docs.length} Files
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {shipment.docs.map((doc: any) => (
                <div key={doc.id} className="px-5 py-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold dark:text-white truncate">{doc.doc_type}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(doc.uploaded_at).toLocaleDateString([], { dateStyle: "medium" })}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[9px] font-black px-2.5 py-1 rounded-full uppercase shrink-0",
                    doc.status === "verified"
                      ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : doc.status === "pending"
                      ? "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  )}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Created Date Footer ── */}
        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pb-4">
          Shipment created {new Date(shipment.created_at).toLocaleDateString([], { dateStyle: "long" })}
        </p>
      </main>
    </div>
  );
}
