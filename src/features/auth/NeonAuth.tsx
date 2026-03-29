import React from 'react';
import { AuthView, AccountView } from '@neondatabase/neon-js/auth';
import { Truck } from 'lucide-react';
import { motion } from 'motion/react';

export function NeonAuthPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-col items-center gap-2"
            >
                <div className="bg-primary/10 p-3 rounded-2xl shadow-xl shadow-primary/5">
                    <Truck className="text-accent w-10 h-10" />
                </div>
                <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">LogisticsPro Secure</h1>
            </motion.div>
            
            <div className="w-full max-w-md glass-panel p-8 rounded-[2.5rem] border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl">
                <AuthView />
            </div>
            
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Protected by Neon Cloud Guard</p>
        </div>
    );
}

export function NeonAccountPage() {
    return (
        <div className="min-h-screen flex flex-col items-center py-12 bg-background-light dark:bg-background-dark p-6">
             <div className="w-full max-w-2xl glass-panel p-8 rounded-[2.5rem] border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl">
                <AccountView />
            </div>
        </div>
    );
}
