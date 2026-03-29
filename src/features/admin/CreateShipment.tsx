import React, { useState, InputHTMLAttributes, ReactNode } from "react";
import { AlertTriangle, ArrowLeft, User, MapPin, Package, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
import { motion } from "motion/react";
import { cn } from "../../utils";

export default function CreateShipment(): ReactNode {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
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
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await apiFetch("/api/shipments", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      showToast("Shipment initialized successfully!", "success");
      navigate("/admin");
    } catch (error) {
      console.error("Failed to create shipment:", error);
      const msg = error instanceof Error ? error.message : "Failed to create shipment.";
      setSubmitError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await apiFetch("/api/shipments", {
        method: "POST",
        body: JSON.stringify({ ...formData, status: "Draft" })
      });
      showToast("Draft saved successfully!", "success");
      navigate("/admin");
    } catch (error) {
      console.error("Failed to save draft:", error);
      const msg = error instanceof Error ? error.message : "Failed to save draft.";
      setSubmitError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between px-6 mb-8 max-w-sm mx-auto">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all",
            step === s ? "bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/20" : 
            step > s ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-500 border border-white/10"
          )}>
            {step > s ? "✓" : s}
          </div>
          {s < 4 && <div className={cn("w-6 h-[2px] mx-1", step > s ? "bg-emerald-500" : "bg-white/5")} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-slate-950 font-display text-slate-100 antialiased min-h-screen pb-[calc(8rem+env(safe-area-inset-bottom))] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <header className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 p-4 flex items-center gap-4 rounded-none border-b border-white/10">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white">
            {step === 1 ? "Origin Info" : step === 2 ? "Recipient Info" : step === 3 ? "Package Details" : "Final Review"}
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">Step {step} of 4</p>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-2xl mx-auto relative z-10">
        <StepIndicator />

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> Dispatch Center
              </h2>
              <Input label="Sender Name" placeholder="Warehouse / Contact" value={formData.sender_name} onChange={v => setFormData({ ...formData, sender_name: v })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" placeholder="Lagos" value={formData.sender_city} onChange={v => setFormData({ ...formData, sender_city: v })} required />
                <Input label="Country" placeholder="Nigeria" value={formData.sender_country} onChange={v => setFormData({ ...formData, sender_country: v })} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Detailed Address</label>
                <textarea
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition-all text-white placeholder:text-slate-600"
                  placeholder="Street, Building, Suite..."
                  rows={3}
                  required
                  value={formData.sender_address}
                  onChange={e => setFormData({ ...formData, sender_address: e.target.value })}
                />
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Destination Info
              </h2>
              <Input label="Customer Name" placeholder="Recipient Name" value={formData.receiver_name} onChange={v => setFormData({ ...formData, receiver_name: v })} required />
              <Input label="Phone Number" placeholder="+1..." value={formData.receiver_phone} onChange={v => setFormData({ ...formData, receiver_phone: v })} required />
              <Input label="Email Address" placeholder="customer@email.com" value={formData.receiver_email} onChange={v => setFormData({ ...formData, receiver_email: v })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" placeholder="London" value={formData.receiver_city} onChange={v => setFormData({ ...formData, receiver_city: v })} required />
                <Input label="Country" placeholder="UK" value={formData.receiver_country} onChange={v => setFormData({ ...formData, receiver_country: v })} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Delivery Address</label>
                <textarea
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition-all text-white placeholder:text-slate-600"
                  placeholder="Full Delivery Address"
                  rows={3}
                  required
                  value={formData.receiver_address}
                  onChange={e => setFormData({ ...formData, receiver_address: e.target.value })}
                />
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Shipping Spec
              </h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Logistics Type</label>
                <select
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-white"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option className="bg-slate-900">Air Freight</option>
                  <option className="bg-slate-900">Sea Freight</option>
                  <option className="bg-slate-900">Road Transport</option>
                </select>
              </div>
              <Input label="Total Weight (kg)" type="number" step="0.1" value={formData.weight === 0 ? "" : formData.weight.toString()} onChange={v => setFormData({ ...formData, weight: parseFloat(v) || 0 })} required />
              <Input label="Expected Delivery" type="date" value={formData.est_delivery} onChange={v => setFormData({ ...formData, est_delivery: v })} required />
            </motion.section>
          )}

          {step === 4 && (
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Type</span>
                  <span className="text-sm font-bold text-white">{formData.type}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Weight</span>
                  <span className="text-sm font-bold text-white">{formData.weight} KG</span>
                </div>
                <div className="grid grid-cols-2 gap-8 pt-2">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">From</p>
                    <p className="text-sm font-bold text-white leading-tight">{formData.sender_city}</p>
                    <p className="text-[10px] text-slate-500">{formData.sender_country}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-accent uppercase tracking-widest">To</p>
                    <p className="text-sm font-bold text-white leading-tight">{formData.receiver_city}</p>
                    <p className="text-[10px] text-slate-500">{formData.receiver_country}</p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {submitError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 animate-pulse">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {submitError}
            </div>
          )}

          <div className="flex gap-3">
            {step === 4 && (
              <button 
                type="button" 
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="flex-1 bg-white/5 border border-white/10 text-slate-400 font-bold py-4 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
              >
                Draft
              </button>
            )}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-[3] bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 flex justify-center items-center gap-2 transition-all active:scale-[0.98] border border-white/20"
            >
              {isSubmitting ? "Syncing..." : step === 4 ? "Initialize Shipment" : "Continue"}
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
    <label className="flex flex-col gap-1.5 cursor-pointer group">
      <span className="text-sm font-medium text-slate-300 group-focus-within:text-primary transition-colors">
        {label}
      </span>
      <input
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition-all text-white placeholder:text-slate-700"
        {...props}
        onChange={handleChange}
      />
    </label>
  );
}
