import React from 'react';
import { Shield, Eye, FileText, Lock, Scale, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30">
      <header className="p-6 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-black uppercase italic tracking-tighter hover:opacity-80 transition-opacity">
            Lumin<span className="text-blue-500">Logistics</span>
          </Link>
          <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <ChevronLeft className="w-3 h-3" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 py-12 sm:py-24 space-y-16">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
            <Shield className="w-3 h-3" /> Data Sovereignty
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
            Privacy <br /><span className="text-blue-500">Protocol</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Version 1.0.4 — Effective March 17, 2026</p>
        </motion.section>

        <div className="grid gap-16 text-slate-300 leading-relaxed font-medium">
          <Section 
            icon={<Eye className="w-5 h-5 text-blue-500" />}
            title="1. Information Harvesting"
            content="We collect essential data to facilitate global logistics: Identity details (Name, Email), Telemetry (IP Address, Browser Type), and Operational Data (Shipping addresses, contact numbers). This data is used solely for service execution."
          />

          <Section 
            icon={<FileText className="w-5 h-5 text-blue-500" />}
            title="2. Operational Usage"
            content="Your information powers our AI-driven routing, real-time tracking, and automated customs clearance. We do not engage in data brokerage or third-party marketing integration. Your data serves your logistics needs only."
          />

          <Section 
            icon={<Lock className="w-5 h-5 text-blue-500" />}
            title="3. Cryptographic Shielding"
            content="All sensitive data is encrypted at rest and in transit using industry-standard protocols. We leverage Google Cloud and Supabase for high-availability, secure infrastructure. Access is restricted via multi-factor authentication (MFA)."
          />

          <Section 
            icon={<Scale className="w-5 h-5 text-blue-500" />}
            title="4. User Rights & GDPR"
            content="Users maintain full control over their data. You may request data export, rectification, or total erasure (Right to be Forgotten) at any time through your dashboard settings or by contacting our data protection officer."
          />
        </div>

        <footer className="pt-24 border-t border-white/5 flex flex-col items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 italic">Global Logistics Intelligence System &copy; 2026</p>
          <div className="flex gap-8">
            <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Contact DPO</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Section({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-4">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10">{icon}</div>
        {title}
      </h2>
      <p className="pl-14 text-slate-400 font-medium sm:text-lg">
        {content}
      </p>
    </motion.section>
  );
}
