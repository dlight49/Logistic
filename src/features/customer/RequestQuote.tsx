import React, { useState, ReactNode } from "react";
import { ArrowLeft, Calculator, MapPin, Package, CheckCircle2, ChevronRight, DollarSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { quoteService } from "../../services/quoteService";

export default function RequestQuote(): ReactNode {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [weight, setWeight] = useState("");
    const [speed, setSpeed] = useState("Standard");
    const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

    const handleCalculate = () => {
        const base = 50;
        const w = parseFloat(weight) || 1;
        const mult = speed === "Express" ? 2 : speed === "Priority" ? 3 : 1;
        setCalculatedPrice(base + (w * 5 * mult));
        setStep(3);
    };

    const handleBook = async () => {
        setLoading(true);
        try {
            await quoteService.createQuote({
                origin,
                destination,
                weight: parseFloat(weight),
                speed,
                estimated_price: calculatedPrice || 0
            });
            setStep(4);
        } catch (error) {
            console.error("Booking failed", error);
            alert("Failed to process booking. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
        exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
    };

    return (
        <div className="bg-slate-950 font-display text-slate-100 min-h-screen pb-32 relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-1/4 right-[-20%] w-[60%] h-[40%] bg-accent/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse-slow" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

            <div className="max-w-2xl mx-auto pt-16 px-4 relative z-10">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                    <button onClick={() => navigate('/customer')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-primary transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
                        <Calculator className="w-8 h-8 text-primary" /> Request a Quote
                    </h1>
                    <p className="text-slate-400 mt-2">Get an instant estimate for your next shipment.</p>
                </motion.div>

                {/* Steps Indicator */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4">
                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all", step >= i ? "bg-primary text-white shadow-[0_0_12px_rgba(59,130,246,0.6)]" : "bg-white/5 text-slate-500 border border-white/10")}>
                                {i}
                            </div>
                            {i < 3 && <div className={cn("w-12 h-1 rounded-full", step > i ? "bg-primary" : "bg-white/5")} />}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-accent" /> Route Details</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Origin</label>
                                    <input
                                        type="text"
                                        value={origin}
                                        onChange={e => setOrigin(e.target.value)}
                                        className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                                        placeholder="e.g. New York, USA"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destination</label>
                                    <input
                                        type="text"
                                        value={destination}
                                        onChange={e => setDestination(e.target.value)}
                                        className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-slate-600"
                                        placeholder="e.g. London, UK"
                                    />
                                </div>
                                <button
                                    disabled={!origin || !destination}
                                    onClick={nextStep}
                                    className="w-full mt-4 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Continue to Package <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> Package Details</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Weight (KG)</label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={e => setWeight(e.target.value)}
                                        className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                                        placeholder="0.0"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Service Speed</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {["Standard", "Express", "Priority"].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSpeed(s)}
                                                className={cn("p-4 rounded-xl border text-left flex flex-col gap-1 transition-all", speed === s ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-white/5 border-white/10 hover:bg-white/10")}
                                            >
                                                <div className="flex justify-between w-full">
                                                    <span className="font-bold text-white">{s}</span>
                                                    {speed === s && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                                </div>
                                                <span className="text-xs text-slate-400">{s === 'Standard' ? '5-7 Days' : s === 'Express' ? '3-4 Days' : '1-2 Days'}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button onClick={prevStep} className="flex-1 py-4 font-bold text-slate-400 hover:text-white bg-white/5 rounded-xl border border-white/5 transition-colors">Back</button>
                                    <button
                                        disabled={!weight}
                                        onClick={handleCalculate}
                                        className="flex-[2] bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                    >
                                        Calculate Estimate
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl text-center">
                            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                                <DollarSign className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">Quote Ready</h3>
                            <p className="text-slate-400 text-sm">Estimated cost from {origin} to {destination}</p>

                            <div className="my-8 py-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{speed} Delivery</p>
                                <p className="text-5xl font-black text-white">${calculatedPrice?.toFixed(2)}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button onClick={prevStep} className="flex-1 py-4 font-bold text-slate-400 hover:text-white bg-white/5 rounded-xl border border-white/5 transition-colors">Adjust Details</button>
                                <button
                                    disabled={loading}
                                    onClick={handleBook}
                                    className="flex-1 bg-accent hover:bg-accent/90 text-white py-4 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {loading ? "Processing..." : "Confirm Booking"}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div key="step4" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl text-center">
                            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-4">Request Submitted!</h3>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Your quote request from <span className="text-white font-bold">{origin}</span> to <span className="text-white font-bold">{destination}</span> has been received. 
                                Our team will review it and get back to you shortly.
                            </p>
                            <button
                                onClick={() => navigate('/customer')}
                                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                            >
                                Return to Dashboard
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
