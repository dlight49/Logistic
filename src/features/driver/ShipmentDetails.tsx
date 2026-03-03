import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Share2, MoreVertical, Truck, MapPin, Weight, Clock, Phone, Mail, Navigation, Headset, Edit3 } from "lucide-react";
import { Shipment } from "@/src/types";
import { cn } from "@/src/utils";

export default function ShipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch(`/api/shipments/${id}`).then(res => res.json()).then(setShipment);
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`/api/shipments/${id}/updates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        location: shipment?.receiver_city,
        notes: notes
      })
    });
    setShowUpdateModal(false);
    // Refresh
    fetch(`/api/shipments/${id}`).then(res => res.json()).then(setShipment);
  };

  if (!shipment) return null;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-slate-900 dark:text-slate-100 hover:bg-primary/10 p-2 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold leading-tight">Shipment Details</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-slate-900 dark:text-slate-100 hover:bg-primary/10 p-2 rounded-full"><Share2 className="w-5 h-5" /></button>
            <button className="text-slate-900 dark:text-slate-100 hover:bg-primary/10 p-2 rounded-full"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto pb-32">
        <div className="p-4">
          <div className="flex items-start justify-between bg-primary/5 dark:bg-primary/20 p-6 rounded-xl border border-primary/10">
            <div className="flex flex-col gap-1">
              <p className="text-accent text-sm font-bold uppercase tracking-wider">{shipment.status}</p>
              <h1 className="text-2xl font-bold tracking-tight">{shipment.id}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{shipment.type} • Est. Delivery {shipment.est_delivery}</p>
            </div>
            <div className="bg-primary text-white p-3 rounded-lg shadow-lg shadow-primary/20">
              <Truck className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="relative group">
            <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border border-primary/10 bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/${shipment.id}/600/300)` }}>
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button className="bg-primary text-white p-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-bold transition-transform active:scale-95">
                <Navigation className="w-4 h-4" /> Navigate
              </button>
            </div>
          </div>
        </div>

        <section className="mt-6">
          <h3 className="px-4 text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Customer Information</h3>
          <div className="bg-white dark:bg-slate-900/50 mx-4 rounded-xl border border-primary/5 divide-y divide-primary/5">
            <div className="flex items-center gap-4 p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                <img className="h-full w-full object-cover" src={`https://picsum.photos/seed/${shipment.receiver_name}/100/100`} referrerPolicy="no-referrer" alt="Recipient" />
              </div>
              <div className="flex-1">
                <p className="font-bold">{shipment.receiver_name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Recipient</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-primary/10 text-primary rounded-full"><Phone className="w-4 h-4" /></button>
                <button className="p-2 bg-primary/10 text-primary rounded-full"><Mail className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="px-4 text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Delivery Details</h3>
          <div className="grid grid-cols-1 gap-3 px-4">
            <div className="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-primary/5 flex gap-4">
              <MapPin className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Address</p>
                <p className="font-medium">{shipment.receiver_address}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-primary/5 flex gap-4">
                <Weight className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Weight</p>
                  <p className="font-medium">{shipment.weight} kg</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-primary/5 flex gap-4">
                <Clock className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Window</p>
                  <p className="font-medium">2PM - 4PM</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="px-4 flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Shipping History</h3>
            <Link to={`/driver/customs/${shipment.id}`} className="text-xs font-bold text-primary dark:text-accent underline">Customs Docs</Link>
          </div>
          <div className="px-6 space-y-6 relative before:content-[''] before:absolute before:left-[35px] before:top-2 before:bottom-2 before:w-[2px] before:bg-primary/10">
            {shipment.updates?.map((update, idx) => (
              <div key={update.id} className="relative flex gap-6">
                <div className={cn(
                  "z-10 h-5 w-5 rounded-full border-4 border-background-light dark:border-background-dark",
                  idx === 0 ? "bg-accent shadow-[0_0_0_2px_rgba(249,115,22,0.2)]" : "bg-primary/40"
                )}></div>
                <div className="flex-1 pb-2">
                  <div className="flex justify-between items-start">
                    <p className={cn("font-bold", idx === 0 ? "text-accent" : "text-slate-700 dark:text-slate-300")}>{update.status}</p>
                    <p className="text-xs text-slate-500 font-medium">
                      {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{update.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button 
            onClick={() => setShowUpdateModal(true)}
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all active:scale-[0.98]"
          >
            <Edit3 className="w-5 h-5" /> Update Status
          </button>
          <button className="w-16 bg-white dark:bg-slate-900 border border-primary/10 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 py-4 rounded-xl flex items-center justify-center shadow-sm">
            <Headset className="w-6 h-6" />
          </button>
        </div>
      </div>

      {showUpdateModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 space-y-6 animate-in slide-in-from-bottom duration-300">
            <h3 className="text-xl font-bold">Update Shipment Status</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">New Status</label>
                <select 
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl h-12 px-4"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Held by Customs">Held by Customs</option>
                  <option value="Cleared by Customs">Cleared by Customs</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea 
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4"
                  placeholder="Add details..."
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowUpdateModal(false)} className="flex-1 py-3 font-bold text-slate-500">Cancel</button>
              <button onClick={handleUpdate} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
