import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Share2, MoreVertical, Truck, MapPin, Weight, Clock, Phone, Mail, Navigation, Headset, Edit3, X } from "lucide-react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { Shipment } from "../../types";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";

export default function ShipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    apiFetch(`/api/shipments/${id}`).then(res => res.json()).then(setShipment);
  }, [id]);

  const handleUpdate = async () => {
    await apiFetch(`/api/shipments/${id}/updates`, {
      method: "POST",
      body: JSON.stringify({
        status: newStatus,
        location: shipment?.receiver_city,
        notes: notes
      })
    });
    setShowUpdateModal(false);
    apiFetch(`/api/shipments/${id}`).then(res => res.json()).then(setShipment);
  };

  if (!shipment) return null;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as const }
  };

  return (
    <div className="bg-slate-950 font-display text-slate-100 min-h-screen pb-32 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-[-20%] w-[60%] h-[40%] bg-accent/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

      <header className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 border-b border-white/10 p-4 rounded-none">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-white hover:bg-white/10 p-2 rounded-full transition-colors border border-transparent hover:border-white/10">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold leading-tight tracking-tight">Active Route</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"><Share2 className="w-5 h-5" /></button>
            <button className="text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <motion.div variants={itemVariants} className="p-4">
            <div className="flex items-start justify-between glass-panel bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-primary/30 transition-colors duration-500"></div>
              <div className="flex flex-col gap-1.5 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                  <p className="text-accent text-xs font-black uppercase tracking-widest">{shipment.status}</p>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white mb-1">{shipment.id}</h1>
                <p className="text-slate-400 text-sm font-medium">{shipment.type} • Est. <span className="text-slate-200 font-bold">{shipment.est_delivery}</span></p>
              </div>
              <div className="bg-gradient-to-br from-primary to-blue-700 text-white p-3.5 rounded-xl shadow-lg shadow-primary/30 relative z-10 border border-white/20">
                <Truck className="w-8 h-8" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="px-4 py-2">
            <div className="relative group rounded-2xl overflow-hidden glass-panel border border-white/10">
              <div className="w-full h-56 bg-slate-900 bg-cover bg-center opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" style={{ backgroundImage: `url(https://picsum.photos/seed/${shipment.id}/600/300)` }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="bg-primary/90 hover:bg-primary text-white p-3 px-5 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 text-sm font-bold transition-all active:scale-95 border border-white/20 backdrop-blur-md">
                  <Navigation className="w-4 h-4" /> Navigate
                </button>
              </div>
            </div>
          </motion.div>

          <motion.section variants={itemVariants} className="mt-8">
            <h3 className="px-5 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Customer Information</h3>
            <div className="glass-panel mx-4 rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/10">
              <div className="flex items-center gap-4 p-4">
                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
                  <img className="h-full w-full object-cover" src={`https://picsum.photos/seed/${shipment.receiver_name}/100/100`} referrerPolicy="no-referrer" alt="Recipient" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-100">{shipment.receiver_name}</p>
                  <p className="text-xs text-slate-400 font-medium">Recipient</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 bg-white/5 hover:bg-white/10 text-primary rounded-xl border border-white/5 transition-colors"><Phone className="w-5 h-5 text-slate-200" /></button>
                  <button className="p-2.5 bg-white/5 hover:bg-white/10 text-primary rounded-xl border border-white/5 transition-colors"><Mail className="w-5 h-5 text-slate-200" /></button>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="mt-8">
            <h3 className="px-5 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Delivery Details</h3>
            <div className="grid grid-cols-1 gap-3 px-4">
              <div className="glass-panel bg-white/5 p-4 rounded-2xl border border-white/10 flex gap-4 items-center">
                <div className="bg-white/5 p-2 rounded-lg"><MapPin className="w-5 h-5 text-slate-300" /></div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Address</p>
                  <p className="font-medium text-slate-200">{shipment.receiver_address}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-panel bg-white/5 p-4 rounded-2xl border border-white/10 flex gap-4 items-center">
                  <div className="bg-white/5 p-2 rounded-lg"><Weight className="w-5 h-5 text-slate-300" /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Weight</p>
                    <p className="font-medium text-slate-200">{shipment.weight} kg</p>
                  </div>
                </div>
                <div className="glass-panel bg-white/5 p-4 rounded-2xl border border-white/10 flex gap-4 items-center">
                  <div className="bg-white/5 p-2 rounded-lg"><Clock className="w-5 h-5 text-slate-300" /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Window</p>
                    <p className="font-medium text-slate-200">2PM - 4PM</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="mt-8">
            <div className="px-5 flex items-center justify-between mb-5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Shipping History</h3>
              <Link to={`/driver/customs/${shipment.id}`} className="text-xs font-bold text-accent hover:text-accent/80 transition-colors flex items-center gap-1">
                Customs Docs <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            </div>
            <div className="px-6 space-y-6 relative before:content-[''] before:absolute before:left-[35px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
              {shipment.updates?.map((update, idx) => (
                <div key={update.id} className="relative flex gap-6">
                  <div className={cn(
                    "z-10 h-5 w-5 rounded-full border-4 border-slate-950",
                    idx === 0 ? "bg-accent shadow-[0_0_12px_rgba(249,115,22,0.6)]" : "bg-slate-700"
                  )}></div>
                  <div className="flex-1 pb-4 glass-panel bg-white/5 p-4 rounded-2xl border border-white/5 -mt-3">
                    <div className="flex justify-between items-start mb-1">
                      <p className={cn("font-bold", idx === 0 ? "text-accent" : "text-slate-200")}>{update.status}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                        {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{update.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-40 pointer-events-none">
        <div className="max-w-2xl mx-auto flex gap-3 pointer-events-auto">
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-all active:scale-[0.98] border border-white/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Edit3 className="w-5 h-5 relative z-10" /> <span className="relative z-10">Update Status</span>
          </button>
          <button className="w-16 glass-panel bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 border border-white/20">
            <Headset className="w-6 h-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showUpdateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-panel w-full max-w-md rounded-3xl p-6 space-y-6 border border-white/20 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent"></div>

              <div className="flex justify-between items-center pt-2">
                <h3 className="text-xl font-black text-white">Update Route Status</h3>
                <button onClick={() => setShowUpdateModal(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 text-slate-300 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Status</label>
                  <select
                    className="w-full glass-panel bg-white/5 border border-white/10 rounded-xl h-14 px-4 text-white outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                  >
                    <option value="" className="bg-slate-900">Select Status</option>
                    <option value="In Transit" className="bg-slate-900">In Transit</option>
                    <option value="Held by Customs" className="bg-slate-900">Held by Customs</option>
                    <option value="Cleared by Customs" className="bg-slate-900">Cleared by Customs</option>
                    <option value="Out for Delivery" className="bg-slate-900">Out for Delivery</option>
                    <option value="Delivered" className="bg-slate-900">Delivered</option>
                    <option value="Delayed" className="bg-slate-900">Delayed</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Driver Notes</label>
                  <textarea
                    className="w-full glass-panel bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-500 font-medium resize-none"
                    placeholder="Add specific details or issues encountered..."
                    rows={4}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowUpdateModal(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-white glass-panel bg-white/5 rounded-xl border border-transparent transition-colors">Cancel</button>
                <button onClick={handleUpdate} className="flex-1 bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold border border-white/20 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">Submit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
