import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Bell, CloudUpload, CheckCircle2, Clock, Eye, Download, AlertCircle, Upload, Home, Truck, FileText, User } from "lucide-react";
import { Shipment, CustomsDoc } from "@/src/types";
import { cn } from "@/src/utils";

export default function CustomsPortal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    fetch(`/api/shipments/${id}`).then(res => res.json()).then(setShipment);
  }, [id]);

  if (!shipment) return null;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-slate-200 dark:border-primary/30 justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-primary/20 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight">Customs Doc Portal</h2>
        </div>
        <button className="flex size-10 items-center justify-center rounded-full">
          <Bell className="text-accent w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 flex flex-col gap-6 p-4">
        <section className="flex flex-col gap-4 rounded-xl p-6 bg-primary text-white shadow-lg border border-primary/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FileText className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-300 text-xs font-semibold uppercase tracking-widest mb-1">Active Shipment</p>
            <h1 className="text-3xl font-extrabold leading-tight">{shipment.id}</h1>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
              <p className="text-accent text-sm font-bold uppercase tracking-wider">{shipment.status}</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-bold px-1">Actions</h3>
          <button className="flex w-full items-center justify-between rounded-xl bg-accent px-5 py-4 text-white font-bold shadow-md active:scale-[0.98] transition-all">
            <div className="flex items-center gap-3">
              <CloudUpload className="w-5 h-5" />
              <span>Upload New Document</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold">Required Documents</h3>
            <span className="text-slate-500 text-sm font-medium">3 Total</span>
          </div>

          <DocCard 
            title="Bill of Lading" 
            status="verified" 
            date="Oct 24, 2023" 
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            statusText="Verified"
            statusColor="text-emerald-600 dark:text-emerald-400"
          />
          
          <DocCard 
            title="Commercial Invoice" 
            status="pending" 
            date="Oct 26, 2023" 
            icon={<Clock className="w-4 h-4 text-accent" />}
            statusText="Pending Review"
            statusColor="text-accent"
            showControls
          />

          <DocCard 
            title="Packing List" 
            status="missing" 
            icon={<AlertCircle className="w-4 h-4 text-red-500" />}
            statusText="Missing Document"
            statusColor="text-red-600 dark:text-red-400"
            isMissing
          />
        </section>
      </main>

      <nav className="sticky bottom-0 z-50 flex border-t border-slate-200 dark:border-primary/30 bg-background-light dark:bg-background-dark px-4 pb-6 pt-3">
        <NavIcon icon={<Home className="w-6 h-6" />} label="Home" />
        <NavIcon icon={<Truck className="w-6 h-6" />} label="Shipments" />
        <NavIcon icon={<FileText className="w-6 h-6" />} label="Documents" active />
        <NavIcon icon={<User className="w-6 h-6" />} label="Profile" />
      </nav>
    </div>
  );
}

function DocCard({ title, date, icon, statusText, statusColor, isMissing, showControls }: any) {
  return (
    <div className={cn(
      "flex flex-col gap-4 rounded-xl p-4 border",
      isMissing ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30" : "bg-slate-100 dark:bg-primary/10 border-slate-200 dark:border-primary/20"
    )}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className={cn("flex items-center gap-1.5", statusColor)}>
            {icon}
            <p className="text-xs font-bold uppercase tracking-wide">{statusText}</p>
          </div>
          <p className="text-base font-bold">{title}</p>
          {date && <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Uploaded: {date}</p>}
          {isMissing && <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Action Required</p>}
        </div>
        <div className="flex gap-2">
          {!isMissing ? (
            <>
              <button className="flex size-9 items-center justify-center rounded-lg bg-slate-200 dark:bg-primary/30 text-slate-700 dark:text-slate-200">
                <Eye className="w-5 h-5" />
              </button>
              <button className="flex size-9 items-center justify-center rounded-lg bg-slate-200 dark:bg-primary/30 text-slate-700 dark:text-slate-200">
                <Download className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white uppercase tracking-tighter">
              <Upload className="w-3 h-3" /> Upload
            </button>
          )}
        </div>
      </div>
      {showControls && (
        <div className="mt-2 pt-4 border-t border-slate-200 dark:border-primary/20">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Operator Controls</p>
          <div className="flex flex-col gap-3">
            <input className="w-full rounded-lg bg-white dark:bg-background-dark border-slate-300 dark:border-primary/40 text-sm focus:ring-accent focus:border-accent" placeholder="Reason for rejection (optional)..." type="text"/>
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-bold text-white">Approve</button>
              <button className="flex-1 rounded-lg bg-red-600/20 py-2 text-sm font-bold text-red-500 border border-red-600/30">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavIcon({ icon, label, active }: any) {
  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-1", active ? "text-primary dark:text-accent" : "text-slate-400")}>
      {icon}
      <p className="text-[10px] font-bold uppercase">{label}</p>
    </div>
  );
}

function ChevronRight(props: any) {
  return <span className="material-symbols-outlined">expand_more</span>;
}
