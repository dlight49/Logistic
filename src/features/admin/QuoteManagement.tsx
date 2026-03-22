import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Search, Filter, CheckCircle2, XCircle, Clock,
  MapPin, Package, Shield, ArrowRight, Layers, MoreVertical
} from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { cn } from '../../utils';
import { format } from 'date-fns';
import AdminNav from "../../components/AdminNav";

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
      const res = await apiFetch('/api/shipments/admin/quotes');
      const rawData: any[] = await res.json();

      // Map Prisma shipment model to Quote interface
      const data: Quote[] = rawData.map(item => ({
        id: item.id,
        origin: item.sender_city,
        destination: item.receiver_city,
        weight: item.weight,
        dimensions: "", // Not available in Prisma shipment model currently
        packageType: item.package_details || "Package",
        serviceType: item.type,
        insurance: item.insurance_selected || false,
        status: item.status === 'Quote Pending' ? 'PENDING' :
          item.status === 'Order Created' || item.id.startsWith('GS-') ? 'APPROVED' : 'REJECTED',
        createdAt: item.created_at,
      }));

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
      await apiFetch(`/api/shipments/admin/quotes/${id}/${action === 'APPROVE' ? 'approve' : 'reject'}`, {
        method: 'POST'
      });
      void fetchQuotes();
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
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-32 pt-4 sm:pt-6 relative overflow-hidden font-display">
      {/* Background aesthetics */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto relative z-10 pb-40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white italic tracking-tight uppercase">Quote Management</h1>
            <p className="text-sm text-slate-400 mt-1">Review and process freight estimations</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search quotes..."
                className="w-full sm:w-56 bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2.5 bg-slate-900/50 border border-white/10 rounded-xl hover:bg-slate-800 self-end sm:self-auto transition-colors">
              <Filter className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            { label: 'Total Quotes', val: quotes.length, color: 'blue' },
            { label: 'Pending', val: quotes.filter(q => q.status === 'PENDING').length, color: 'amber' },
            { label: 'Approved', val: quotes.filter(q => q.status === 'APPROVED').length, color: 'emerald' },
            { label: 'Conversion', val: '42%', color: 'indigo' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 border border-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl hover:border-white/10 transition-colors">
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{stat.label}</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 p-1 bg-slate-900/40 border border-white/5 rounded-xl sm:rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all whitespace-nowrap uppercase tracking-widest",
                filter === f ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredQuotes.map((quote) => (
              <motion.div
                layout
                key={quote.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="group bg-slate-900/30 hover:bg-slate-900/50 border border-white/5 hover:border-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl transition-all relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 sm:gap-8">
                  <div className="flex items-center gap-4 lg:w-1/4">
                    <div className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border shrink-0",
                      quote.status === 'PENDING' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                        quote.status === 'APPROVED' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                          "bg-rose-500/10 border-rose-500/20 text-rose-500"
                    )}>
                      {quote.status === 'PENDING' ? <Clock className="w-5 h-5 sm:w-6 sm:h-6" /> :
                        quote.status === 'APPROVED' ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> :
                          <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white uppercase text-[10px] sm:text-xs tracking-widest truncate">{quote.id}</h4>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold mt-1">
                        {format(new Date(quote.createdAt), 'MMM dd, yyyy · HH:mm')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col xs:flex-row flex-1 items-start xs:items-center gap-3 sm:gap-6">
                    <div className="flex flex-col gap-1 min-w-[100px] sm:min-w-[120px]">
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Origin</span>
                      <span className="text-white font-bold text-xs sm:text-sm flex items-center gap-2 truncate"><MapPin className="w-3 h-3 text-slate-500" /> {quote.origin}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-700 hidden xs:block shrink-0" />
                    <div className="flex flex-col gap-1 min-w-[100px] sm:min-w-[120px]">
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Destination</span>
                      <span className="text-white font-bold text-xs sm:text-sm flex items-center gap-2 truncate"><MapPin className="w-3 h-3 text-slate-500" /> {quote.destination}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:w-1/3 border-t lg:border-t-0 lg:border-l border-white/5 pt-5 lg:pt-0 lg:pl-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Details</span>
                      <span className="text-slate-300 text-xs font-bold truncate">{quote.packageType} · {quote.weight}KG</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Service</span>
                      <span className="text-slate-300 text-xs font-bold">{quote.serviceType}</span>
                    </div>
                    <div className="flex flex-col gap-1 hidden md:flex">
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Insurance</span>
                      <span className={cn("text-xs font-bold", quote.insurance ? "text-emerald-400" : "text-slate-600")}>
                        {quote.insurance ? "INCLUDED" : "NONE"}
                      </span>
                    </div>
                  </div>

                  <div className="lg:w-1/6 flex justify-end items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                    {quote.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleAction(quote.id, 'REJECT')}
                          className="p-2.5 sm:p-3 bg-white/5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-xl transition-all border border-white/5"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleAction(quote.id, 'APPROVE')}
                          className="flex-1 lg:flex-none px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-200 transition-all text-[10px] sm:text-xs uppercase tracking-widest"
                        >
                          APPROVE
                        </button>
                      </>
                    ) : (
                      <span className={cn(
                        "px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] border w-full lg:w-auto text-center",
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

      <AdminNav />
    </div>
  );
};

export default QuoteManagement;
