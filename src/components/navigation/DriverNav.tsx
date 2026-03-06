import React from "react";
import BaseNav, { NavItem } from "./BaseNav";
import { 
  LayoutDashboard, 
  MapPin, 
  MessageCircle, 
  User,
  FileText
} from "lucide-react";

export default function DriverNav() {
  const items: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/driver" },
    { icon: MapPin, label: "Deliveries", path: "/driver" }, // Driver dashboard usually lists deliveries
    { icon: FileText, label: "Docs", path: "/driver/documents" },
    { icon: MessageCircle, label: "Chat", path: "/driver/chat" },
    { icon: User, label: "Profile", path: "/driver/profile" },
  ];

  return <BaseNav items={items} accentColor="text-emerald-400" accentBg="bg-emerald-500/10" />;
}
