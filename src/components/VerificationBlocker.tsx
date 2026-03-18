import React, { useState } from 'react';
import { Mail, CheckCircle2, LogOut, RefreshCw, Send } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { motion } from 'framer-motion';

export default function VerificationBlocker() {
  const { user, logout, sendVerification } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setSending(true);
    try {
      await sendVerification();
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (error) {
      console.error("Failed to resend verification", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-display">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-panel p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto text-primary border border-primary/20">
            <Mail className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Verify Your <span className="text-primary">Identity</span></h1>
            <p className="text-slate-400 font-medium leading-relaxed">
              To secure your global logistics operations, we've sent a verification link to <span className="text-white font-bold">{user?.email}</span>. Please verify your email to access your dashboard.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" /> I've Verified
            </button>
            
            <button
              onClick={handleResend}
              disabled={sending || sent}
              className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {sending ? "Transmitting..." : sent ? "Link Transmitted!" : "Resend Verification Link"}
            </button>
          </div>

          <div className="pt-6 border-t border-white/5">
            <button
              onClick={logout}
              className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <LogOut className="w-4 h-4" /> Switch Account / Log Out
            </button>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 italic">Lumin Secure Auth Protocol &copy; 2026</p>
      </div>
    </div>
  );
}
