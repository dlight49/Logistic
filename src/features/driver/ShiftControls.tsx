import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../../utils/api";
import { PlayCircle, StopCircle, Clock } from "lucide-react";

export function ShiftControls() {
  const { user } = useAuth();
  const [shift, setShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchShift = async () => {
    try {
      if (!user?.id) return;
      const res = await apiFetch(`/api/shifts/current`);
      if (res.ok) {
        const data = await res.json();
        setShift(data.currentShift || data);
      } else {
        setShift(null);
      }
    } catch (err) {
      console.error("Error fetching shift:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShift();
  }, [user?.id]);

  const handleStartShift = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await apiFetch(`/api/shifts/start`, {
        method: "POST",
        body: JSON.stringify({ user_id: user.id }),
      });
      if (res.ok) {
        await fetchShift();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndShift = async () => {
    if (!shift) return;
    try {
      setLoading(true);
      const res = await apiFetch(`/api/shifts/end`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchShift();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4 glass-panel rounded-2xl border border-white/10 animate-pulse">
        <div className="w-6 h-6 rounded-full bg-white/20"></div>
        <div className="h-4 bg-white/20 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 glass-panel rounded-2xl border border-white/10 mt-4 mb-2">
      <div className="flex items-center gap-3">
        <Clock className={`w-5 h-5 ${shift ? "text-emerald-500" : "text-amber-500"}`} />
        <div>
          <p className="text-sm font-bold text-white">
            {shift ? "Active Shift" : "Off Duty"}
          </p>
          {shift && (
             <p className="text-xs text-slate-400">
               Started at: {new Date(shift.start_time).toLocaleTimeString()}
             </p>
          )}
        </div>
      </div>

      {shift ? (
        <button
          onClick={handleEndShift}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-red-500/20"
        >
          <StopCircle className="w-4 h-4" /> End Shift
        </button>
      ) : (
        <button
          onClick={handleStartShift}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          <PlayCircle className="w-4 h-4" /> Start Shift
        </button>
      )}
    </div>
  );
}
