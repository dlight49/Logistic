import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Bell, CloudUpload, CheckCircle2, Clock, Eye, Download, AlertCircle, Upload, Home, Truck, FileText, User } from "lucide-react";
import { Shipment, CustomsDoc } from "@/src/types";
import { cn } from "@/src/utils";

export default function CustomsPortal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<(Shipment & { docs: CustomsDoc[] }) | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocType, setNewDocType] = useState("Bill of Lading");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchShipment = () => {
    fetch(`/api/shipments/${id}`).then(res => res.json()).then(setShipment);
  };

  useEffect(() => {
    fetchShipment();
  }, [id]);

  const handleUpload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shipments/${id}/docs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_type: newDocType })
      });
      if (res.ok) {
        setShowUploadModal(false);
        fetchShipment();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (docId: number, status: string) => {
    try {
      const res = await fetch(`/api/docs/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchShipment();
    } catch (err) {
      console.error(err);
    }
  };

  if (!shipment) return null;

  const requiredDocs = ["Bill of Lading", "Commercial Invoice", "Packing List"];
  const uploadedDocs = shipment.docs || [];

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
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex w-full items-center justify-between rounded-xl bg-accent px-5 py-4 text-white font-bold shadow-md active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <CloudUpload className="w-5 h-5" />
              <span>Upload New Document</span>
            </div>
            <span className="material-symbols-outlined">add</span>
          </button>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold">Shipment Documents</h3>
            <span className="text-slate-500 text-sm font-medium">{uploadedDocs.length} Total</span>
          </div>

          {uploadedDocs.length === 0 ? (
            <div className="py-12 text-center bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm text-slate-500 italic">No documents uploaded yet</p>
            </div>
          ) : (
            uploadedDocs.map(doc => (
              <DocCard 
                key={doc.id}
                title={doc.doc_type} 
                status={doc.status} 
                date={new Date(doc.uploaded_at).toLocaleDateString()} 
                isAdmin={user.role === 'admin'}
                onUpdateStatus={(status: string) => handleUpdateStatus(doc.id, status)}
              />
            ))
          )}
        </section>
      </main>

      {showUploadModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">Upload Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <ArrowLeft className="w-5 h-5 rotate-90" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Document Type</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                  value={newDocType}
                  onChange={e => setNewDocType(e.target.value)}
                >
                  {requiredDocs.map(d => <option key={d} value={d}>{d}</option>)}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center gap-3">
                <CloudUpload className="w-10 h-10 text-primary opacity-50" />
                <p className="text-sm text-slate-500">Tap to select or drag file here</p>
                <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB</p>
              </div>
              <button 
                disabled={loading}
                onClick={handleUpload}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {loading ? "Uploading..." : "Confirm Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="sticky bottom-0 z-50 flex border-t border-slate-200 dark:border-primary/30 bg-background-light dark:bg-background-dark px-4 pb-6 pt-3">
        <Link to="/driver" className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400">
          <Home className="w-6 h-6" />
          <p className="text-[10px] font-bold uppercase">Home</p>
        </Link>
        <div className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400">
          <Truck className="w-6 h-6" />
          <p className="text-[10px] font-bold uppercase">Shipments</p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-1 text-primary dark:text-accent">
          <FileText className="w-6 h-6" />
          <p className="text-[10px] font-bold uppercase">Documents</p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400">
          <User className="w-6 h-6" />
          <p className="text-[10px] font-bold uppercase">Profile</p>
        </div>
      </nav>
    </div>
  );
}

function DocCard({ title, date, status, isAdmin, onUpdateStatus }: any) {
  const statusConfig: any = {
    verified: { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, text: "Verified", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
    pending: { icon: <Clock className="w-4 h-4 text-accent" />, text: "Pending Review", color: "text-accent", bg: "bg-amber-50 dark:bg-amber-950/20" },
    rejected: { icon: <AlertCircle className="w-4 h-4 text-red-500" />, text: "Rejected", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/20" }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={cn("flex flex-col gap-4 rounded-xl p-4 border border-slate-200 dark:border-slate-800", config.bg)}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className={cn("flex items-center gap-1.5", config.color)}>
            {config.icon}
            <p className="text-xs font-bold uppercase tracking-wide">{config.text}</p>
          </div>
          <p className="text-base font-bold">{title}</p>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Uploaded: {date}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex size-9 items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            <Eye className="w-5 h-5" />
          </button>
          <button className="flex size-9 items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
      {isAdmin && status === 'pending' && (
        <div className="mt-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Dispatcher Actions</p>
          <div className="flex gap-2">
            <button 
              onClick={() => onUpdateStatus('verified')}
              className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-bold text-white shadow-md shadow-emerald-500/20"
            >
              Approve
            </button>
            <button 
              onClick={() => onUpdateStatus('rejected')}
              className="flex-1 rounded-lg bg-red-600/20 py-2 text-sm font-bold text-red-500 border border-red-600/30"
            >
              Reject
            </button>
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
