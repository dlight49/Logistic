import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('lumin_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('lumin_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('lumin_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-[9999]"
        >
          <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-2xl shadow-black/50 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/20 transition-all duration-700"></div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/40">
                    <Cookie className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black uppercase italic tracking-tight">Compliance <span className="text-blue-500">Node</span></h4>
                </div>
                <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm font-medium text-slate-400 leading-relaxed">
                We use cookies to enhance your logistics experience, analyze site traffic, and optimize our global routing algorithms. By continuing, you agree to our data protocol.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                >
                  Accept All
                </button>
                <button
                  onClick={handleDecline}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                >
                  Reject
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <ShieldCheck className="w-3 h-3 text-blue-500" />
                <a href="/privacy" className="text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-500 transition-colors">Privacy Transparency Dashboard</a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
