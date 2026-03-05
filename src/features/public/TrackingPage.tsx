import React, { useState, ReactNode } from "react";
import { Search, Package, MapPin, Calendar, CheckCircle2, AlertCircle, Clock, ChevronRight, Headset, User, LogOut, LayoutDashboard } from "lucide-react";
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
      const res = await fetch(`/api/shipments/${trackingId}`);
      if (!res.ok) throw new Error("Shipment not found");
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
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 relative overflow-hidden font-sans">

      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

      <header className="p-4 sm:p-6 lg:p-8 z-50 sticky top-0 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-xl border-b border-white/10 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-primary to-primary-light p-2 rounded-xl shadow-lg shadow-primary/20">
              <Package className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gradient">Lumin Logistics</h1>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : user.role === 'operator' ? '/driver' : '/customer'}
                  className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                >
                  <LogOut className="w-4 h-4 text-rose-500" /> <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 z-10 flex flex-col mt-4 sm:mt-12">

        {/* Hero Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-6 sm:space-y-8 mb-12"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Track Your <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-rose-500">
              Shipment
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm sm:text-base">
            Enter your tracking number below to get real-time updates on your delivery status.
          </p>

          <form onSubmit={handleTrack} className="max-w-xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-20 group-hover:opacity-40 blur-lg transition duration-500 rounded-2xl"></div>
            <div className="relative flex items-center glass-panel rounded-2xl p-2 sm:p-3 transition-all duration-300 transform group-hover:-translate-y-1">
              <Search className="absolute left-6 text-slate-400 w-5 h-5" />
              <input
                className="w-full bg-transparent border-none pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg focus:ring-0 outline-none placeholder:text-slate-500"
                placeholder="e.g. GS-2026-X8Y2"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-primary to-primary-light text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 active:scale-95 whitespace-nowrap"
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Package className="w-5 h-5" />
                  </motion.div>
                ) : "Track Now"}
              </button>
            </div>
          </form>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center justify-center gap-3 max-w-xl mx-auto w-full backdrop-blur-sm"
            >
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {shipment && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
              className="space-y-6 sm:space-y-8 max-w-3xl mx-auto w-full"
            >
              {/* Shipment Header Card */}
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel overflow-hidden rounded-3xl p-6 sm:p-8 relative"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Tracking Number</p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                      {shipment.id}
                      <span className="bg-primary/10 text-primary dark:bg-primary-light/20 dark:text-primary-light text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{shipment.type}</span>
                    </h2>
                  </div>
                  <div className="bg-white/5 dark:bg-slate-900/50 backdrop-blur-md border border-white/10 dark:border-slate-800/50 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                    <Calendar className="text-accent w-5 h-5" />
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Est. Delivery</p>
                      <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{shipment.est_delivery}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                      <MapPin className="text-slate-500 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">From</p>
                      <p className="font-bold text-slate-900 dark:text-white text-lg">{shipment.sender_city}</p>
                      <p className="text-slate-500 text-sm font-medium">{shipment.sender_country}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center justify-center opacity-30">
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
                  </div>
                  <div className="flex items-start gap-4 sm:justify-end">
                    <div className="sm:hidden bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                      <MapPin className="text-accent w-5 h-5" />
                    </div>
                    <div className="sm:text-right">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">To</p>
                      <p className="font-bold text-slate-900 dark:text-white text-lg">{shipment.receiver_city}</p>
                      <p className="text-slate-500 text-sm font-medium">{shipment.receiver_country}</p>
                    </div>
                    <div className="hidden sm:block bg-accent/10 p-3 rounded-full">
                      <MapPin className="text-accent w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Progress Bar Container */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 sm:p-8 rounded-3xl"
              >
                <div className="flex justify-between mb-8 relative z-10 px-2 sm:px-6">
                  <ProgressStep
                    active={true}
                    completed={['Order Created', 'In Transit', 'Held by Customs', 'Out for Delivery', 'Delivered'].includes(shipment.status)}
                    label="Created"
                  />
                  <ProgressStep
                    active={['In Transit', 'Held by Customs', 'Out for Delivery', 'Delivered'].includes(shipment.status)}
                    completed={['In Transit', 'Held by Customs', 'Out for Delivery', 'Delivered'].includes(shipment.status) && shipment.status !== 'In Transit'}
                    label="Transit"
                  />
                  <ProgressStep
                    active={['Held by Customs', 'Out for Delivery', 'Delivered'].includes(shipment.status)}
                    completed={['Held by Customs', 'Out for Delivery', 'Delivered'].includes(shipment.status) && shipment.status !== 'Held by Customs'}
                    label="Customs"
                  />
                  <ProgressStep
                    active={['Out for Delivery', 'Delivered'].includes(shipment.status)}
                    completed={shipment.status === 'Delivered'}
                    label="Delivered"
                  />
                </div>

                <div className="relative h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner mx-2 sm:mx-6">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: shipment.status === 'Delivered' ? '100%' :
                        shipment.status === 'Out for Delivery' ? '75%' :
                          shipment.status === 'Held by Customs' ? '50%' :
                            shipment.status === 'In Transit' ? '25%' : '5%'
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary-light to-accent rounded-full relative"
                  >
                    <div className="absolute top-0 right-0 w-10 h-full bg-white/30 blur-sm animate-[pulse-slow_2s_infinite]"></div>
                  </motion.div>
                </div>
              </motion.section>

              {/* Timeline Section */}
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-2"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Transit History
                </h3>
                <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.15rem] before:bg-slate-200 dark:before:bg-slate-800 before:w-0.5 before:z-0">
                  {shipment.updates?.map((update, idx) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (idx * 0.1) }}
                      className="relative pl-12 pb-8 group last:pb-0 z-10"
                    >
                      {/* Icon */}
                      <div className={cn(
                        "absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-background-light dark:border-background-dark shadow-sm transition-transform group-hover:scale-110",
                        idx === 0
                          ? "bg-gradient-to-br from-accent to-rose-500"
                          : "bg-slate-200 dark:bg-slate-700"
                      )}>
                        {idx === 0 ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400" />
                        )}
                      </div>

                      <div className={cn(
                        "rounded-2xl p-5 transition-all duration-300 border backdrop-blur-md",
                        idx === 0
                          ? "bg-accent/5 border-accent/20 shadow-[0_4px_20px_0_rgba(249,115,22,0.1)]"
                          : "glass-panel group-hover:-translate-y-1 group-hover:shadow-lg"
                      )}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <h4 className={cn("text-lg font-bold", idx === 0 ? "text-accent" : "text-slate-900 dark:text-slate-100")}>
                            {update.status}
                          </h4>
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg self-start">
                            {new Date(update.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">{update.notes}</p>
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                          <MapPin className="w-3.5 h-3.5" /> {update.location}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

            </motion.div>
          )}

          {!shipment && !loading && trackingId === "" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 opacity-30 mt-10 pointer-events-none"
            >
              <Package className="w-24 h-24 mb-4" />
              <p className="text-xl font-bold font-mono">LUMIN LOGISTICS</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Support Footer positioned statically if content is long, but visually floating */}
      {shipment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="max-w-3xl mx-auto w-full p-4 pb-8"
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary-light/5 border border-primary/20 backdrop-blur-xl rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-primary p-3 rounded-xl text-white shadow-md shadow-primary/30">
                <Headset className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Need help with this delivery?</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Our support team is available 24/7.</p>
              </div>
            </div>
            <Link to="/customer/tickets" className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2">
              Contact Support <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ProgressStep({ active, completed, label }: { active: boolean; completed: boolean; label: string }): ReactNode {
  return (
    <div className="flex flex-col items-center gap-3 w-16 sm:w-24">
      <div className={cn(
        "w-6 h-6 sm:w-8 sm:h-8 rounded-full border-4 flex items-center justify-center transition-all duration-500 z-10 shadow-sm",
        completed ? "bg-accent border-accent/30 shadow-[0_0_15px_rgba(249,115,22,0.4)]" :
          active ? "bg-primary border-primary/30 shadow-[0_0_15px_rgba(30,27,75,0.4)] dark:shadow-[0_0_15px_rgba(79,70,229,0.4)]" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      )}>
        {completed && <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
        {!completed && active && <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white" />}
      </div>
      <span className={cn(
        "text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors text-center",
        active ? "text-slate-900 dark:text-white" : "text-slate-400"
      )}>
        {label}
      </span>
    </div>
  );
}
