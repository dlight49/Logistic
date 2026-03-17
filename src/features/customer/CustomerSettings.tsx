import { useState, ReactNode, useEffect } from "react";
import { 
  ArrowLeft, User, Phone, Mail, Shield, Save, CheckCircle2,
  Settings as SettingsIcon, Bell, Globe, CreditCard, Lock, LogOut,
  ChevronRight, Edit3, Camera, Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../../utils/api";
import { cn } from "../../utils";

type TabType = "account" | "preferences" | "security" | "billing";

export default function CustomerSettings(): ReactNode {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>("account");

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }
    
    const tabs = [
        { id: "account", label: "Account", icon: <User className="w-4 h-4" /> },
        { id: "preferences", label: "Preferences", icon: <SettingsIcon className="w-4 h-4" /> },
        { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
        { id: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
    ];

    return (
        <div className="bg-slate-950 text-slate-100 min-h-screen font-display pb-24">
            <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        <button onClick={() => navigate('/customer')} className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg font-bold">Settings</h1>
                        <div className="size-10"></div>
                    </div>
                    <div className="flex gap-1 bg-slate-900 p-1 rounded-xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all",
                                    activeTab === tab.id
                                        ? "bg-slate-800 text-primary shadow-sm"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                {tab.icon}
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 pt-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'account' && <AccountTab user={user} onUpdate={login} />}
                        {activeTab === 'preferences' && <PreferencesTab />}
                        {activeTab === 'security' && <SecurityTab />}
                        {activeTab === 'billing' && <BillingTab />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

interface User {
    name: string;
    phone: string;
    email: string;
    avatarUrl?: string;
}

function AccountTab({ user, onUpdate }: { user: User, onUpdate: (user: User) => void }) {
    const [name, setName] = useState(user.name || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSaved(false);

        try {
            await apiFetch('/api/users/me', {
                method: 'PUT',
                body: JSON.stringify({ name, phone })
            });
            onUpdate({ ...user, name, phone });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Failed to save settings", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col items-center text-center">
                <div className="relative group mb-2">
                    <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=0D89EC&color=fff&font-size=0.5`} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-lg" />
                    <button className="absolute -bottom-2 -right-2 bg-slate-700 hover:bg-primary border-2 border-slate-900 p-2 rounded-full shadow-md transition-all group-hover:scale-110">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <h2 className="text-xl font-bold">{name}</h2>
                <p className="text-sm text-slate-400">{user.email}</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6 glass-panel p-6 rounded-2xl border border-white/10">
                 <InputGroup icon={<User />} label="Full Name" value={name} onChange={setName} placeholder="Your full name" />
                 <InputGroup icon={<Phone />} label="Phone Number" value={phone} onChange={setPhone} placeholder="+1 (555) 000-0000" type="tel" />

                 <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <AnimatePresence>
                    {saved && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-emerald-400 text-sm font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Changes saved
                        </motion.div>
                    )}
                    </AnimatePresence>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 ml-auto"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function PreferencesTab() {
    return (
        <div className="space-y-6">
            <SettingsCard title="Localization">
                <SettingsRow icon={<Globe className="text-blue-400" />} label="Language" value="English (US)" />
                <SettingsRow icon={<Clock className="text-amber-400" />} label="Timezone" value="Central Time (CST)" />
            </SettingsCard>
            <SettingsCard title="Notification Frequency">
                <SettingsRow icon={<Bell className="text-red-400" />} label="Shipment Updates" value="Instant" />
                <SettingsRow icon={<Mail className="text-slate-400" />} label="Promotional Emails" value="Weekly" />
            </SettingsCard>
        </div>
    )
}

function SecurityTab() {
    return (
        <div className="space-y-6">
            <SettingsCard title="Password Management">
                 <div className="p-4">
                    <button className="w-full text-left flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                             <Lock className="w-5 h-5 text-red-400" />
                             <div>
                                <p className="font-semibold">Change Password</p>
                                <p className="text-xs text-slate-400">Last changed 3 months ago</p>
                             </div>
                        </div>
                         <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
            </SettingsCard>
            <SettingsCard title="Active Sessions">
                <p className="text-xs text-slate-400 px-4 pb-2">You are currently logged in on these devices.</p>
                <SessionItem browser="Chrome on Windows" location="New York, NY" isCurrent />
                <SessionItem browser="Safari on iPhone 15 Pro" location="New York, NY" />
                 <div className="p-4 border-t border-white/5">
                    <button className="text-sm font-semibold text-red-400 hover:text-red-300">Log out of all other sessions</button>
                 </div>
            </SettingsCard>
        </div>
    )
}

function BillingTab() {
    return (
        <div className="space-y-6">
            <SettingsCard title="Payment Methods">
                <PaymentMethod key="4242" type="Visa" last4="4242" expiry="08/26" isDefault />
                <PaymentMethod key="9876" type="Mastercard" last4="9876" expiry="11/27" />
                 <div className="p-4 border-t border-white/5">
                    <button className="text-sm font-semibold text-primary hover:text-primary/90">+ Add New Card</button>
                 </div>
            </SettingsCard>
            <SettingsCard title="Wallet">
                <div className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400">Current Balance</p>
                        <p className="text-2xl font-bold">$50.00</p>
                    </div>
                    <button className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-sm">Add Funds</button>
                </div>
            </SettingsCard>
        </div>
    )
}

// Reusable Components
interface InputGroupProps {
    icon: ReactNode;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
}

const InputGroup = ({ icon, label, value, onChange, placeholder, type = 'text' }: InputGroupProps) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5">{icon}</div>
            <input
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    </div>
);

const SettingsCard = ({ title, children }: { title: string, children: ReactNode }) => (
    <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider p-4 border-b border-white/5">{title}</h3>
        <div className="divide-y divide-white/5">
            {children}
        </div>
    </div>
);

const SettingsRow = ({ icon, label, value }: { icon: ReactNode, label: string, value: string }) => (
    <button className="w-full text-left flex items-center justify-between p-4 group">
        <div className="flex items-center gap-4">
            {icon}
            <span className="font-semibold">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-slate-400">{value}</span>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
        </div>
    </button>
);

interface SessionItemProps {
    browser: string;
    location: string;
    isCurrent?: boolean;
}

const SessionItem = ({ browser, location, isCurrent = false }: SessionItemProps) => (
    <div className="flex items-center gap-4 p-4">
        <div className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-lg">
            <Globe className="w-5 h-5" />
        </div>
        <div className="flex-1">
            <p className="font-semibold">{browser} {isCurrent && <span className="text-xs text-primary font-bold ml-2">(This device)</span>}</p>
            <p className="text-xs text-slate-400">{location}</p>
        </div>
        {!isCurrent && <button className="text-xs font-semibold text-slate-400 hover:text-white">Revoke</button>}
    </div>
);

interface PaymentMethodProps {
    type: string;
    last4: string;
    expiry: string;
    isDefault?: boolean;
}

const PaymentMethod = ({ type, last4, expiry, isDefault = false }: PaymentMethodProps) => (
     <div className="flex items-center gap-4 p-4">
        <div className="w-10 h-7 flex items-center justify-center bg-slate-200 rounded-md text-slate-900 font-bold text-xs">
            {type}
        </div>
        <div>
            <p className="font-semibold">{type} ending in {last4} {isDefault && <span className="text-xs text-primary font-bold ml-2">(Default)</span>}</p>
            <p className="text-xs text-slate-400">Expires {expiry}</p>
        </div>
        <button className="ml-auto text-xs font-semibold text-slate-400 hover:text-white">Remove</button>
    </div>
)