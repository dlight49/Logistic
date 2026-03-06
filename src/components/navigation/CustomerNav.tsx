import React from "react";
import BaseNav, { NavItem } from "./BaseNav";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  MessageSquare, 
  Settings 
} from "lucide-react";

export default function CustomerNav() {
  const items: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/customer" },
    { icon: PlusCircle, label: "Quote", path: "/customer/quote" },
    { icon: History, label: "History", path: "/customer/history" },
    { icon: MessageSquare, label: "Tickets", path: "/customer/tickets" },
    { icon: Settings, label: "Settings", path: "/customer/settings" },
  ];

  return <BaseNav items={items} accentColor="text-primary" accentBg="bg-primary/10" />;
}
