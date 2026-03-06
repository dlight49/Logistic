import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Filter, CheckCircle2, XCircle, Clock, 
  MapPin, Package, Shield, ArrowRight, Layers, MoreVertical
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

interface Quote {
  id: string;
  origin: string;
  destination: string;
  weight: number;
  dimensions: string;
  packageType: string;
  serviceType: string;
  insurance: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  customerName?: string;
}

export const QuoteManagement: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Quote[]>('/api/quotes');
      setQuotes(data);
    } catch (error) {
      console.error("Failed to fetch quotes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await apiFetch(`/api/quotes/${id}/${action === 'APPROVE' ? 'approve' : 'reject'}`, {
        method: 'POST'
      });
      fetchQuotes();
    } catch (error) {
      console.error(`Failed to ${action} quote`, error);
    }
  };

  const filteredQuotes = quotes.filter(q => {
    const matchesFilter = filter === 'ALL' || q.status === filter;
    const matchesSearch = q.origin.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         q.destination.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tight">QUOTE MANAGEMENT</h1>
          <p className="text-slate-400 mt-1">Review and process customer freight estimations</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search origin/destination..."
              className="bg-slate-900 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-slate-900 border border-white/10 rounded-xl hover:bg-slate-800">
            <Filter className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Quotes', val: quotes.length, color: 'blue' },
          { label: 'Pending Approval', val: quotes.filter(q => q.status === 'PENDING').length, color: 'amber' },
          { label: 'Approved', val: quotes.filter(q => q.status === 'APPROVED').length, color: 'emerald' },
          { label: 'Conversion Rate', val: '42%', color: 'indigo' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{stat.label}</p>
            <p className="text-2xl font-black text-white mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 p-1 bg-slate-900/50 border border-white/5 rounded-2xl w-fit">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-black transition-all",
              filter === f ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-slate-300"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredQuotes.map((quote) => (
            <motion.div
              layout
              key={quote.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-slate-900/40 hover:bg-slate-900 border border-white/5 hover:border-white/20 p-6 rounded-3xl transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-500 hover:text-white">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="flex items-center gap-4 lg:w-1/4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border",
                    quote.status === 'PENDING' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                    quote.status === 'APPROVED' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                    "bg-rose-500/10 border-rose-500/20 text-rose-500"
                  )}>
                    {quote.status === 'PENDING' ? <Clock className="w-6 h-6" /> :
                     quote.status === 'APPROVED' ? <CheckCircle2 className="w-6 h-6" /> : 
                     <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs tracking-widest">{quote.id.slice(0, 8)}</h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">
                      {format(new Date(quote.createdAt), 'MMM dd, yyyy · HH:mm')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 items-center gap-6">
                  <div className="flex flex-col gap-1 min-w-[120px]">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Origin</span>
                    <span className="text-white font-bold flex items-center gap-2"><MapPin className="w-3 h-3" /> {quote.origin}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-700" />
                  <div className="flex flex-col gap-1 min-w-[120px]">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Destination</span>
                    <span className="text-white font-bold flex items-center gap-2"><MapPin className="w-3 h-3" /> {quote.destination}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:w-1/3 border-l border-white/5 pl-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Details</span>
                    <span className="text-slate-300 text-xs font-bold">{quote.packageType} · {quote.weight}KG</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Service</span>
                    <span className="text-slate-300 text-xs font-bold">{quote.serviceType}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Insurance</span>
                    <span className={cn("text-xs font-bold", quote.insurance ? "text-emerald-400" : "text-slate-600")}>
                      {quote.insurance ? <Shield className="w-3 h-3 inline mr-1" /> : ""}
                      {quote.insurance ? "INCLUDED" : "NONE"}
                    </span>
                  </div>
                </div>

                <div className="lg:w-1/6 flex justify-end gap-3">
                  {quote.status === 'PENDING' ? (
                    <>
                      <button 
                        onClick={() => handleAction(quote.id, 'REJECT')}
                        className="p-3 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-all border border-white/5"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleAction(quote.id, 'APPROVE')}
                        className="px-6 py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
                      >
                        APPROVE
                      </button>
                    </>
                  ) : (
                    <span className={cn(
                      "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border",
                      quote.status === 'APPROVED' ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5" : "border-rose-500/20 text-rose-500 bg-rose-500/5"
                    )}>
                      {quote.status}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {!loading && filteredQuotes.length === 0 && (
          <div className="py-20 text-center bg-slate-900/20 border border-white/5 rounded-3xl border-dashed">
            <Layers className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-slate-400 font-bold uppercase tracking-widest">No quotes matches criteria</h3>
          </div>
        )}
      </div>
    </div>
  );
};
