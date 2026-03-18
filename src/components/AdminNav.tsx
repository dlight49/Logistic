import React from "react";
import BaseNav, { NavItem } from "./navigation/BaseNav";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  MessageSquare, 
  MessageCircle, 
  FileText,
  Truck
} from "lucide-react";

export default function AdminNav() {
  const items: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Package, label: "Registry", path: "/admin/shipments" },
    { icon: FileText, label: "Quotes", path: "/admin/quotes" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Truck, label: "Fleet", path: "/admin/drivers" },
    { icon: MessageSquare, label: "Support", path: "/admin/support" },
    { icon: MessageCircle, label: "Operations", path: "/admin/chat" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return <BaseNav items={items} />;
}
