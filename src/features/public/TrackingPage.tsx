import React, { useState } from "react";
import { Search, Package, MapPin, Calendar, CheckCircle2, AlertCircle, Clock, ChevronRight, Headset } from "lucide-react";
import { cn } from "@/src/utils";
import { Shipment } from "@/src/types";

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
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
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark shadow-2xl">
      <header className="p-4 space-y-4 sticky top-0 bg-background-light dark:bg-background-dark z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-accent/10 p-1.5 rounded-lg">
              <Package className="text-accent w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Global Logistics</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              className="block w-full pl-10 pr-3 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-accent outline-none"
              placeholder="Track Shipment (e.g. GS-2026-X8Y2)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
          </div>
          <button 
            onClick={handleTrack}
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "..." : "Track"}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {shipment ? (
          <>
            <section className="bg-primary text-white rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-medium text-slate-300 uppercase tracking-widest">Tracking Number</p>
                    <h2 className="text-2xl font-bold">{shipment.id}</h2>
                  </div>
                  <span className="bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">{shipment.type}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[10px] text-slate-300 uppercase">From</p>
                    <p className="font-semibold">{shipment.sender_city}, {shipment.sender_country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-300 uppercase">To</p>
                    <p className="font-semibold">{shipment.receiver_city}, {shipment.receiver_country}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-accent w-4 h-4" />
                    <span className="text-sm font-medium">Est. Delivery: {shipment.est_delivery}</span>
                  </div>
                  <ChevronRight className="text-slate-300 w-4 h-4" />
                </div>
              </div>
            </section>

            {/* Progress Bar */}
            <section className="px-1">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between mb-6">
                  <ProgressStep 
                    active={true} 
                    completed={['Order Created', 'In Transit', 'Held by Customs', 'Out for Delivery', 'Delivered'].includes(shipment.status)} 
                    label="Order" 
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
                    label="Delivery" 
                  />
                </div>
                <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-accent transition-all duration-1000 ease-out"
                    style={{ 
                      width: shipment.status === 'Delivered' ? '100%' : 
                             shipment.status === 'Out for Delivery' ? '75%' :
                             shipment.status === 'Held by Customs' ? '50%' :
                             shipment.status === 'In Transit' ? '25%' : '5%' 
                    }}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">Delivery Timeline</h3>
              <div className="space-y-0">
                {shipment.updates?.map((update, idx) => (
                  <div key={update.id} className="relative pl-10 pb-8 group">
                    {/* Line */}
                    {idx !== shipment.updates!.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-800" />
                    )}
                    
                    {/* Icon */}
                    <div className={cn(
                      "absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center z-10 border-4 border-background-light dark:border-background-dark",
                      idx === 0 ? "bg-accent" : "bg-slate-400 dark:bg-slate-600"
                    )}>
                      {idx === 0 ? (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      ) : (
                        <Clock className="w-3 h-3 text-white" />
                      )}
                    </div>

                    <div className={cn(
                      "rounded-xl p-4 border transition-all",
                      idx === 0 ? "bg-accent/5 border-accent/20" : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                    )}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={cn("font-bold", idx === 0 ? "text-accent" : "text-slate-900 dark:text-slate-100")}>
                          {update.status}
                        </h4>
                        <span className="text-[10px] font-medium text-slate-500">
                          {new Date(update.timestamp).toLocaleDateString()} {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{update.notes}</p>
                      <p className="text-xs mt-2 font-semibold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {update.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
            <Package className="w-16 h-16" />
            <div>
              <p className="text-lg font-bold">No Shipment Tracked</p>
              <p className="text-sm">Enter a tracking number to see the lifecycle.</p>
            </div>
          </div>
        )}

        <section className="pt-4">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-4 items-center">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Headset className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Need help with this delivery?</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Contact our support for any issues.</p>
            </div>
            <button className="text-primary font-bold text-sm hover:underline">Chat Now</button>
          </div>
        </section>
      </main>

      <nav className="sticky bottom-0 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-primary/20 px-4 py-2">
        <div className="max-w-2xl mx-auto flex justify-around">
          <button className="flex flex-col items-center gap-1 p-2 text-accent">
            <span className="material-symbols-outlined fill-1">location_searching</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Track</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-slate-400">
            <span className="material-symbols-outlined">history</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">History</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-slate-400">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function ProgressStep({ active, completed, label }: { active: boolean; completed: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn(
        "w-4 h-4 rounded-full border-2 transition-all",
        completed ? "bg-accent border-accent" : 
        active ? "bg-white dark:bg-slate-900 border-accent" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      )}>
        {completed && <CheckCircle2 className="w-2.5 h-2.5 text-white mx-auto mt-[1px]" />}
      </div>
      <span className={cn(
        "text-[10px] font-bold uppercase tracking-wider transition-colors",
        active ? "text-slate-900 dark:text-slate-100" : "text-slate-400"
      )}>
        {label}
      </span>
    </div>
  );
}
