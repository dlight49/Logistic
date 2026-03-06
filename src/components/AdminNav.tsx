import React from "react";
import { useAuth } from "../features/auth/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Users, Settings, LogOut, MessageSquare, MessageCircle, FileText } from "lucide-react";
import { cn } from "@/src/utils";
import { motion } from "motion/react";

export default function AdminNav() {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", path: "/admin" },
    { icon: Package, label: "Registry", id: "shipments", path: "/admin" },
    { icon: FileText, label: "Quotes", id: "quotes", path: "/admin/quotes" },
    { icon: Users, label: "Fleet", id: "drivers", path: "/admin/drivers" },
    { icon: MessageSquare, label: "Support", id: "tickets", path: "/admin/support" },
    { icon: MessageCircle, label: "Operations", id: "messages", path: "/admin/chat" },
    { icon: Settings, label: "Settings", id: "settings", path: "/admin/notifications" },
  ];

  return (
    <nav className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-max max-w-[calc(100vw-16px)] px-2 sm:px-6 py-2.5 sm:py-3.5 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex items-center gap-1 sm:gap-4 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-x-auto scrollbar-none pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))]">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || (item.path === "/admin" && location.pathname === "/admin");

        return (
          <Link
            key={idx}
            to={item.path}
            className="relative group flex flex-col items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 shrink-0"
          >
            {isActive && (
              <motion.div 
                layoutId="nav-active"
                className="absolute inset-0 bg-blue-500/10 rounded-2xl -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <div className={cn(
              "p-1.5 sm:p-2 rounded-xl transition-all duration-300",
              isActive ? "text-blue-400 bg-blue-500/10" : "text-slate-500 group-hover:text-slate-300 group-hover:bg-white/5"
            )}>
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
            </div>
            <span className={cn(
              "hidden sm:block text-[9px] font-black uppercase tracking-widest transition-colors",
              isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
      
      <div className="w-px h-6 sm:h-8 bg-white/5 mx-0.5 sm:mx-1 hidden sm:block" />

      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 sm:gap-1.5 text-slate-500 hover:text-rose-400 px-1.5 sm:px-3 transition-colors group shrink-0"
      >
        <div className="p-1.5 sm:p-2 rounded-xl group-hover:bg-rose-500/10 transition-all">
          <LogOut className="w-5 h-5" />
        </div>
        <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest">Exit</span>
      </button>
    </nav>
  );
}
