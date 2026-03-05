import React, { useState, useEffect, ReactNode } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Gavel,
  FileText,
  Truck,
  ChevronRight,
  MoreVertical,
  Edit3,
  Users,
  Sparkles,
  Loader2
} from "lucide-react";
import Markdown from "react-markdown";
import { Shipment, Operator } from "../../types";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import AssignOperatorModal from "../../components/AssignOperatorModal";
import { generateShipmentSummary } from "../../services/geminiService";

export default function ShipmentDetailView(): ReactNode {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [generatingAi, setGeneratingAi] = useState<boolean>(false);

  useEffect(() => {
    fetchShipment();
    fetchOperators();
  }, [id]);

  const fetchShipment = async () => {
    try {
      const res = await apiFetch(`/api/shipments/${id}`);
      const data = await res.json();
      setShipment(data);
    } catch (err) {
      console.error("Failed to fetch shipment", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOperators = async () => {
    try {
      const res = await apiFetch("/api/operators");
      const data = await res.json();
      setOperators(data);
    } catch (err) {
      console.error("Failed to fetch operators", err);
    }
  };

  const handleGenerateAiSummary = async () => {
    if (!shipment) return;
    setGeneratingAi(true);
    try {
      const summary = await generateShipmentSummary(shipment);
      setAiSummary(summary || "No summary generated.");
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAi(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (!shipment) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4 text-center">
      <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
      <h2 className="text-xl font-bold">Shipment Not Found</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-primary font-bold">Go Back</button>
    </div>
  );

  const assignedOperator = operators.find(op => op.id === shipment.operator_id);

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark pb-20">
      <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold leading-tight">{shipment.id}</h1>
            <p className="text-xs text-slate-500">Shipment Details</p>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 p-4 space-y-6">
        {/* Status Banner */}
        <div className={cn(
          "p-4 rounded-2xl border flex items-center justify-between",
          shipment.status === 'Delivered' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" :
            shipment.status === 'Held by Customs' ? "bg-amber-500/10 border-amber-500/20 text-amber-600" :
              "bg-primary/10 border-primary/20 text-primary"
        )}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-70">Current Status</p>
              <p className="text-lg font-bold">{shipment.status}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-white/50 dark:bg-black/20 px-2 py-1 rounded-full">
            Updated {new Date(shipment.updates?.[0]?.timestamp || shipment.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Sender & Receiver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <User className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Sender Details</h3>
            </div>
            <div>
              <p className="font-bold text-lg">{shipment.sender_name}</p>
              <p className="text-sm text-slate-500">{shipment.sender_address}</p>
              <p className="text-sm text-slate-500">{shipment.sender_city}, {shipment.sender_country}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-accent">
              <MapPin className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Receiver Details</h3>
            </div>
            <div>
              <p className="font-bold text-lg">{shipment.receiver_name}</p>
              <p className="text-sm text-slate-500">{shipment.receiver_address}</p>
              <p className="text-sm text-slate-500">{shipment.receiver_city}, {shipment.receiver_country}</p>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                <p className="text-xs text-slate-500">{shipment.receiver_phone}</p>
                <p className="text-xs text-slate-500">{shipment.receiver_email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Operator Assignment */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Users className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Assigned Operator</h3>
            </div>
            <button
              onClick={() => setShowAssignModal(true)}
              className="text-xs font-bold text-primary hover:underline"
            >
              Change
            </button>
          </div>
          {assignedOperator ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="font-bold text-sm">{assignedOperator.name}</p>
                <p className="text-xs text-slate-500">{assignedOperator.phone || assignedOperator.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-xs text-slate-500 italic">No operator assigned yet</p>
              <button
                onClick={() => setShowAssignModal(true)}
                className="bg-primary text-white px-3 py-1 rounded-lg text-[10px] font-bold"
              >
                Assign Now
              </button>
            </div>
          )}
        </div>

        {/* AI Summary Section */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-2xl border border-primary/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">AI Shipment Summary</h3>
            </div>
            {!aiSummary && !generatingAi && (
              <button
                onClick={handleGenerateAiSummary}
                className="text-[10px] font-bold bg-primary text-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-1"
              >
                Generate
              </button>
            )}
          </div>

          {generatingAi ? (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <p className="text-xs text-slate-500 font-medium italic">Analyzing logistics data...</p>
            </div>
          ) : aiSummary ? (
            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
              <Markdown>{aiSummary}</Markdown>
              <button
                onClick={handleGenerateAiSummary}
                className="mt-4 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Regenerate Summary
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Get an AI-powered overview of this shipment's status and potential risks.</p>
          )}
        </div>

        {/* Customs Documents */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gavel className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold">Customs Documents</h3>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
              {shipment.docs?.length || 0} Total
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {shipment.docs?.map(doc => (
              <div key={doc.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-bold">{doc.doc_type}</p>
                    <p className="text-[10px] text-slate-500">Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                  doc.status === 'verified' ? "bg-emerald-500/10 text-emerald-500" :
                    doc.status === 'pending' ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                )}>
                  {doc.status}
                </span>
              </div>
            ))}
            {(!shipment.docs || shipment.docs.length === 0) && (
              <div className="p-8 text-center text-slate-400 italic text-sm">
                No documents uploaded yet
              </div>
            )}
          </div>
        </div>

        {/* Tracking History */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 px-1">Tracking History</h3>
          <div className="space-y-0">
            {shipment.updates?.map((update, idx) => (
              <div key={update.id} className="relative pl-8 pb-6 group">
                {idx !== shipment.updates!.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-800" />
                )}
                <div className={cn(
                  "absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center z-10 border-4 border-background-light dark:border-background-dark",
                  idx === 0 ? "bg-primary" : "bg-slate-400"
                )}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <div className="bg-white dark:bg-slate-900/50 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm">{update.status}</h4>
                    <span className="text-[10px] text-slate-500">{new Date(update.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{update.notes}</p>
                  <p className="text-[10px] mt-1 font-semibold text-slate-400 flex items-center gap-1">
                    <MapPin className="w-2 h-2" /> {update.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Assign Operator Modal */}
      {showAssignModal && (
        <AssignOperatorModal
          shipmentId={shipment.id}
          currentOperatorId={shipment.operator_id}
          onClose={() => setShowAssignModal(false)}
          onAssign={() => fetchShipment()}
        />
      )}
    </div>
  );
}
