import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  Package,
  Clock,
  MapPin,
  AlertCircle
} from "lucide-react";
import { Operator } from "../../types";
import { apiFetch } from "../../utils/api";
import AdminNav from "../../components/AdminNav";

export default function OperatorProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOperator();
  }, [id]);

  const fetchOperator = async () => {
    try {
      const res = await apiFetch("/api/operators");
      const data = await res.json();
      const found = data.find((op: Operator) => op.id === id);
      setOperator(found || null);
    } catch (err) {
      console.error("Failed to fetch operator", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (!operator) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4 text-center">
      <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
      <h2 className="text-xl font-bold">Operator Not Found</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-primary font-bold">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark pb-20">
      <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold leading-tight">{operator.name}</h1>
          <p className="text-xs text-slate-500">Operator Profile</p>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-4 border-white dark:border-slate-800 shadow-xl">
            <Users className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">{operator.name}</h2>
          <p className="text-sm text-slate-500 mb-4">ID: {operator.id}</p>

          <div className="flex gap-4 w-full pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex-1 text-center">
              <p className="text-xl font-bold text-primary">{operator.assignedShipments?.length || 0}</p>
              <p className="text-[10px] font-bold uppercase text-slate-400">Active Loads</p>
            </div>
            <div className="w-px bg-slate-100 dark:bg-slate-800" />
            <div className="flex-1 text-center">
              <p className="text-xl font-bold text-emerald-500">98%</p>
              <p className="text-[10px] font-bold uppercase text-slate-400">On-Time Rate</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Email</p>
                <p className="text-sm font-medium">{operator.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                <Phone className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Phone</p>
                <p className="text-sm font-medium">{operator.phone || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Shipments */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Active Shipments</h3>
          <div className="space-y-3">
            {operator.assignedShipments?.map(s => (
              <div key={s.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{s.id}</p>
                    <p className="text-[10px] text-slate-500">{s.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Last Update</p>
                  <p className="text-[10px] font-medium">Today, 2:30 PM</p>
                </div>
              </div>
            ))}
            {(!operator.assignedShipments || operator.assignedShipments.length === 0) && (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <p className="text-sm text-slate-400 italic">No active shipments assigned</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <AdminNav />
    </div>
  );
}
