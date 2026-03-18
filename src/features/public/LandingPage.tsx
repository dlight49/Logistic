import React, { ReactNode } from "react";
import { 
  ArrowRight, Package, Globe, ShieldCheck, Zap, BarChart3, 
  ChevronRight, Truck, Ship, Plane, MapPin, PhoneCall, 
  Clock, CheckCircle2, Search, Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "../../utils";

export default function LandingPage(): ReactNode {
    return (
        <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 relative overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Navigation */}
            <header className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/40">
                            <Package className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase italic">Lumin<span className="text-blue-500">Logistics</span></h1>
                    </motion.div>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/track" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Tracking</Link>
                        <a href="#services" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Services</a>
                        <a href="#about" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">About</a>
                    </nav>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
                        <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white px-4 py-2">Sign In</Link>
                        <Link to="/customer" className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all active:scale-95">
                            Customer Portal
                        </Link>
                    </motion.div>
                </div>
            </header>

            <main className="flex-1 w-full z-10">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-48 pb-24 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-1 text-center lg:text-left space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            Next-Gen Supply Chain Solutions
                        </div>
                        <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
                            Global Flow <br />
                            <span className="text-blue-500">Perfected.</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                            Enterprise-grade logistics for the modern world. We combine proprietary AI tracking with a massive global infrastructure to move your business forward.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                            <Link to="/track" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3">
                                <Search className="w-5 h-5" /> Track Shipment
                            </Link>
                            <Link to="/register" className="w-full sm:w-auto px-10 py-5 border border-white/10 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                                Open Account
                            </Link>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5">
                            <div>
                                <p className="text-2xl font-black text-white">150+</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Countries</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white">2.4M</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Packages / Yr</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white">99.9%</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reliability</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex-1 relative w-full max-w-lg lg:max-w-none">
                        <div className="relative rounded-[2.5rem] bg-slate-900 border border-white/10 p-8 shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-50"></div>
                            <div className="relative z-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">In-Transit Intelligence</p>
                                        <h4 className="text-2xl font-black italic">GS-2026-X8Y2</h4>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                        <Truck className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                        <span className="text-slate-500">Origin: New York</span>
                                        <span className="text-white">Dest: London</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} transition={{ duration: 2, delay: 0.5 }} className="h-full bg-blue-600 rounded-full relative">
                                            <div className="absolute top-0 right-0 w-8 h-full bg-white/20 blur-sm"></div>
                                        </motion.div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Arrival Estimated in 14h 22m</p>
                                </div>
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -top-6 -right-6 bg-blue-600 rounded-3xl p-5 shadow-2xl rotate-6 hover:rotate-0 transition-transform cursor-default">
                            <Globe className="w-8 h-8 text-white" />
                        </div>
                    </motion.div>
                </section>

                {/* Services Grid */}
                <section id="services" className="bg-white/5 py-32 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-20">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-4">Core Capabilities</h3>
                            <h2 className="text-4xl font-black tracking-tight uppercase italic text-white">Full-Spectrum Logistics</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <ServiceCard icon={<Plane />} title="Air Freight" desc="Global express deliveries with priority customs handling." />
                            <ServiceCard icon={<Ship />} title="Ocean Cargo" desc="Full-container and LCL shipping for heavy-duty requirements." />
                            <ServiceCard icon={<Truck />} title="Road Network" desc="Last-mile delivery and continental trucking with live tracking." />
                            <ServiceCard icon={<Building2 />} title="Warehousing" desc="Automated fulfillment centers in key global economic zones." />
                        </div>
                    </div>
                </section>

                {/* Why Lumin Section */}
                <section className="py-32 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-16 items-center">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl font-black uppercase italic">The Lumin <span className="text-blue-500">Advantage</span></h2>
                            <div className="space-y-6">
                                <AdvantageItem icon={<Clock />} title="Time-Critical Reliability" desc="99.9% on-time performance across our global network." />
                                <AdvantageItem icon={<ShieldCheck />} title="Verified Security" desc="End-to-end chain of custody with military-grade encryption." />
                                <AdvantageItem icon={<BarChart3 />} title="AI-Driven Operations" desc="Real-time route optimization to reduce delays and costs." />
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="aspect-square rounded-[2rem] bg-blue-600/20 border border-blue-500/20 p-8 flex flex-col justify-end">
                                <p className="text-4xl font-black text-white italic">24/7</p>
                                <p className="text-xs font-black uppercase tracking-widest text-blue-400">Global Support</p>
                            </div>
                            <div className="aspect-square rounded-[2rem] bg-slate-900 border border-white/10 p-8 flex flex-col justify-end">
                                <p className="text-4xl font-black text-white italic">API</p>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Deep Integration</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-4">
                    <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-r from-blue-600 to-indigo-600 p-12 sm:p-20 text-center space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase italic text-white">Ready to Move?</h2>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto font-bold uppercase tracking-wider">Join thousands of businesses shipping with Lumin.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <Link to="/register" className="px-12 py-5 bg-white text-blue-600 rounded-full font-black uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all">Get Started</Link>
                            <button className="px-12 py-5 border-2 border-white/20 text-white rounded-full font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                <PhoneCall className="w-5 h-5" /> Sales
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/5 bg-[#020617] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Package className="text-blue-600 w-6 h-6" />
                            <span className="font-black tracking-tighter uppercase italic text-xl">Lumin</span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">The global standard for logistics technology and supply chain management.</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6">Solutions</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-500">
                            <li><Link to="/" className="hover:text-blue-500 transition-colors uppercase tracking-tight">Express Freight</Link></li>
                            <li><Link to="/" className="hover:text-blue-500 transition-colors uppercase tracking-tight">Global Logistics</Link></li>
                            <li><Link to="/" className="hover:text-blue-500 transition-colors uppercase tracking-tight">Supply Chain</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6">Support</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-500">
                            <li><Link to="/track" className="hover:text-blue-500 transition-colors uppercase tracking-tight">Tracking Center</Link></li>
                            <li><Link to="/customer/tickets" className="hover:text-blue-500 transition-colors uppercase tracking-tight">Open a Ticket</Link></li>
                            <li><Link to="/" className="hover:text-blue-500 transition-colors uppercase tracking-tight">Developer API</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6">Connect</h4>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"><Globe className="w-5 h-5 text-white" /></div>
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"><Zap className="w-5 h-5 text-white" /></div>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    <p>&copy; {new Date().getFullYear()} Lumin Logistics International.</p>
                    <div className="flex gap-8">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/" className="hover:text-white transition-colors">Security</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function ServiceCard({ icon, title, desc }: { icon: ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] hover:border-blue-500/30 hover:bg-slate-800 transition-all group shadow-xl">
            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h4 className="text-xl font-black italic text-white mb-3 uppercase">{title}</h4>
            <p className="text-slate-500 text-sm font-bold leading-relaxed tracking-tight">{desc}</p>
        </div>
    );
}

function AdvantageItem({ icon, title, desc }: { icon: ReactNode, title: string, desc: string }) {
    return (
        <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shrink-0">
                {icon}
            </div>
            <div>
                <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-1">{title}</h4>
                <p className="text-slate-500 text-sm font-bold leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}


function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-panel p-8 rounded-3xl border border-transparent hover:border-primary/20 transition-all duration-300 group shadow-lg shadow-slate-200/50 dark:shadow-none"
        >
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                {icon}
            </div>
            <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{title}</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                {description}
            </p>
        </motion.div>
    );
}

// Small helper since we used it inline above
function SearchIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    );
}
