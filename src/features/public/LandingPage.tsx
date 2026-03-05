import React, { ReactNode } from "react";
import { ArrowRight, Package, Globe, ShieldCheck, Zap, BarChart3, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "../../utils"; // or from "@/src/utils"

export default function LandingPage(): ReactNode {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 relative overflow-hidden font-sans">
            {/* Background Decorators */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Navigation */}
            <header className="fixed top-0 w-full z-50 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-xl border-b border-white/10 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="bg-gradient-to-tr from-primary to-primary-light p-2 rounded-xl shadow-lg shadow-primary/20">
                            <Package className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gradient">Lumin Logistics</h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 sm:gap-6"
                    >
                        <Link to="/track" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                            Track Package
                        </Link>
                        <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                            Sign In
                        </Link>
                        <Link to="/customer" className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-5 py-2 rounded-xl font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            Shipment Portal <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 w-full flex flex-col pt-24 sm:pt-32 pb-16 z-10">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex-1 text-center lg:text-left space-y-8"
                    >
                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                            Premium Delivery <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-accent">
                                Without Limits
                            </span>
                        </h2>
                        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                            Global reach with personalized care. Lumin Logistics provides state-of-the-art tracking, dedicated customer portals, and unmatched reliability.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link to="/track" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:scale-105 transition-all flex items-center justify-center gap-2">
                                Track a Shipment <SearchIcon />
                            </Link>
                            <Link to="/customer/quote" className="w-full sm:w-auto px-8 py-4 glass-panel border border-primary/20 hover:border-primary/50 text-slate-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                Get a Quote <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex-1 relative w-full max-w-lg lg:max-w-none"
                    >
                        <div className="relative glass-panel p-6 rounded-3xl border border-white/20 dark:border-slate-700 shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-primary/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 flex flex-col gap-6">
                                {/* Mock UI snippet representing what the user will see */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Active Shipment</p>
                                        <p className="text-2xl font-extrabold flex items-center gap-2">GS-2026-X8Y2</p>
                                    </div>
                                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                                        <Package className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">In Transit</p>
                                            <p className="text-xs text-slate-500">Arriving in 2 days</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary to-accent w-2/3 rounded-full relative">
                                            <div className="absolute top-0 right-0 w-4 h-full bg-white/50 blur-[2px] animate-[pulse-slow_2s_infinite]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating badges */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 glass-panel p-4 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md"
                        >
                            <div className="bg-green-500/20 text-green-500 p-2 rounded-lg">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                                <p className="text-sm font-extrabold text-slate-900 dark:text-white">Fully Secured</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-8 -left-8 glass-panel p-4 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md"
                        >
                            <div className="bg-accent/20 text-accent p-2 rounded-lg">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Coverage</p>
                                <p className="text-sm font-extrabold text-slate-900 dark:text-white">150+ Countries</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section className="bg-slate-50 dark:bg-slate-900/50 py-24 sm:py-32 w-full mt-12 relative z-10 border-y border-slate-200 dark:border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
                            <h3 className="text-3xl sm:text-4xl font-extrabold mb-6">Built for Modern Logistics</h3>
                            <p className="text-lg text-slate-600 dark:text-slate-400">
                                Lumin Logistics combines cutting-edge technology with premium user experiences, offering real-time visibility and control.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Zap size={28} className="text-amber-500" />}
                                title="Lightning Fast Updates"
                                description="Live GPS tracking and instantly synchronized shipment statuses keep you informed every second."
                            />
                            <FeatureCard
                                icon={<BarChart3 size={28} className="text-primary-light" />}
                                title="Advanced Analytics"
                                description="Monitor your supply chain efficiency with beautiful data visualizations and automated reports."
                            />
                            <FeatureCard
                                icon={<ShieldCheck size={28} className="text-green-500" />}
                                title="End-to-End Security"
                                description="Bank-grade encryption and strict driver verification ensure your goods are always protected."
                            />
                        </div>
                    </div>
                </section>
            </main>

            {/* Simple Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Package className="text-primary w-5 h-5" />
                        <span className="font-bold tracking-wider text-slate-900 dark:text-white">LUMIN LOGISTICS</span>
                    </div>
                    <p className="text-sm text-slate-500 text-center md:text-left">
                        &copy; {new Date().getFullYear()} Lumin Logistics. All rights reserved.
                    </p>
                </div>
            </footer>
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
