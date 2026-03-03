import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Users, Settings } from "lucide-react";
import { cn } from "@/src/utils";

export default function AdminNav() {
  const location = useLocation();
  
  const navItems = [
    { path: "/admin", label: "Home", icon: LayoutDashboard },
    { path: "/admin", label: "Shipments", icon: Package }, // Both point to admin for now as it's the main list
    { path: "/admin/operators", label: "Operators", icon: Users },
    { path: "/admin/notifications", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-20">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || (item.path === "/admin" && location.pathname === "/admin");
        // Special case for shipments vs home if we want to distinguish later
        
        return (
          <Link 
            key={idx} 
            to={item.path} 
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
