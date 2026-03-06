import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ChevronRight,
  ArrowRight,
  Package,
  MapPin,
  Calendar
} from "lucide-react";
import { quoteService, QuoteRequest } from "../../services/quoteService";

const AdminQuoteRequest: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const data = await quoteService.getQuotes();
      setQuotes(data);
    } catch (error) {
      console.error("Failed to load quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await quoteService.updateQuoteStatus(id, status);
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
      if (selectedQuote?.id === id) {
        setSelectedQuote(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredQuotes = quotes.filter(q => {
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = q.pickupCity.toLowerCase().includes(searchLow) || 
                         q.deliveryCity.toLowerCase().includes(searchLow) ||
                         q.id.toLowerCase().includes(searchLow);
    const matchesFilter = filter === 'all' || q.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'rejected': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Quote Requests</h1>
          <p className="text-slate-400">Review and manage customer shipping quotes</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-64 backdrop-blur-sm"
            />
          </div>
          
          <div className="flex bg-slate-900/50 border border-slate-800 rounded-xl p-1 backdrop-blur-sm">
            {(['all', 'pending', 'approved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === f 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-slate-800/50 rounded-3xl animate-pulse">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading requests...</p>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-slate-800/50 rounded-3xl text-center border-t-slate-800/30">
              <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No quotes found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredQuotes.map((quote) => (
              <motion.div
                key={quote.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedQuote(quote)}
                className={`group relative overflow-hidden bg-slate-900/40 border transition-all cursor-pointer rounded-2xl p-5 ${
                  selectedQuote?.id === quote.id 
                    ? 'border-blue-500/50 bg-slate-800/40 ring-2 ring-blue-500/10 backdrop-blur-md' 
                    : 'border-slate-800/50 hover:border-slate-700 hover:bg-slate-800/20'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    selectedQuote?.id === quote.id ? 'bg-blue-500 text-white' : 'bg-slate-800/50 group-hover:bg-blue-500/10 text-slate-400 group-hover:text-blue-400'
                  }`}>
                    <Package className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">#{quote.id.slice(0, 8)}</span>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(quote.status)}`}>
                        {getStatusIcon(quote.status)}
                        {quote.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-white font-medium mb-1 capitalize">
                      {quote.pickupCity}
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                      {quote.deliveryCity}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                      <div className="w-1 h-1 bg-slate-700 rounded-full" />
                      <div>{quote.weight}kg • {quote.type}</div>
                    </div>
                  </div>
                  
                  <ChevronRight className={`w-5 h-5 text-slate-600 transition-transform ${selectedQuote?.id === quote.id ? 'rotate-90 text-blue-400' : 'group-hover:translate-x-1'}`} />
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedQuote ? (
              <motion.div
                key={selectedQuote.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="sticky top-6 bg-slate-900/60 border border-slate-800/50 rounded-3xl overflow-hidden backdrop-blur-xl"
              >
                <div className="p-6 border-b border-slate-800/50 bg-gradient-to-br from-blue-500/10 to-transparent">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <button onClick={() => setSelectedQuote(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Quote Details</h2>
                  <p className="text-sm text-slate-400 font-mono uppercase tracking-tighter">ID: {selectedQuote.id}</p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                      <div className="mt-1 w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Origin</p>
                        <p className="text-white font-medium capitalize">{selectedQuote.pickupCity}, {selectedQuote.pickupCountry}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                      <div className="mt-1 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Destination</p>
                        <p className="text-white font-medium capitalize">{selectedQuote.deliveryCity}, {selectedQuote.deliveryCountry}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Weight</p>
                        <p className="text-xl font-bold text-white tracking-tight">{selectedQuote.weight} <span className="text-sm font-normal text-slate-500">kg</span></p>
                      </div>
                      <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Dimensions</p>
                        <p className="text-white font-bold tracking-tight">{selectedQuote.dimensions}</p>
                      </div>
                    </div>
                  </div>

                  {selectedQuote.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-slate-800/50">
                      <button
                        onClick={() => handleStatusUpdate(selectedQuote.id, 'rejected')}
                        className="flex-1 px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold rounded-2xl transition-all"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedQuote.id, 'approved')}
                        className="flex-[2] px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Approve
                      </button>
                    </div>
                  )}

                  {selectedQuote.status !== 'pending' && (
                    <div className={`p-4 rounded-2xl border flex items-center justify-center gap-3 text-sm font-bold capitalize shadow-sm ${getStatusColor(selectedQuote.status)}`}>
                      {getStatusIcon(selectedQuote.status)}
                      Already {selectedQuote.status}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-slate-800 rounded-3xl p-8 text-center bg-slate-900/10">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                  <ArrowRight className="w-8 h-8 text-slate-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-500 mb-2">No Request Selected</h3>
                <p className="text-slate-600 text-sm">Select a quote from the list to view its details and take action.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminQuoteRequest;
