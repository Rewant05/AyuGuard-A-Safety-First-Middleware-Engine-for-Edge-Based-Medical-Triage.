"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ClipboardPlus, HeartPulse } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DashboardHeaderActions } from "@/components/DashboardHeaderActions";
import { LiveDashboard } from "@/components/LiveDashboard";
import { NEWS2IntakeForm } from "@/components/NEWS2IntakeForm";

const tabs = [
  { id: "live", label: "Live Monitor", icon: Activity, description: "Real-time simulated PHC patient vitals with offline risk engine." },
  { id: "intake", label: "Patient Intake", icon: ClipboardPlus, description: "NEWS2-based clinical scoring form for frontline health workers." },
] as const;

type TabId = typeof tabs[number]["id"];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("live");

  return (
    <div className={`min-h-screen transition-colors duration-500 ${activeTab === "intake" ? "bg-slate-50" : "bg-slate-950"}`}>
      <AnimatePresence mode="wait">
        {activeTab === "live" ? (
          <motion.div key="header-live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PageHeader
              eyebrow="Live triage dashboard"
              title="Simulated PHC patient monitor"
              description="Vitals update locally every few seconds, the offline risk engine reassesses deterioration risk, and generated summaries stay human-in-the-loop."
              actions={<DashboardHeaderActions />}
            />
          </motion.div>
        ) : (
          <motion.div key="header-intake" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PageHeader
              light
              eyebrow="Frontline workers"
              title="Patient Intake — NEWS2 Scoring"
              description="Enter physiological vitals to calculate the National Early Warning Score 2 in real-time. Designed for high-contrast, low-literacy clinical environments."
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Floating Tab Switcher */}
      <div className="relative -mt-6 mb-8 flex justify-center z-10">
        <div className={`p-1.5 flex gap-1.5 rounded-full shadow-lg backdrop-blur-md transition-colors duration-500 border ${
          activeTab === "intake" ? "bg-white/80 border-slate-200" : "bg-slate-900/80 border-white/10"
        }`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${
                  isActive
                    ? activeTab === "intake" ? "text-white" : "text-slate-900"
                    : activeTab === "intake" ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className={`absolute inset-0 rounded-full shadow-sm ${
                      activeTab === "intake" ? "bg-emerald-600" : "bg-teal-400"
                    }`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <AnimatePresence mode="wait">
          {activeTab === "live" ? (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <LiveDashboard />
            </motion.div>
          ) : (
            <motion.div
              key="intake"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <NEWS2IntakeForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}