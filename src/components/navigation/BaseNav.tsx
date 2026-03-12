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
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100vw-24px)] md:w-max max-w-lg md:max-w-2xl px-1 sm:px-6 py-2 sm:py-3.5 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] flex flex-wrap items-center justify-center gap-x-1 sm:gap-x-4 gap-y-2 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isActive = item.match ? item.match(location.pathname) : location.pathname === item.path;

        return (
          <Link
            key={idx}
            to={item.path}
            className="relative group flex flex-col items-center gap-1 px-1 sm:px-2 shrink-0 transition-transform active:scale-95"
          >
            {isActive && (
              <motion.div
                layoutId="nav-active"
                className={cn("absolute inset-0 rounded-2xl -z-10", accentBg)}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <div className={cn(
              "p-1.5 sm:p-2.5 rounded-xl transition-all duration-300",
              isActive ? cn(accentColor, accentBg) : "text-slate-400 group-hover:text-white group-hover:bg-white/5"
            )}>
              <Icon className={cn("w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]", isActive && "stroke-[2.5px]")} />
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

      <div className="w-px h-6 sm:h-8 bg-white/5 mx-0.5 sm:mx-1 hidden sm:block" />

      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 px-1 sm:px-2 transition-colors group shrink-0"
      >
        <div className="p-1.5 sm:p-2.5 rounded-xl group-hover:bg-rose-500/10 transition-all text-slate-500 group-hover:text-rose-400">
          <LogOut className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
        </div>
        <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-rose-400">Exit</span>
      </button>
    </div>
  );
}
