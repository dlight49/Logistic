import React, { useState, useEffect, ReactNode, HTMLAttributes } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Bell, CloudUpload, CheckCircle2, Clock, Eye, Download, AlertCircle, Home, Truck, FileText, User, X } from "lucide-react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { Shipment, CustomsDoc } from "../../types";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";

type CustomsShipment = Shipment & { docs: CustomsDoc[] };

export default function CustomsPortal(): ReactNode {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<CustomsShipment | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newDocType, setNewDocType] = useState<string>("Bill of Lading");
  const [loading, setLoading] = useState<boolean>(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchShipment = () => {
    apiFetch(`/api/shipments/${id}`).then(res => res.json()).then(setShipment);
  };

  useEffect(() => {
    fetchShipment();
  }, [id]);

  const handleUpload = async () => {
    setLoading(true);
    try {
      // Simulate premium loading delay
      await new Promise(r => setTimeout(r, 800));
      const res = await apiFetch(`/api/shipments/${id}/docs`, {
        method: "POST",
        body: JSON.stringify({ doc_type: newDocType })
      });
      if (res.ok) {
        setShowUploadModal(false);
        fetchShipment();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (docId: number, status: 'verified' | 'pending' | 'rejected' | 'missing') => {
    try {
      const res = await apiFetch(`/api/docs/${docId}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchShipment();
    } catch (err) {
      console.error(err);
    }
  };

  if (!shipment) return null;

  const requiredDocs = ["Bill of Lading", "Commercial Invoice", "Packing List"];
  const uploadedDocs = shipment.docs || [];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } as const }
  };

  return (
    <div className="bg-slate-950 font-display text-slate-100 antialiased min-h-screen flex flex-col relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[20%] left-[-20%] w-[60%] h-[40%] bg-accent/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse-slow" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

      <header className="sticky top-0 z-50 flex items-center glass-panel p-4 border-x-0 border-t-0 border-b border-white/10 justify-between rounded-none">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight">Customs Gateway</h2>
        </div>
        <button className="flex size-10 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
        </button>
      </header>

      <main className="flex-1 flex flex-col gap-6 p-4 relative z-10 pb-[calc(8rem+env(safe-area-inset-bottom))]">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
          <motion.section variants={itemVariants} className="flex flex-col gap-4 rounded-3xl p-6 glass-panel border border-white/10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4">
              <FileText className="w-48 h-48" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
            <div className="relative z-10">
              <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest mb-2">Clearance Processing</p>
              <h1 className="text-3xl font-black leading-tight text-white">{shipment.id}</h1>
              <div className="mt-4 flex items-center gap-2 glass-panel bg-background-dark/50 w-fit px-3 py-1.5 rounded-lg border border-white/10">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                <p className="text-emerald-400 text-xs font-black uppercase tracking-wider">{shipment.status}</p>
              </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="flex flex-col gap-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Actions</h3>
            <button
              onClick={() => setShowUploadModal(true)}
              className="group flex w-full items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-white font-bold shadow-lg hover:border-accent/40 hover:bg-accent/10 transition-all duration-300 active:scale-[0.98] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="bg-accent/20 text-accent p-2 rounded-xl group-hover:bg-accent group-hover:text-white transition-colors">
                  <CloudUpload className="w-6 h-6" />
                </div>
                <span className="text-lg">Upload Documents</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-accent relative z-10 transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
              </div>
            </button>
          </motion.section>

          <motion.section variants={itemVariants} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1 mb-1">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Document Repository</h3>
              <span className="glass-panel text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full border border-white/10">{uploadedDocs.length} Total</span>
            </div>

            {uploadedDocs.length === 0 ? (
              <div className="py-16 text-center glass-panel bg-white/5 rounded-3xl border border-dashed border-white/20">
                <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm text-slate-400 font-medium">No documents uploaded yet</p>
                <p className="text-xs text-slate-500 mt-1">Tap the upload button above to add documents.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {uploadedDocs.map((doc, i) => (
                  <motion.div key={doc.id} variants={itemVariants} custom={i}>
                    <DocCard
                      title={doc.doc_type}
                      status={doc.status as 'verified' | 'pending' | 'rejected' | 'missing'}
                      date={new Date(doc.uploaded_at).toLocaleDateString()}
                      isAdmin={user.role === 'admin'}
                      onUpdateStatus={(status: 'verified' | 'pending' | 'rejected' | 'missing') => handleUpdateStatus(doc.id, status)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </motion.div>
      </main>

      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-panel w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden border border-white/20"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-black text-white">Upload New Doc</h3>
                <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Type</label>
                  <select
                    className="w-full px-4 py-4 glass-panel bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-accent appearance-none"
                    value={newDocType}
                    onChange={e => setNewDocType(e.target.value)}
                  >
                    {requiredDocs.map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                    <option value="Other" className="bg-slate-900">Other</option>
                  </select>
                </div>

                <div className="border-2 border-dashed border-white/20 rounded-2xl p-10 text-center flex flex-col items-center gap-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="bg-accent/20 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <CloudUpload className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Tap to select or drag file here</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 glass-panel bg-white/5 py-4 rounded-xl font-bold text-slate-300 border border-white/5 hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading}
                    onClick={handleUpload}
                    className="flex-[2] bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold border border-white/20 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Uploading...
                      </span>
                    ) : "Confirm Upload"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none">
        <div className="max-w-md mx-auto glass-panel rounded-2xl border border-white/10 px-6 py-3 flex justify-around items-center shadow-2xl pointer-events-auto">
          <Link to="/driver" className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-white transition-colors">
            <Home className="w-6 h-6" />
            <p className="text-[9px] font-bold uppercase tracking-widest mt-1">Home</p>
          </Link>
          <div className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-white transition-colors">
            <Truck className="w-6 h-6" />
            <p className="text-[9px] font-bold uppercase tracking-widest mt-1">Routes</p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-1 text-accent relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-ping"></div>
            <FileText className="w-6 h-6 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
            <p className="text-[9px] font-black uppercase tracking-widest mt-1">Docs</p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-white transition-colors">
            <User className="w-6 h-6" />
            <p className="text-[9px] font-bold uppercase tracking-widest mt-1">Profile</p>
          </div>
        </div>
      </nav>
    </div>
  );
}

interface DocCardProps {
  title: string;
  date: string;
  status: 'verified' | 'pending' | 'rejected' | 'missing';
  isAdmin: boolean;
  onUpdateStatus: (status: 'verified' | 'pending' | 'rejected' | 'missing') => void;
}

interface StatusConfig {
  icon: ReactNode;
  text: string;
  color: string;
  bg: string;
}

function DocCard({ title, date, status, isAdmin, onUpdateStatus }: DocCardProps): ReactNode {
  const statusConfig: Record<'verified' | 'pending' | 'rejected' | 'missing', StatusConfig> = {
    verified: { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, text: "Verified", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    pending: { icon: <Clock className="w-4 h-4 text-accent" />, text: "Pending Review", color: "text-accent", bg: "bg-accent/10 border-accent/20" },
    rejected: { icon: <AlertCircle className="w-4 h-4 text-rose-400" />, text: "Rejected", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
    missing: { icon: <AlertCircle className="w-4 h-4 text-rose-400" />, text: "Missing Docs", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={cn("flex flex-col gap-4 rounded-2xl p-5 border glass-panel transition-colors duration-300", config.bg, status === 'pending' ? 'hover:bg-white/5 hover:border-white/10' : '')}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          <div className={cn("flex items-center gap-1.5 bg-background-dark/50 w-fit px-2 py-1 rounded-md mb-1", config.color)}>
            {config.icon}
            <p className="text-[10px] font-black uppercase tracking-widest">{config.text}</p>
          </div>
          <p className="text-lg font-bold text-white tracking-tight">{title}</p>
          <p className="text-slate-400 text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Uploaded: {date}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex size-10 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors pointer-events-auto">
            <Eye className="w-5 h-5" />
          </button>
          <button className="flex size-10 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors pointer-events-auto">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
      {isAdmin && status === 'pending' && (
        <div className="mt-2 pt-4 border-t border-white/10">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Dispatcher Actions</p>
          <div className="flex gap-2 relative z-20 pointer-events-auto">
            <button
              onClick={(e) => { e.stopPropagation(); onUpdateStatus('verified'); }}
              className="flex-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 py-3 text-sm font-bold text-emerald-400 transition-colors"
            >
              Approve Document
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onUpdateStatus('rejected'); }}
              className="flex-[0.5] rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 py-3 text-sm font-bold text-rose-400 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronRight({ ...props }: HTMLAttributes<HTMLSpanElement>): ReactNode {
  return <span {...props} className="material-symbols-outlined">expand_more</span>;
}
