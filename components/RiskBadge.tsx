"use client";

import type { RiskLevel } from "@/lib/types";
import { motion } from "framer-motion";

const styles: Record<RiskLevel, string> = {
  Low: "border-teal-500/50 bg-teal-500/10 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]",
  Moderate: "border-amber-500/50 bg-amber-500/10 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
  High: "border-orange-500/50 bg-orange-500/10 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.3)]",
  Critical: "border-rose-500/50 bg-rose-500/10 text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.4)]"
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <motion.span 
      key={level}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs tracking-wider uppercase font-black backdrop-blur-sm ${styles[level]}`}
    >
      {level} risk
    </motion.span>
  );
}
