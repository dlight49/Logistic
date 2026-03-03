import React, { useState } from "react";
import { ArrowLeft, User, MapPin, Package, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateShipment() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/shipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (res.ok) navigate("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-600 dark:text-slate-400">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Create New Shipment</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 pb-20">
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="text-accent w-5 h-5" />
              <h2 className="text-lg font-semibold">Customer Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Customer Name" placeholder="John Doe" value={formData.receiver_name} onChange={v => setFormData({...formData, receiver_name: v})} />
              <Input label="Phone Number" placeholder="+1 (555) 000-0000" value={formData.receiver_phone} onChange={v => setFormData({...formData, receiver_phone: v})} />
              <div className="md:col-span-2">
                <Input label="Email Address" placeholder="customer@example.com" value={formData.receiver_email} onChange={v => setFormData({...formData, receiver_email: v})} />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="text-accent w-5 h-5" />
              <h2 className="text-lg font-semibold">Logistics Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Origin City" placeholder="Lagos" value={formData.sender_city} onChange={v => setFormData({...formData, sender_city: v})} />
              <Input label="Origin Country" placeholder="Nigeria" value={formData.sender_country} onChange={v => setFormData({...formData, sender_country: v})} />
              <Input label="Destination City" placeholder="New York" value={formData.receiver_city} onChange={v => setFormData({...formData, receiver_city: v})} />
              <Input label="Destination Country" placeholder="USA" value={formData.receiver_country} onChange={v => setFormData({...formData, receiver_country: v})} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Destination Address</label>
              <textarea 
                className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                placeholder="Street Address, City, State, ZIP"
                rows={3}
                value={formData.receiver_address}
                onChange={e => setFormData({...formData, receiver_address: e.target.value})}
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="text-accent w-5 h-5" />
              <h2 className="text-lg font-semibold">Shipment Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Shipment Type</label>
                <select 
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option>Air Freight</option>
                  <option>Sea Freight</option>
                  <option>Road Transport</option>
                </select>
              </div>
              <Input label="Weight (kg)" type="number" placeholder="0.00" value={formData.weight.toString()} onChange={v => setFormData({...formData, weight: parseFloat(v)})} />
              <Input label="Est. Delivery" type="date" value={formData.est_delivery} onChange={v => setFormData({...formData, est_delivery: v})} />
            </div>
          </section>

          <div className="flex flex-col gap-3">
            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/20 flex justify-center items-center gap-2">
              <Truck className="w-5 h-5" /> Confirm and Create Shipment
            </button>
            <button type="button" className="w-full bg-transparent border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              Save as Draft
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input 
        className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
        {...props}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
}
