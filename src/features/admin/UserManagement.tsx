import React, { useState, useEffect, ReactNode } from "react";
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Edit3,
  Save,
  X,
  UserPlus,
  KeyRound,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Trash2,
  Shield,
  User as UserIcon,
  Truck
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../types";
import { cn } from "../../utils";
import { apiFetch } from "../../utils/api";
import AdminNav from "../../components/AdminNav";

interface CreatedCredentials {
  email: string;
  tempPassword: string;
  role: string;
}

export default function UserManagement(): ReactNode {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", password: "", role: "customer" });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const [credentials, setCredentials] = useState<CreatedCredentials | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState<string | null>(null);
  const [resetCredentials, setResetCredentials] = useState<{ id: string; tempPassword: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    try {
      const res = await apiFetch("/api/users", {
        method: "POST",
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddModal(false);
        setNewUser({ name: "", email: "", phone: "", password: "", role: "customer" });
        setCredentials({ email: data.email, tempPassword: data.tempPassword, role: data.role });
        fetchUsers();
      } else {
        setCreateError(data.error || "Failed to create user");
      }
    } catch (err) {
      console.error("Failed to add user", err);
      setCreateError(err instanceof Error ? err.message : "Network error — please try again");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await apiFetch(`/api/users/${editingUser.id}`, {
        method: "PATCH",
        body: JSON.stringify(editingUser)
      });
      if (res.ok) {
        setEditingUser(null);
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This will remove their account and all associated data.")) return;
    try {
      const res = await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!confirm("Generate a new temporary password for this user?")) return;
    setResetLoading(userId);
    try {
      const res = await apiFetch(`/api/users/${userId}/reset-password`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setResetCredentials({ id: userId, tempPassword: data.tempPassword });
      }
    } catch (err) {
      console.error("Failed to reset password", err);
    } finally {
      setResetLoading(null);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-display relative overflow-hidden pb-32">
      {/* Aesthetic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/15 rounded-full blur-[100px] pointer-events-none" />

      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/60 backdrop-blur-2xl px-4 sm:px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-2.5 bg-primary/20 rounded-xl text-primary border border-primary/20">
            <Users className="w-5 h-5 sm:w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight uppercase">User Directory</h1>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Access Control</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 border border-white/10"
        >
          <Plus className="w-4 h-4 sm:w-5 h-5" /> <span className="hidden xs:inline">Add User</span>
        </button>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full z-10 pb-40">
        <div className="flex flex-col md:flex-row gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-slate-900/50 border border-white/10 rounded-xl sm:rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-600 shadow-inner"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl sm:rounded-2xl border border-white/5 w-full md:w-fit overflow-x-auto no-scrollbar">
            {["ALL", "CUSTOMER", "OPERATOR", "ADMIN"].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={cn(
                  "flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  roleFilter === r ? "bg-white text-slate-950 shadow-lg" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {r}s
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32 gap-4">
            <Loader2 className="w-8 h-8 sm:w-10 h-10 text-primary animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Syncing Directory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredUsers.map(user => (
              <div key={user.id} className="glass-panel group p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/5 hover:border-primary/30 transition-all flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-800 flex items-center justify-center border border-white/5 shadow-inner">
                      {user.role === 'admin' ? <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" /> : 
                       user.role === 'operator' ? <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" /> :
                       <UserIcon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-white leading-tight truncate">{user.name}</h3>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">{user.email}</p>
                      <div className={cn(
                        "inline-block mt-1.5 sm:mt-2 px-2 sm:px-2.5 py-0.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest border",
                        user.role === 'admin' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        user.role === 'operator' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        "bg-primary/10 text-primary border-primary/20"
                      )}>
                        {user.role === 'operator' ? 'Driver' : user.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingUser(user)} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg sm:rounded-xl text-slate-400 hover:text-white transition-colors"><Edit3 className="w-3.5 h-3.5 sm:w-4 h-4" /></button>
                    <button onClick={() => handleResetPassword(user.id)} className="p-1.5 sm:p-2 hover:bg-amber-500/10 rounded-lg sm:rounded-xl text-slate-400 hover:text-amber-500 transition-colors"><KeyRound className="w-3.5 h-3.5 sm:w-4 h-4" /></button>
                    <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 sm:p-2 hover:bg-rose-500/10 rounded-lg sm:rounded-xl text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-3.5 h-3.5 sm:w-4 h-4" /></button>
                  </div>
                </div>

                {resetCredentials?.id === user.id && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl sm:rounded-2xl p-3 mt-1 sm:mt-2 animate-in slide-in-from-top-2">
                    <p className="text-[9px] sm:text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">New Temp Password</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-black/40 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono text-white">{resetCredentials.tempPassword}</code>
                      <button onClick={() => copyToClipboard(resetCredentials.tempPassword, user.id)} className="p-1.5 sm:p-2 bg-amber-500 text-white rounded-lg sm:rounded-xl">
                        {copiedField === user.id ? <Check className="w-3.5 h-3.5 sm:w-4 h-4" /> : <Copy className="w-3.5 h-3.5 sm:w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-3 sm:pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium text-slate-400 truncate">
                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {user.phone || 'No phone'}
                  </div>
                  <div className="text-right text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase">
                    ID: {user.id.slice(0, 8)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals: Same structure as OperatorManagement but generic */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-slate-900 w-full sm:max-w-md h-full sm:h-auto sm:rounded-[2.5rem] shadow-2xl border-x sm:border border-white/10 overflow-y-auto sm:overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
              <h3 className="text-xl sm:text-2xl font-black text-white italic">RECRUIT USER</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"><X className="w-5 h-5 sm:w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 sm:p-8 space-y-5">
              {createError && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl sm:rounded-2xl text-xs font-bold flex items-center gap-3"><AlertTriangle className="w-4 h-4" /> {createError}</div>}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["customer", "operator"].map(r => (
                      <button 
                        key={r} 
                        type="button"
                        onClick={() => setNewUser({...newUser, role: r})}
                        className={cn(
                          "py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-widest border transition-all",
                          newUser.role === r ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-slate-500"
                        )}
                      >
                        {r === 'operator' ? 'Driver' : r}
                      </button>
                    ))}
                  </div>
                </div>
                <Input label="Full Name" placeholder="Jane Doe" value={newUser.name} onChange={v => setNewUser({...newUser, name: v})} required />
                <Input label="Email Address" type="email" placeholder="jane@example.com" value={newUser.email} onChange={v => setNewUser({...newUser, email: v})} required />
                <Input label="Phone Number" placeholder="+1..." value={newUser.phone} onChange={v => setNewUser({...newUser, phone: v})} />
                <Input label="Password" type="password" placeholder="Min 6 chars" value={newUser.password} onChange={v => setNewUser({...newUser, password: v})} />
              </div>
              <button disabled={createLoading} className="w-full bg-white text-slate-950 py-3.5 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3 mt-4">
                {createLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-5 h-5" /> Initialize Account</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {credentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl">
          <div className="bg-slate-900 w-full sm:max-w-md h-full sm:h-auto sm:rounded-[3rem] shadow-2xl border-x sm:border border-emerald-500/30 overflow-y-auto sm:overflow-hidden">
            <div className="p-8 bg-emerald-500/5 border-b border-white/5 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                <Check className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white italic">SECURE CREDENTIALS</h3>
              <p className="text-[10px] sm:text-xs text-emerald-500/70 font-bold uppercase tracking-widest mt-1">Ready for deployment</p>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Access</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/40 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-mono text-white border border-white/5 truncate">{credentials.email}</code>
                    <button onClick={() => copyToClipboard(credentials.email, 'c-email')} className="p-2.5 sm:p-3 bg-white/5 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-colors">
                      {copiedField === 'c-email' ? <Check className="w-4 h-4 sm:w-5 h-5 text-emerald-500" /> : <Copy className="w-4 h-4 sm:w-5 h-5 text-slate-400" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Temporary Password</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-emerald-500/10 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-mono text-emerald-400 border border-emerald-500/20 font-bold">{credentials.tempPassword}</code>
                    <button onClick={() => copyToClipboard(credentials.tempPassword, 'c-pass')} className="p-2.5 sm:p-3 bg-emerald-500/10 rounded-xl sm:rounded-2xl hover:bg-emerald-500/20 transition-colors">
                      {copiedField === 'c-pass' ? <Check className="w-4 h-4 sm:w-5 h-5 text-emerald-500" /> : <Copy className="w-4 h-4 sm:w-5 h-5 text-emerald-500" />}
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={() => setCredentials(null)} className="w-full bg-white text-slate-950 py-3.5 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black uppercase tracking-widest">Confirm Storage</button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-slate-900 w-full sm:max-w-md h-full sm:h-auto sm:rounded-[2.5rem] shadow-2xl border-x sm:border border-white/10 overflow-y-auto sm:overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
              <h3 className="text-xl sm:text-2xl font-black text-white italic">EDIT PROFILE</h3>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"><X className="w-5 h-5 sm:w-6 h-6" /></button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 sm:p-8 space-y-5">
              <Input label="Full Name" value={editingUser.name} onChange={v => setEditingUser({...editingUser, name: v})} required />
              <Input label="Email Address" type="email" value={editingUser.email} onChange={v => setEditingUser({...editingUser, email: v})} required />
              <Input label="Phone Number" value={editingUser.phone || ""} onChange={v => setEditingUser({...editingUser, phone: v})} />
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="w-full sm:flex-1 px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-slate-400 hover:text-white bg-white/5 transition-all">Cancel</button>
                <button className="w-full sm:flex-[2] bg-primary text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all">
                  <Save className="w-5 h-5" /> Apply Changes
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

function Input({ label, onChange, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <input 
        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-700" 
        onChange={e => onChange(e.target.value)} 
        {...props} 
      />
    </div>
  );
}
