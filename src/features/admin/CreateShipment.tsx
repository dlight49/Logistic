import React, { useState, InputHTMLAttributes, ReactNode } from "react";
import { AlertTriangle, ArrowLeft, User, MapPin, Package, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";

export default function CreateShipment(): ReactNode {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sender_name: "",
    sender_city: "",
    sender_country: "",
    sender_address: "",
    receiver_name: "",
    receiver_city: "",
    receiver_country: "",
    receiver_address: "",
    receiver_phone: "",
    receiver_email: "",
    weight: 0,
    type: "Air Freight",
    est_delivery: ""
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await apiFetch("/api/shipments", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      navigate("/admin");
    } catch (error) {
      console.error("Failed to create shipment:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to create shipment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    // For drafts, we might want less strict validation in the future,
    // but for now let's just use the same endpoint with a status flag
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await apiFetch("/api/shipments", {
        method: "POST",
        body: JSON.stringify({ ...formData, status: "Draft" })
      });
      alert("Draft saved successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Failed to save draft:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to save draft. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 font-display text-slate-100 antialiased min-h-screen pb-[calc(8rem+env(safe-area-inset-bottom))] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <header className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 p-4 flex items-center gap-4 rounded-none border-b border-white/10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white">Create Shipment</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">Global Logistics Network</p>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-2xl mx-auto relative z-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 pb-20">
          <section className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Truck className="w-24 h-24" />
            </div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
              Origin Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <Input label="Sender Name" placeholder="Origin contact / warehouse" value={formData.sender_name} onChange={v => setFormData({ ...formData, sender_name: v })} required />
              <div className="sm:col-span-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Origin Address</label>
                  <textarea
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Street Address, City, State, ZIP"
                    rows={2}
                    required
                    value={formData.sender_address}
                    onChange={e => setFormData({ ...formData, sender_address: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Truck className="w-24 h-24" />
            </div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
              Recipient Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <Input label="Customer Name" placeholder="John Doe" value={formData.receiver_name} onChange={v => setFormData({ ...formData, receiver_name: v })} required />
              <Input label="Phone Number" placeholder="+1 (555) 000-0000" value={formData.receiver_phone} onChange={v => setFormData({ ...formData, receiver_phone: v })} required />
              <div className="sm:col-span-2">
                <Input label="Email Address" placeholder="customer@example.com" value={formData.receiver_email} onChange={v => setFormData({ ...formData, receiver_email: v })} required />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="text-accent w-5 h-5" />
              <h2 className="text-lg font-semibold">Logistics Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Origin City" placeholder="Lagos" value={formData.sender_city} onChange={v => setFormData({ ...formData, sender_city: v })} required />
              <Input label="Origin Country" placeholder="Nigeria" value={formData.sender_country} onChange={v => setFormData({ ...formData, sender_country: v })} required />
              <Input label="Destination City" placeholder="New York" value={formData.receiver_city} onChange={v => setFormData({ ...formData, receiver_city: v })} required />
              <Input label="Destination Country" placeholder="USA" value={formData.receiver_country} onChange={v => setFormData({ ...formData, receiver_country: v })} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Destination Address</label>
              <textarea
                className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                placeholder="Street Address, City, State, ZIP"
                rows={3}
                required
                value={formData.receiver_address}
                onChange={e => setFormData({ ...formData, receiver_address: e.target.value })}
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="text-accent w-5 h-5" />
              <h2 className="text-lg font-semibold">Shipment Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Shipment Type</label>
                <select
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option>Air Freight</option>
                  <option>Sea Freight</option>
                  <option>Road Transport</option>
                </select>
              </div>
              <Input label="Weight (kg)" type="number" placeholder="0.00" step="0.01" min="0.01" value={formData.weight === 0 ? "" : formData.weight.toString()} onChange={v => setFormData({ ...formData, weight: parseFloat(v) || 0 })} required />
              <Input label="Est. Delivery" type="date" value={formData.est_delivery} onChange={v => setFormData({ ...formData, est_delivery: v })} required />
            </div>
          </section>

          {submitError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {submitError}
            </div>
          )}
          <div className="flex flex-col gap-3">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/20 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Truck className="w-5 h-5" /> {isSubmitting ? "Processing..." : "Confirm and Create Shipment"}
            </button>
            <button 
              type="button" 
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="w-full bg-transparent border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  onChange?: (value: string) => void;
}

function Input({ label, onChange, ...props }: InputProps): ReactNode {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input
        className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
        {...props}
        onChange={handleChange}
      />
    </div>
  );
}
