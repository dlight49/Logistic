import React, { useState, useEffect } from "react";
import { X, Search, User, CheckCircle2, Loader2 } from "lucide-react";
import { Operator } from "@/src/types";
import { cn } from "@/src/utils";

interface AssignOperatorModalProps {
  shipmentId: string;
  currentOperatorId?: string;
  onClose: () => void;
  onAssign: (operatorId: string) => void;
}

export default function AssignOperatorModal({ 
  shipmentId, 
  currentOperatorId, 
  onClose, 
  onAssign 
}: AssignOperatorModalProps) {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      const res = await fetch("/api/operators");
      const data = await res.json();
      setOperators(data);
    } catch (err) {
      console.error("Failed to fetch operators", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (operatorId: string) => {
    setAssigningId(operatorId);
    try {
      const res = await fetch(`/api/shipments/${shipmentId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operator_id: operatorId })
      });
      if (res.ok) {
        onAssign(operatorId);
        onClose();
      }
    } catch (err) {
      console.error("Failed to assign operator", err);
    } finally {
      setAssigningId(null);
    }
  };

  const filteredOperators = operators.filter(op => 
    op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl font-bold">Assign Operator</h3>
            <p className="text-xs text-slate-500 mt-1">Shipment ID: {shipmentId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3 opacity-50">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm">Loading operators...</p>
            </div>
          ) : filteredOperators.length > 0 ? (
            filteredOperators.map(op => (
              <button 
                key={op.id}
                onClick={() => handleAssign(op.id)}
                disabled={assigningId !== null}
                className={cn(
                  "w-full p-4 rounded-xl border flex items-center justify-between transition-all text-left group",
                  currentOperatorId === op.id 
                    ? "border-primary bg-primary/5" 
                    : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    currentOperatorId === op.id ? "bg-primary/20" : "bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700"
                  )}>
                    <User className={cn("w-5 h-5", currentOperatorId === op.id ? "text-primary" : "text-slate-400")} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{op.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-500">{op.id}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-bold text-primary">
                        {op.assignedShipments?.length || 0} Active Loads
                      </span>
                    </div>
                  </div>
                </div>
                {assigningId === op.id ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                ) : currentOperatorId === op.id ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : null}
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
              <Search className="w-12 h-12 mb-2" />
              <p className="text-sm font-bold">No operators found</p>
              <p className="text-xs">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
