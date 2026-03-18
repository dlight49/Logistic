import React, { useState, ReactNode } from "react";
import { 
  Search, Package, MapPin, Calendar, CheckCircle2, AlertCircle, 
  Clock, ChevronRight, Headset, User, LogOut, LayoutDashboard,
  Weight, Ruler, Shield, Info, Download, Share2
} from "lucide-react";
import { cn } from "../../utils";
import { Shipment } from "../../types";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

export default function TrackingPage(): ReactNode {
  const { user, logout } = useAuth();
  const [trackingId, setTrackingId] = useState<string>("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!trackingId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/shipments/${trackingId}/track`);
      if (!res.ok) throw new Error("Tracking ID not found. Please verify the number.");
      const data = await res.json();
      setShipment(data);
    } catch (err: any) {
      setError(err.message);
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 relative overflow-hidden font-sans">

      {/* Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <header className="p-4 sm:p-6 lg:p-8 z-50 sticky top-0 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/40">
              <Package className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic">Lumin<span className="text-blue-500">Logistics</span></h1>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin' : user.role === 'operator' ? '/driver' : '/customer'}
                className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" /> My Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 z-10 flex flex-col mt-4 sm:mt-12">

        {/* Hero Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 sm:space-y-8 mb-16"
        >
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase italic">
            Trace Your <span className="text-blue-500 underline decoration-indigo-500 underline-offset-8">Cargo</span>
          </h2>
          
          <form onSubmit={handleTrack} className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 group-hover:opacity-40 blur-lg transition duration-500 rounded-3xl"></div>
            <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-[2rem] p-2 transition-all duration-300 transform group-hover:-translate-y-1">
              <Search className="absolute left-8 text-slate-500 w-6 h-6" />
              <input
                className="w-full bg-transparent border-none pl-16 pr-4 py-5 text-lg sm:text-xl font-bold italic focus:ring-0 outline-none placeholder:text-slate-700 text-white uppercase tracking-wider"
                placeholder="ENTER TRACKING NUMBER (e.g. GS-2026-X8Y2)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 sm:px-12 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all disabled:opacity-50 active:scale-95 whitespace-nowrap shadow-xl shadow-blue-900/40"
              >
                {loading ? "SEARCHING..." : "TRACK"}
              </button>
            </div>
          </form>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-6 rounded-3xl flex items-center justify-center gap-4 max-w-xl mx-auto w-full backdrop-blur-sm"
            >
              <AlertCircle className="w-6 h-6" />
              <p className="text-sm font-black uppercase tracking-wider">{error}</p>
            </motion.div>
          )}

          {shipment && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
              {/* Left Column: Shipment Overview & Timeline */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2 space-y-8"
              >
                {/* Master Progress Card */}
                <section className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                  
                  <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-8 mb-12">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Tracking Authority</p>
                      <h3 className="text-3xl font-black italic">{shipment.id}</h3>
                      <div className="flex gap-2">
                        <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-blue-500/20">{shipment.type}</span>
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-emerald-500/20">Active</span>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center gap-4 backdrop-blur-xl">
                      <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
                        <Clock className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Estimated Delivery</p>
                        <p className="text-xl font-black text-white italic">{shipment.est_delivery}</p>
                      </div>
                    </div>
                  </div>

                  {/* Route Visual */}
                  <div className="relative mb-12">
                    <div className="flex justify-between items-end px-4 mb-4">
                      <div className="text-left">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Origin</p>
                        <p className="text-xl font-black text-white">{shipment.sender_city}</p>
                        <p className="text-xs font-bold text-slate-500">{shipment.sender_country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Destination</p>
                        <p className="text-xl font-black text-blue-500">{shipment.receiver_city}</p>
                        <p className="text-xs font-bold text-slate-500">{shipment.receiver_country}</p>
                      </div>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: shipment.status === 'Delivered' ? '100%' :
                            shipment.status === 'Out for Delivery' ? '85%' :
                              shipment.status === 'Held by Customs' ? '60%' :
                                shipment.status === 'In Transit' ? '35%' : '10%'
                        }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="h-full bg-blue-600 rounded-full relative"
                      >
                        <div className="absolute top-0 right-0 w-12 h-full bg-white/30 blur-md"></div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                    <StatusStep active={true} label="Booked" done={true} />
                    <StatusStep active={['In Transit', 'Held by Customs', 'Out for Delivery', 'Delivered'].includes(shipment.status)} label="In Transit" done={['Held by Customs', 'Out for Delivery', 'Delivered'].includes(shipment.status)} />
                    <StatusStep active={['Held by Customs', 'Out for Delivery', 'Delivered'].includes(shipment.status)} label="Customs" done={['Out for Delivery', 'Delivered'].includes(shipment.status)} />
                    <StatusStep active={shipment.status === 'Delivered'} label="Arrived" done={shipment.status === 'Delivered'} />
                  </div>
                </section>

                {/* Timeline History */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Movement Records</h3>
                  </div>
                  <div className="space-y-4">
                    {shipment.updates?.map((update, idx) => (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn(
                          "group relative flex gap-6 p-6 rounded-3xl border transition-all duration-300",
                          idx === 0 ? "bg-blue-600/5 border-blue-500/20" : "bg-white/5 border-white/5 hover:bg-white/[0.07]"
                        )}
                      >
                        <div className="flex flex-col items-center shrink-0">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 shadow-lg",
                            idx === 0 ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-800 border-white/10 text-slate-500"
                          )}>
                            {idx === 0 ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-2 h-2 rounded-full bg-slate-600" />}
                          </div>
                          {idx !== shipment.updates!.length - 1 && <div className="w-px h-full bg-white/10 mt-4"></div>}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                            <h4 className={cn("text-lg font-black uppercase italic", idx === 0 ? "text-blue-500" : "text-white")}>
                              {update.status}
                            </h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-lg">
                              {new Date(update.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} · {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-slate-400 leading-relaxed">{update.notes}</p>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 pt-2">
                            <MapPin className="w-3 h-3 text-blue-500" />
                            {update.location}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </motion.div>

              {/* Right Column: Shipment Facts & Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Shipment Facts */}
                <section className="bg-slate-900 border border-white/10 rounded-[2rem] p-8 space-y-8 shadow-xl">
                  <div className="flex items-center gap-3">
                    <Info className="text-blue-500 w-5 h-5" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Cargo Profile</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <FactItem icon={<Weight />} label="Gross Weight" value={`${shipment.weight} KG`} />
                    <FactItem icon={<Ruler />} label="Dimensions" value="120 x 80 x 100 cm" />
                    <FactItem icon={<Shield />} label="Security Level" value="Level 4 (High)" />
                    <FactItem icon={<Package />} label="Package Type" value="Standard Container" />
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-3">
                    <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                      <Download className="w-4 h-4" /> Export Waybill
                    </button>
                    <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                      <Share2 className="w-4 h-4" /> Share Status
                    </button>
                  </div>
                </section>

                {/* Support Sidebar */}
                <section className="bg-blue-600 rounded-[2rem] p-8 text-white space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-xl">
                      <Headset className="w-6 h-6" />
                    </div>
                    <h4 className="text-2xl font-black uppercase italic tracking-tighter">Human Support</h4>
                    <p className="text-blue-100 text-sm font-bold uppercase tracking-tight leading-relaxed">Questions about your delivery? Our global dispatch team is ready to assist.</p>
                    <Link to="/customer/tickets" className="block w-full">
                      <button className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-900 transition-all">
                        Connect with Agent
                      </button>
                    </Link>
                  </div>
                </section>
              </motion.div>
            </div>
          )}

          {!shipment && !loading && trackingId === "" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 opacity-20 mt-10"
            >
              <Package className="w-32 h-32 mb-6" />
              <p className="text-2xl font-black uppercase tracking-[0.5em] italic">Authorized Access Only</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 p-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 italic">Global Logistics Intelligence System &copy; 2026</p>
      </footer>
    </div>
  );
}

function StatusStep({ active, label, done }: { active: boolean; label: string; done: boolean }): ReactNode {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn(
        "w-8 h-8 rounded-2xl border-4 flex items-center justify-center transition-all duration-500 z-10",
        done ? "bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]" :
          active ? "bg-slate-800 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.2)]" : "bg-slate-900 border-white/5"
      )}>
        {done && <CheckCircle2 className="w-4 h-4 text-white" />}
        {!done && active && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
      </div>
      <span className={cn(
        "text-[10px] font-black uppercase tracking-widest transition-colors text-center",
        active || done ? "text-white" : "text-slate-600"
      )}>
        {label}
      </span>
    </div>
  );
}

function FactItem({ icon, label, value }: { icon: ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-blue-500 group-hover:border-blue-500/30 transition-all">
        {React.cloneElement(icon as React.isValidElement<any>, { className: "w-5 h-5" })}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-black text-white italic uppercase tracking-tight">{value}</p>
      </div>
    </div>
  );
}

