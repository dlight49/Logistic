import React from 'react';
import { Scale, Truck, AlertTriangle, CreditCard, Gavel, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function TermsOfService() {
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
            <Gavel className="w-3 h-3" /> Service Agreement
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
            Terms of <br /><span className="text-blue-500">Operation</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Version 2.1.0 — Effective March 17, 2026</p>
        </motion.section>

        <div className="grid gap-16 text-slate-300 leading-relaxed font-medium">
          <Section 
            icon={<Truck className="w-5 h-5 text-blue-500" />}
            title="1. Logistics Execution"
            content="Lumin Logistics provides cargo management and digital dispatch services. We act as a freight forwarder and digital intermediary. While we strive for absolute precision in delivery estimates, transit times are subject to carrier availability, weather, and global supply chain conditions."
          />

          <Section 
            icon={<AlertTriangle className="w-5 h-5 text-blue-500" />}
            title="2. Prohibited Cargo"
            content="Users are strictly prohibited from utilizing Lumin Logistics for the transport of illegal substances, hazardous materials not pre-cleared by our compliance team, stolen goods, or currency. Violation of these terms will result in immediate cargo seizure and account termination."
          />

          <Section 
            icon={<Scale className="w-5 h-5 text-blue-500" />}
            title="3. Liability & Insurance"
            content="Standard carriage liability applies. Lumin Logistics' financial responsibility is capped based on current international shipping conventions unless premium 'Level 4' protection is purchased. We recommend all high-value cargo be insured through our platform partners."
          />

          <Section 
            icon={<CreditCard className="w-5 h-5 text-blue-500" />}
            title="4. Financial Terms"
            content="All service fees must be cleared prior to cargo pickup unless an approved commercial credit line is active. Late payments incur a daily compound penalty of 0.5% after the 7-day grace period."
          />
        </div>

        <footer className="pt-24 border-t border-white/5 flex flex-col items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 italic">Global Logistics Intelligence System &copy; 2026</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Privacy Policy</Link>
            <Link to="/commercial" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Corporate Accounts</Link>
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
