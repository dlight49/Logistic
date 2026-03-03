import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Package, 
  Edit3, 
  Save, 
  X,
  UserPlus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Operator } from "@/src/types";
import { cn } from "@/src/utils";
import AdminNav from "@/src/components/AdminNav";

export default function OperatorManagement() {
  const navigate = useNavigate();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOperator, setNewOperator] = useState({ name: "", email: "", phone: "", password: "" });
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    setLoading(true);
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

  const handleAddOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/operators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOperator)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewOperator({ name: "", email: "", phone: "", password: "" });
        fetchOperators();
      }
    } catch (err) {
      console.error("Failed to add operator", err);
    }
  };

  const handleUpdateOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOperator) return;
    try {
      const res = await fetch(`/api/operators/${editingOperator.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingOperator)
      });
      if (res.ok) {
        setEditingOperator(null);
        fetchOperators();
      }
    } catch (err) {
      console.error("Failed to update operator", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Users className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Operators</h1>
            <p className="text-xs text-slate-500">Manage Drivers & Staff</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="Search operators..."
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" /> Add
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {operators.map(op => (
              <div key={op.id} className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      <Users className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100">{op.name}</h3>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          (op.assignedShipments?.length || 0) > 3 ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                        )}>
                          {op.assignedShipments?.length || 0} Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">ID: {op.id}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEditingOperator(op)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Mail className="w-3 h-3" /> {op.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Phone className="w-3 h-3" /> {op.phone || "No phone"}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Shipments</p>
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {op.assignedShipments?.length || 0} Active
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {op.assignedShipments?.map(s => (
                      <div key={s.id} className="flex-shrink-0 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-[10px] font-bold">{s.id}</p>
                        <p className="text-[8px] text-slate-500 uppercase">{s.status}</p>
                      </div>
                    ))}
                    {(!op.assignedShipments || op.assignedShipments.length === 0) && (
                      <p className="text-[10px] text-slate-400 italic">No shipments assigned</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Operator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">Add New Operator</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddOperator} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                  placeholder="e.g. John Doe"
                  value={newOperator.name}
                  onChange={e => setNewOperator({...newOperator, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                  placeholder="john@logistics.com"
                  value={newOperator.email}
                  onChange={e => setNewOperator({...newOperator, email: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                  placeholder="+1 (555) 000-0000"
                  value={newOperator.phone}
                  onChange={e => setNewOperator({...newOperator, phone: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Initial Password</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                  placeholder="Leave blank for default"
                  type="password"
                  value={newOperator.password}
                  onChange={e => setNewOperator({...newOperator, password: e.target.value})}
                />
              </div>
              <button className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" /> Create Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Operator Modal */}
      {editingOperator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">Edit Operator</h3>
              <button onClick={() => setEditingOperator(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateOperator} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                  value={editingOperator.name}
                  onChange={e => setEditingOperator({...editingOperator, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                  value={editingOperator.email}
                  onChange={e => setEditingOperator({...editingOperator, email: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                  value={editingOperator.phone || ""}
                  onChange={e => setEditingOperator({...editingOperator, phone: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingOperator(null)}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-[2] bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <Save className="w-5 h-5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <AdminNav />
    </div>
  );
}
