import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Search } from "lucide-react";
import { motion } from "motion/react";

export default function ShipmentHistory(): ReactNode {
    // Mock data for history
    const history = [
        { id: "GS-2026-X8Y2", status: "In Transit", from: "New York, USA", to: "London, UK", date: "Oct 12, 2026" },
        { id: "GS-2026-A1B2", status: "Delivered", from: "Berlin, GER", to: "Paris, FRA", date: "Oct 10, 2026" },
        { id: "GS-2026-C3D4", status: "Held by Customs", from: "Tokyo, JPN", to: "Sydney, AUS", date: "Oct 11, 2026" },
        { id: "GS-2026-Q9F8", status: "Out for Delivery", from: "Toronto, CAN", to: "Chicago, USA", date: "Oct 14, 2026" },
        { id: "GS-2026-M5N6", status: "Delivered", from: "Rome, ITA", to: "Madrid, ESP", date: "Sep 28, 2026" },
    ];

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pt-24 space-y-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <Link to="/customer" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                        <Package className="w-8 h-8 text-primary" /> Shipment History
                    </h1>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search tracking ID..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Tracking ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Route</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {history.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                                    <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">{item.id}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <span>{item.from}</span>
                                            <span className="text-slate-300 dark:text-slate-600">&rarr;</span>
                                            <span>{item.to}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{item.date}</td>
                                    <td className="px-6 py-4">
                                        <Link to={`/track?id=${item.id}`} className="text-primary hover:text-primary-light font-bold text-sm tracking-wide">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
