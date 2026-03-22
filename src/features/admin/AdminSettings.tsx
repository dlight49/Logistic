import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Search, MessageSquare, Mail, Bell, Edit3, Truck, 
  AlertTriangle, CheckCircle2, ChevronRight, Globe, Shield, 
  User, Database, CreditCard, Lock, MapPin, Package,
  Settings as SettingsIcon, LogOut, Clock, Smartphone
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import AdminNav from "../../components/AdminNav";

type TabType = "general" | "logistics" | "notifications" | "security";

export default function AdminSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>(
    location.pathname.includes("notifications") ? "notifications" : "general"
  );
  const [settings, setSettings] = useState<any>({
    // General
    companyName: "D-Light Logistics",
    companyEmail: "admin@dlight.com",
    timezone: "UTC-5",
    // Notifications (from existing)
    notify_sms: true,
    notify_email: true,
    alert_created: true,
    alert_arrived: true,
    alert_customs: true,
    alert_delivered: true
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/api/settings").then(res => res.json()).catch(() => ({})),
      apiFetch("/api/notifications/logs").then(res => res.json()).catch(() => [])
    ]).then(([settingsData, logsData]) => {
      setSettings((prev: any) => ({ ...prev, ...settingsData }));
      setLogs(logsData);
      setLoading(false);
    });
  }, []);

  const toggleSetting = async (key: string) => {
    const newValue = !settings[key];
    setSettings({ ...settings, [key]: newValue });
    try {
      await apiFetch("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({ [key]: newValue })
      });
    } catch (e) {
      console.warn("Settings API not available, state updated locally.");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: <User className="w-4 h-4" /> },
    { id: "logistics", label: "Logistics", icon: <Truck className="w-4 h-4" /> },
    { id: "notifications", label: "Alerts", icon: <Bell className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
  ];

  if (loading) return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    </div>
  );

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full hover:bg-slate-200 dark:hover:bg-primary/20 transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">Settings</h1>
          </div>
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-200 dark:hover:bg-primary/20">
            <Search className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Custom Tabs */}
        <div className="max-w-4xl mx-auto w-full px-4 pb-2">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all",
                  activeTab === tab.id 
                    ? "bg-white dark:bg-slate-700 text-accent shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                {tab.icon}
                <span className="hidden xs:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full pb-40 pt-2 px-4 sm:px-6">
        {activeTab === "general" && <GeneralSettings settings={settings} />}
        {activeTab === "logistics" && <LogisticsSettings settings={settings} />}
        {activeTab === "notifications" && (
          <NotificationTab 
            settings={settings} 
            toggleSetting={toggleSetting} 
            logs={logs} 
          />
        )}
        {activeTab === "security" && <SecuritySettings />}
      </main>

      <AdminNav />
    </div>
  );
}

function GeneralSettings({ settings }: { settings: any }) {
  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col items-center py-4">
        <div className="relative group">
          <div className="size-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/20 overflow-hidden">
            DL
          </div>
          <button className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-lg shadow-md hover:scale-105 transition-transform">
            <Edit3 className="w-4 h-4 text-accent" />
          </button>
        </div>
        <h3 className="mt-4 font-bold text-lg">{settings.companyName || "D-Light Logistics"}</h3>
        <p className="text-sm text-slate-500 italic">Premium Logistic Solutions</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">Business Identity</h2>
        <div className="grid gap-3">
          <InputGroup label="Official Name" value={settings.companyName || "D-Light Logistics"} />
          <InputGroup label="Support Email" value={settings.companyEmail || "admin@dlight.com"} />
          <InputGroup label="Phone Number" value="+1 (555) 012-3456" />
        </div>
      </section>

      <section className="space-y-4 pt-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">Localization</h2>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
           <SettingRow icon={<Globe className="w-5 h-5 text-blue-500" />} label="Default Language" value="English (US)" />
           <SettingRow icon={<Clock className="w-5 h-5 text-amber-500" />} label="System Timezone" value={settings.timezone || "UTC-5"} />
           <SettingRow icon={<CreditCard className="w-5 h-5 text-emerald-500" />} label="Base Currency" value="USD ($)" />
        </div>
      </section>

      <button className="w-full bg-accent hover:bg-accent-light text-white font-bold py-4 rounded-2xl shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4">
        Save Profile Changes
      </button>
    </div>
  );
}

function LogisticsSettings({ settings }: { settings: any }) {
  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">Pricing Configuration</h2>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-primary/10 rounded-lg text-primary">
                 <Database className="w-5 h-5" />
               </div>
               <div>
                 <p className="font-semibold">Base Rate per KG</p>
                 <p className="text-[10px] text-slate-500">Global standard for air freight</p>
               </div>
             </div>
             <p className="font-bold text-accent">$8.50</p>
          </div>
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-accent/10 rounded-lg text-accent">
                 <CreditCard className="w-5 h-5" />
               </div>
               <div>
                 <p className="font-semibold">Customs Fee %</p>
                 <p className="text-[10px] text-slate-500">Calculated on declared value</p>
               </div>
             </div>
             <p className="font-bold text-accent">12%</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">Operations</h2>
        <div className="space-y-2">
          <MenuLink icon={<MapPin className="text-indigo-500" />} title="Coverage Zones" desc="Manage delivery areas & pickup points" />
          <MenuLink icon={<Package className="text-orange-500" />} title="Shipment Types" desc="Define categories (Fragile, Express, etc)" />
          <MenuLink icon={<Truck className="text-teal-500" />} title="Fleet Management" desc="Assign operators and vehicles" />
        </div>
      </section>
    </div>
  );
}

function NotificationTab({ settings, toggleSetting, logs }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <section className="p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">Communication Channels</h2>
        <div className="space-y-3">
          <ChannelCard 
            icon={<MessageSquare className="w-6 h-6" />}
            title="SMS Notifications"
            desc="Primary gateway for instant alerts"
            checked={settings.notify_sms}
            onChange={() => toggleSetting('notify_sms')}
          />
          <ChannelCard 
            icon={<Mail className="w-6 h-6" />}
            title="Email Notifications"
            desc="Detailed reports and documentation"
            checked={settings.notify_email}
            onChange={() => toggleSetting('notify_email')}
          />
        </div>
      </section>

      <section className="p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">Event-Driven Alerts</h2>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          <AlertToggle 
            icon={<Bell className="text-accent w-4 h-4" />}
            title="Order Created"
            checked={settings.alert_created}
            onChange={() => toggleSetting('alert_created')}
          />
          <AlertToggle 
            icon={<Truck className="text-accent w-4 h-4" />}
            title="Arrived at Destination"
            checked={settings.alert_arrived}
            onChange={() => toggleSetting('alert_arrived')}
          />
          <AlertToggle 
            icon={<AlertTriangle className="text-red-500 w-4 h-4" />}
            title="Held by Customs"
            checked={settings.alert_customs}
            onChange={() => toggleSetting('alert_customs')}
          />
          <AlertToggle 
            icon={<CheckCircle2 className="text-green-500 w-4 h-4" />}
            title="Delivered"
            checked={settings.alert_delivered}
            onChange={() => toggleSetting('alert_delivered')}
          />
        </div>
      </section>

      <section className="p-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Activity History</h2>
          <button className="text-xs font-semibold text-accent hover:underline">Download CSV</button>
        </div>
        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center">
               <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 text-slate-400">
                  <Clock className="w-6 h-6" />
               </div>
               <p className="text-sm font-medium text-slate-500">No events logged in the last 24h</p>
            </div>
          ) : (
            logs.map((log: any) => (
              <LogItem 
                key={log.id}
                color={log.channel === 'Email' ? "bg-primary" : "bg-accent"}
                text={log.message}
                sub={`${log.channel} • ${new Date(log.timestamp).toLocaleTimeString()}`}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">Account Safety</h2>
        <div className="space-y-2">
          <MenuLink icon={<Lock className="text-rose-500" />} title="Change Password" desc="Last updated 3 months ago" />
          <MenuLink icon={<Smartphone className="text-primary" />} title="Two-Factor Auth" desc="SMS & Authenticator active" />
          <MenuLink icon={<Clock className="text-slate-500" />} title="Active Sessions" desc="5 logged-in devices discovered" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-red-500 px-1">Danger Zone</h2>
        <div className="bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900 p-4">
          <button className="w-full flex items-center justify-between text-red-600 dark:text-red-400 font-bold group">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Log out of all devices</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

// Helpers
function InputGroup({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">{label}</label>
      <input 
        readOnly 
        value={value} 
        className="block w-full text-sm font-medium bg-transparent border-none p-0 focus:ring-0" 
      />
    </div>
  );
}

function SettingRow({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-sm">{value}</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
}

function MenuLink({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <button className="w-full flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left group">
      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-400" />
    </button>
  );
}

function ChannelCard({ icon, title, desc, checked, onChange }: any) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
      <div className="flex items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-accent shrink-0 size-12">
        {icon}
      </div>
      <div className="flex flex-col flex-1">
        <p className="font-bold text-base leading-tight">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

function AlertToggle({ icon, title, checked, onChange }: any) {
  return (
    <div className="p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {icon}
          </div>
          <span className="font-bold text-sm">{title}</span>
        </div>
        <Switch small checked={checked} onChange={onChange} />
      </div>
    </div>
  );
}

function LogItem({ color, text, sub }: any) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-accent/30 transition-all group">
      <div className={cn("size-2 rounded-full shrink-0 animate-pulse", color)}></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate">{text}</p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 uppercase tracking-wide">{sub}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
    </div>
  );
}

function Switch({ small, checked, onChange }: any) {
  return (
    <label className={cn(
      "relative flex cursor-pointer items-center rounded-full p-1 transition-all duration-300",
      checked ? "bg-accent shadow-lg shadow-accent/40" : "bg-slate-200 dark:bg-slate-800",
      small ? "h-6 w-10" : "h-8 w-14"
    )}>
      <input checked={checked} className="sr-only peer" type="checkbox" onChange={onChange} />
      <div className={cn(
        "rounded-full bg-white shadow-sm transition-all duration-300",
        small ? "h-4 w-4" : "h-6 w-6",
        checked ? (small ? "translate-x-4" : "translate-x-6") : "translate-x-0"
      )}></div>
    </label>
  );
}
