"use client";

import { motion } from "framer-motion";
import { Activity, ArrowRight, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate authentication delay
    setTimeout(() => {
      // In a real app, set auth context/cookie here
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-slate-950"></div>
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px]"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-2xl border border-white/10 bg-[#020617]/60 p-8 backdrop-blur-xl shadow-2xl shadow-teal-900/20">
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.5)] mb-6"
            >
              <Activity className="h-8 w-8" strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Staff Portal</h1>
            <p className="text-slate-400 mt-2 text-sm text-center">Secure access for rural health workers and clinicians.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Worker ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input 
                  type="text" 
                  defaultValue="HW-9942-IND"
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-3 text-white placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all" 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Security Pin</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-500" />
                </div>
                <input 
                  type="password" 
                  defaultValue="••••••••"
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-3 text-white placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition-all hover:from-teal-400 hover:to-cyan-500 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  Authenticate <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <p>BioMed Bharat Prototype Auth</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
