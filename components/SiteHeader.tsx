"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ChevronDown,
  ClipboardList,
  Cpu,
  FileText,
  HeartPulse,
  Menu,
  Scan,
  ShieldCheck,
  TrendingUp,
  UserCircle,
  X,
} from "lucide-react";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

/* ─── Navigation structure: primary links + grouped "More" dropdown ─── */
const primaryLinks = [
  { href: "/dashboard", label: "Dashboard", icon: HeartPulse },
  { href: "/trends", label: "Trends", icon: TrendingUp },
  { href: "/ai-scanner", label: "AI Scanner", icon: Scan },
  { href: "/safety-router", label: "Safety", icon: ShieldCheck },
];

const moreLinks = [
  { href: "/hardware", label: "Hardware BoM", icon: Cpu, description: "Edge device architecture & cost" },
  { href: "/evaluation", label: "Evaluation", icon: ClipboardList, description: "AI safety metrics & accuracy" },
  { href: "/documentation", label: "Documentation", icon: FileText, description: "Project proposal & references" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close "More" dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  const isMoreActive = moreLinks.some((l) => pathname === l.href);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#020617]/80 backdrop-blur-2xl">
      {/* Top gradient accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* ─── Logo ─── */}
        <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-lg group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 text-slate-950 shadow-lg shadow-teal-500/25 group-hover:shadow-teal-500/40 transition-shadow">
            <Activity className="h-[18px] w-[18px]" aria-hidden strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[15px] font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 group-hover:from-teal-200 group-hover:to-cyan-200 transition-all">
              AyuGuard Edge
            </div>
            <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 group-hover:text-teal-500/80 transition-colors">
              Rural PHC triage
            </div>
          </div>
        </Link>

        {/* ─── Desktop Navigation ─── */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-1">
          {primaryLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`focus-ring relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 ${
                  active
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08]"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <Icon className={`relative z-10 h-3.5 w-3.5 ${active ? "text-teal-400" : ""}`} aria-hidden />
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}

          {/* ─── "More" dropdown ─── */}
          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              className={`focus-ring relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition-all duration-200 ${
                isMoreActive
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isMoreActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08]"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">More</span>
              <ChevronDown
                className={`relative z-10 h-3 w-3 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-xl border border-white/[0.08] bg-[#0c1425]/95 backdrop-blur-2xl p-1.5 shadow-2xl shadow-black/40"
                >
                  {moreLinks.map(({ href, label, icon: Icon, description }) => {
                    const active = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                          active
                            ? "bg-teal-500/10 text-white"
                            : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                        }`}
                      >
                        <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                          active ? "bg-teal-500/20 text-teal-400" : "bg-white/[0.06] text-slate-500"
                        }`}>
                          <Icon className="h-3.5 w-3.5" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold leading-tight">{label}</p>
                          <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{description}</p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* ─── Desktop right-side actions ─── */}
        <div className="hidden lg:flex items-center gap-3">
          <OfflineIndicator />
          <div className="h-5 w-px bg-white/[0.08]" />
          <Link
            href="/login"
            className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/[0.05] border border-white/[0.06] hover:bg-teal-500/15 hover:border-teal-500/20 transition-all text-slate-400 hover:text-teal-300"
          >
            <UserCircle className="h-4 w-4" />
          </Link>
        </div>

        {/* ─── Mobile hamburger ─── */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg bg-white/[0.05] border border-white/[0.06] text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* ─── Mobile menu ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-white/[0.06]"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 space-y-0.5">
              {/* Primary + More combined in mobile */}
              {[...primaryLinks, ...moreLinks].map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-white/[0.08] text-white"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-teal-400" : ""}`} aria-hidden />
                    {label}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="my-2 h-px bg-white/[0.06]" />

              {/* Mobile utilities */}
              <div className="flex items-center justify-between px-3 py-2">
                <OfflineIndicator />
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-lg bg-white/[0.05] border border-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-teal-300 transition-colors"
                >
                  <UserCircle className="h-3.5 w-3.5" />
                  Login
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
