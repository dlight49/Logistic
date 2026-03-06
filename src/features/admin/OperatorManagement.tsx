import React, { useState, useEffect, ReactNode } from "react";
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
import { Operator } from "../../types";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import AdminNav from "../../components/AdminNav";

export default function OperatorManagement(): ReactNode {
  const navigate = useNavigate();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newOperator, setNewOperator] = useState({ name: "", email: "", phone: "", password: "" });
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/operators");
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
      const res = await apiFetch("/api/operators", {
        method: "POST",
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
      const res = await apiFetch(`/api/operators/${editingOperator.id}`, {
        method: "PATCH",
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
      <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 flex items-center justify-between pt-safe">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Users className="text-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Drivers</h1>
              <p className="text-xs text-slate-500">Manage Drivers & Staff</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white p-2 rounded-lg shadow-lg shadow-primary/20 md:hidden"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 p-4 space-y-6 pb-32">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400">
              Fleet Command
            </h1>
            <p className="text-sm font-bold text-blue-400/80 uppercase tracking-widest">Global Operations Unit</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)} // Changed to setShowAddModal
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/40 border border-white/20 w-full sm:w-auto justify-center"
          >
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Plus className="w-5 h-5 relative" />
            <span className="relative">Recruit Operator</span>
          </button>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600 shadow-inner group-hover:bg-slate-900/80"
              placeholder="Query fleet by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5 shadow-inner w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex-1 sm:flex-none",
                filter === 'all' ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >
              All Units
            </button>
            <button
              onClick={() => setFilter('active')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex-1 sm:flex-none",
                filter === 'active' ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Ready
            </button>
            <button
              onClick={() => setFilter('offline')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex-1 sm:flex-none",
                filter === 'offline' ? "bg-rose-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Off
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOperators
              .map(op => (
                <div key={op.id} className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <Users className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/operator/${op.id}`} className="font-bold text-slate-900 dark:text-slate-100 hover:text-primary transition-colors">
                            {op.name}
                          </Link>
                          <span className={cn(
                            "text-xs font-black px-2.5 py-1 rounded-lg shadow-sm",
                            (op.assignedShipments?.length || 0) > 3
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                              : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                          )}>
                            {op.assignedShipments?.length || 0} ACTIVE LOADS
                          </span>
                        </div>
                        <Link to={`/admin/operator/${op.id}`} className="text-xs text-slate-500 hover:text-primary transition-colors">
                          ID: {op.id}
                        </Link>
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
            {filteredOperators.length === 0 && (
                <div className="min-h-screen bg-[#020817] text-slate-100 font-sans pb-32 mt-20 sm:mt-0">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No drivers found matching "{searchQuery}"</p>
                </div>
              )}
          </div>
        )}
      </main>

      {/* Add Operator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">Add New Driver</h3>
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
                  onChange={e => setNewOperator({ ...newOperator, name: e.target.value })}
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
                  onChange={e => setNewOperator({ ...newOperator, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                  placeholder="+1 (555) 000-0000"
                  value={newOperator.phone}
                  onChange={e => setNewOperator({ ...newOperator, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Initial Password</label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                  placeholder="Leave blank for default"
                  type="password"
                  value={newOperator.password}
                  onChange={e => setNewOperator({ ...newOperator, password: e.target.value })}
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
              <h3 className="text-xl font-bold">Edit Driver</h3>
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
                  onChange={e => setEditingOperator({ ...editingOperator, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                  value={editingOperator.email}
                  onChange={e => setEditingOperator({ ...editingOperator, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm"
                  value={editingOperator.phone || ""}
                  onChange={e => setEditingOperator({ ...editingOperator, phone: e.target.value })}
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
