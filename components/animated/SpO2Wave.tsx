"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export function SpO2Wave({ spo2 }: { spo2: number }) {
  // If SpO2 is very low, make it pulse faster and turn red
  const isLow = spo2 < 90;

  return (
    <div className="relative flex items-center justify-center h-10 w-10">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: isLow ? 0.8 : 2, repeat: Infinity }}
        className={`absolute inset-0 rounded-full ${isLow ? 'bg-rose-100' : 'bg-blue-100'}`}
      />
      <Activity className={`relative z-10 h-6 w-6 ${isLow ? 'text-rose-500' : 'text-blue-500'}`} />
    </div>
  );
}
