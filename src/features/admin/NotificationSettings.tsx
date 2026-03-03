import { ArrowLeft, Search, MessageSquare, Mail, Bell, Edit3, Truck, AlertTriangle, CheckCircle2, Package, LayoutDashboard, BarChart4, Settings } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/src/utils";
import AdminNav from "@/src/components/AdminNav";

export default function NotificationSettings() {
  const navigate = useNavigate();

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto w-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full hover:bg-slate-200 dark:hover:bg-primary/20 transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </button>
            <h1 className="text-lg font-bold tracking-tight">Notification Settings</h1>
          </div>
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-200 dark:hover:bg-primary/20">
            <Search className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto max-w-md mx-auto w-full pb-24">
        <section className="p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">Global Channels</h2>
          <div className="space-y-3">
            <ChannelCard icon={<MessageSquare className="w-6 h-6" />} title="SMS Notifications" desc="Primary gateway for instant alerts" />
            <ChannelCard icon={<Mail className="w-6 h-6" />} title="Email Notifications" desc="Detailed reports and documentation" />
          </div>
        </section>

        <section className="p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">Shipment Status Alerts</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
            <AlertToggle icon={<Bell className="text-accent w-4 h-4" />} title="Order Created" />
            <AlertToggle icon={<Truck className="text-accent w-4 h-4" />} title="Arrived at Destination" />
            <AlertToggle icon={<AlertTriangle className="text-red-500 w-4 h-4" />} title="Held by Customs" />
            <AlertToggle icon={<CheckCircle2 className="text-green-500 w-4 h-4" />} title="Delivered" />
          </div>
        </section>

        <section className="p-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recent Logs</h2>
            <button className="text-xs font-semibold text-accent hover:underline">View All</button>
          </div>
          <div className="space-y-2">
            <LogItem color="bg-green-500" text="Delivered SMS sent to +1 415..." sub="Shipment #LX-9021 • 2 mins ago" />
            <LogItem color="bg-primary" text="Customs Email sent to admin@logi..." sub="Shipment #UK-4412 • 15 mins ago" />
          </div>
        </section>
      </main>

      <AdminNav />
    </div>
  );
}

function ChannelCard({ icon, title, desc }: any) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent shrink-0 size-12">
        {icon}
      </div>
      <div className="flex flex-col flex-1">
        <p className="font-semibold text-base">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
      <Switch />
    </div>
  );
}

function AlertToggle({ icon, title }: any) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <Switch small />
      </div>
      <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
        <Edit3 className="w-4 h-4" /> Edit Template
      </button>
    </div>
  );
}

function LogItem({ color, text, sub }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
      <div className={cn("size-2 rounded-full", color)}></div>
      <div className="flex-1">
        <p className="text-sm font-medium">{text}</p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">{sub}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400" />
    </div>
  );
}

function Switch({ small }: any) {
  return (
    <label className={cn("relative flex cursor-pointer items-center rounded-full bg-slate-300 dark:bg-slate-800 p-1 has-[:checked]:bg-accent transition-colors", small ? "h-6 w-10" : "h-7 w-12")}>
      <input checked className="sr-only peer" type="checkbox" onChange={() => {}} />
      <div className={cn("rounded-full bg-white shadow-sm transition-transform", small ? "h-4 w-4 peer-checked:translate-x-4" : "h-5 w-5 peer-checked:translate-x-5")}></div>
    </label>
  );
}

function ChevronRight(props: any) {
  return <span className="material-symbols-outlined">chevron_right</span>;
}

function Warning(props: any) {
  return <span className="material-symbols-outlined">warning</span>;
}
