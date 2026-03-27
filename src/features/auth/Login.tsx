import React, { useState } from "react";
import { Truck, HelpCircle, User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { apiFetch } from "../../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Update local context
      login(data.user, data.token);

      // Navigate based on role
      const userRole = data.user.role;
      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'operator') navigate('/driver');
      else navigate('/customer');
    } catch (err: any) {
      console.error("[LOGIN ERROR]", err);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <header className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Truck className="text-accent w-6 h-6" />
          </div>
          <span className="font-bold text-lg tracking-tight">LogisticsPro</span>
        </div>
        <HelpCircle className="text-slate-500 w-6 h-6" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 dark:bg-primary/30 rounded-full mb-6 ring-4 ring-primary/5">
              <User className="text-accent w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">Please sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">Email Address</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-primary/30 bg-white dark:bg-primary/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 dark:border-primary/30 bg-white dark:bg-primary/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input className="rounded border-slate-300 dark:border-primary/50 text-accent focus:ring-accent bg-transparent" type="checkbox" />
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Remember me</span>
              </label>
              <a className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors" href="#">Forgot Password?</a>
            </div>

            <button
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-accent/20 transition-all transform active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="submit"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : "Login to Dashboard"}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              New customer? <button onClick={() => navigate('/register')} className="text-primary dark:text-slate-200 font-bold hover:underline">Create an Account</button>
            </p>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center">
        <p className="text-slate-400 dark:text-slate-600 text-xs">
          © 2024 LogisticsPro Solutions Inc. All rights reserved. <br />
          System Version 4.2.0-stable (JWT Native)
        </p>
      </footer>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 dark:bg-accent/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
