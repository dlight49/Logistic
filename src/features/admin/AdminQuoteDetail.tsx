import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, ArrowLeft, MapPin, Package, Clock, Shield,
  CheckCircle2, XCircle, AlertCircle, Edit3, Save, Trash2,
  DollarSign, Truck, Calendar, Info, Layers, ChevronRight
} from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { cn } from '../../utils';
import { format } from 'date-fns';
import AdminNav from "../../components/AdminNav";

export default function AdminQuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Edit States
  const [editPrice, setEditPrice] = useState(0);
  const [editType, setEditType] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/shipments/${id}`);
      if (!res.ok) throw new Error("Failed to fetch quote");
      const data = await res.json();
      setQuote(data);
      setEditPrice(data.estimated_cost || 0);
      setEditType(data.type || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, [id]);

  const handleSaveEdits = async () => {
    setSaving(true);
    try {
      const res = await apiFetch(`/api/shipments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          estimated_cost: Number(editPrice),
          type: editType
        })
      });
      if (!res.ok) throw new Error("Failed to save updates");
      await fetchQuote();
      setEditing(false);
    } catch (err) {
      alert("Error saving updates");
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!window.confirm(`Are you sure you want to ${action} this quote?`)) return;
    setSaving(true);
    try {
      const res = await apiFetch(`/api/shipments/admin/quotes/${id}/${action}`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error(`Failed to ${action} quote`);
      
      if (action === 'approve') {
        const data = await res.json();
        navigate(`/admin/shipment/${data.shipment_id}`);
      } else {
        navigate('/admin/quotes');
      }
    } catch (err) {
      alert(`Error during ${action}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quote) return null;

  const isPending = quote.status === 'Quote Pending';

  return (
    <div className="bg-slate-950 text-white min-h-screen font-display relative pb-32">
      {/* Dynamic Backgrounds */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-2xl border-b border-white/5 py-6 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/admin/quotes')}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black italic tracking-tighter uppercase">{quote.id}</h1>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                isPending ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
              )}>
                {quote.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold mt-1">Request received {format(new Date(quote.created_at), 'MMMM do, yyyy')}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          {isPending && (
            <>
              <button 
                onClick={() => handleAction('reject')}
                className="px-6 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
              >
                Reject Order
              </button>
              <button 
                onClick={() => handleAction('approve')}
                className="px-8 py-3 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-white/5 transition-all"
              >
                Approve & Convert
              </button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Left Column: Core Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Specs Card */}
          <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Package className="w-32 h-32" />
            </div>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight italic">Shipment Specifications</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <SpecItem icon={<MapPin className="text-blue-500" />} label="Origin" value={quote.sender_city} sub={quote.sender_country} />
                <SpecItem icon={<MapPin className="text-indigo-500" />} label="Destination" value={quote.receiver_city} sub={quote.receiver_country} />
              </div>
              <div className="space-y-8">
                <SpecItem icon={<Package className="text-amber-500" />} label="Package" value={quote.package_details || "Standard Cargo"} sub={`${quote.weight} KG Total Weight`} />
                <SpecItem icon={<Truck className="text-emerald-500" />} label="Service" value={quote.type} sub="Door-to-Door Delivery" />
              </div>
            </div>
          </section>

          {/* Pricing & Terms */}
          <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 sm:p-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight italic">Commercial Quote</h2>
              </div>
              {isPending && !editing && (
                <button 
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
                >
                  <Edit3 className="w-4 h-4" /> Edit Terms
                </button>
              )}
            </div>

            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between bg-white/5 border border-white/5 p-8 rounded-3xl">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Total Estimated Cost</p>
                  {editing ? (
                    <div className="relative mt-2">
                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
                       <input 
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="bg-slate-950 border-2 border-primary/30 rounded-2xl py-5 pl-14 pr-6 text-3xl font-black text-white outline-none focus:border-primary transition-all w-full max-w-[250px]"
                       />
                    </div>
                  ) : (
                    <h3 className="text-5xl font-black text-white italic tracking-tighter">${quote.estimated_cost?.toLocaleString()}</h3>
                  )}
                </div>
                
                <div className="text-right flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                     <Shield className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Insurance Included</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Calculated by Dispatch Engine v4</p>
                </div>
              </div>

              {editing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/5 border border-primary/20 p-8 rounded-3xl space-y-6"
                >
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service Speed</label>
                      <div className="flex flex-wrap gap-3">
                         {['Standard', 'Express', 'Priority'].map(s => (
                           <button 
                            key={s}
                            onClick={() => setEditType(s)}
                            className={cn(
                              "px-6 py-3 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all",
                              editType === s ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                            )}
                           >
                             {s}
                           </button>
                         ))}
                      </div>
                   </div>
                   <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                      <button onClick={() => setEditing(false)} className="px-6 py-3 text-slate-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors">Cancel</button>
                      <button 
                        onClick={handleSaveEdits}
                        disabled={saving}
                        className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50"
                      >
                        {saving ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Protocol Changes
                      </button>
                   </div>
                </motion.div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Actions & Log */}
        <div className="space-y-8">
           <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 overflow-hidden">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8 px-2">Client Identity</h3>
               <div className="flex items-center gap-4 mb-8 bg-white/5 p-6 rounded-3xl border border-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-black text-xl shadow-xl">
                    {quote.receiver_name[0]}
                  </div>
                  <div>
                    <h4 className="font-black italic uppercase tracking-tight text-white">{quote.receiver_name}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{quote.receiver_email}</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <ContactItem icon={<Shield />} label="Verification" value="KYC VERIFIED" color="text-emerald-500" />
                  <ContactItem icon={<Clock />} label="Member Since" value="OCT 2023" color="text-slate-400" />
               </div>
           </section>

           <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8 px-2">Activity Protocol</h3>
              <div className="space-y-6">
                {(quote.tracking_updates || []).map((update: any, i: number) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 ring-4 ring-primary/20" />
                      {i < quote.tracking_updates.length - 1 && <div className="w-px h-full bg-white/5 mt-2" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{update.status}</p>
                      <p className="text-[9px] font-bold text-slate-500 mb-2 uppercase">{format(new Date(update.timestamp), 'MMM dd, HH:mm')}</p>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">{update.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
           </section>
        </div>
      </main>

      {/* Mobile Footer Actions */}
      <div className="fixed sm:hidden bottom-24 left-0 w-full px-6 z-40">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] flex items-center gap-4 shadow-2xl">
           <button 
             onClick={() => handleAction('reject')}
             className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/20 active:scale-95 transition-all"
           >
             <XCircle className="w-8 h-8" />
           </button>
           <button 
             onClick={() => handleAction('approve')}
             className="flex-1 h-16 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest italic shadow-xl shadow-white/5 active:scale-95 transition-all flex items-center justify-center gap-3"
           >
             Convert Order <ChevronRight className="w-6 h-6" />
           </button>
        </div>
      </div>

      <AdminNav />
    </div>
  );
}

function SpecItem({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) {
  return (
    <div className="flex gap-5">
      <div className="w-14 h-14 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center shadow-inner group-hover:border-white/10 transition-colors shrink-0">
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
        <h4 className="text-lg font-black italic uppercase tracking-tighter text-white truncate">{value}</h4>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{sub}</p>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        <div className="text-slate-600">
           {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4' })}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      </div>
      <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", color)}>{value}</p>
    </div>
  );
}
