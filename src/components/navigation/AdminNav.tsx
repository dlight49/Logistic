import React from "react";
import BaseNav, { NavItem } from "./BaseNav";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  MessageSquare, 
  MessageCircle, 
  FileText 
} from "lucide-react";

export default function AdminNav() {
  const items: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Package, label: "Registry", path: "/admin/shipments" },
    { icon: FileText, label: "Quotes", path: "/admin/quotes" },
    { icon: Users, label: "Fleet", path: "/admin/drivers" },
    { icon: MessageSquare, label: "Support", path: "/admin/support" },
    { icon: MessageCircle, label: "Operations", path: "/admin/chat" },
    { icon: Settings, label: "Settings", path: "/admin/notifications" },
  ];

  return <BaseNav items={items} />;
}
