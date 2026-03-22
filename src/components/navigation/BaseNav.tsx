import React, { ReactNode } from "react";
import { useAuth } from "../../features/auth/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon, LogOut } from "lucide-react";
import { cn } from "../../utils";
import { motion } from "motion/react";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  match?: (pathname: string) => boolean;
}

interface BaseNavProps {
  items: NavItem[];
  accentColor?: string;
  accentBg?: string;
}

export default function BaseNav({ items, accentColor = "text-blue-400", accentBg = "bg-blue-500/10" }: BaseNavProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed bottom-4 sm:bottom-6 inset-x-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-max max-w-[calc(100vw-16px)] px-3 sm:px-6 py-3.5 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-start sm:justify-center gap-1.5 sm:gap-4 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-x-auto no-scrollbar scroll-smooth flex-nowrap pb-[calc(12px+env(safe-area-inset-bottom,0px))] md:pb-3.5">
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isActive = item.match ? item.match(location.pathname) : location.pathname === item.path;

        return (
          <Link
            key={idx}
            to={item.path}
            className="relative group flex flex-col items-center gap-1 px-1.5 sm:px-2 shrink-0 transition-transform active:scale-90"
          >
            {isActive && (
              <motion.div
                layoutId="nav-active"
                className={cn("absolute inset-0 rounded-2xl -z-10", accentBg)}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <div className={cn(
              "p-2.5 sm:p-2.5 rounded-xl transition-all duration-300",
              isActive ? cn(accentColor, accentBg) : "text-slate-400 group-hover:text-white group-hover:bg-white/5"
            )}>
              <Icon className={cn("w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]", isActive && "stroke-[2.5px]")} />
            </div>
            <span className={cn(
              "hidden sm:block text-[9px] font-black uppercase tracking-widest transition-colors",
              isActive ? accentColor : "text-slate-500 group-hover:text-slate-300"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}

      <div className="w-px h-6 sm:h-8 bg-white/5 mx-0.5 sm:mx-1 shrink-0" />

      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 px-1.5 sm:px-2 transition-colors group shrink-0 active:scale-90"
      >
        <div className="p-2.5 sm:p-2.5 rounded-xl group-hover:bg-rose-500/10 transition-all text-slate-500 group-hover:text-rose-400">
          <LogOut className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" />
        </div>
        <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-rose-400">Exit</span>
      </button>
    </nav>
  );
}
