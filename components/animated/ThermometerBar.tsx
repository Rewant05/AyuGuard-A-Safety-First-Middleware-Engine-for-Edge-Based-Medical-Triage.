"use client";

import { motion } from "framer-motion";
import { Thermometer } from "lucide-react";

export function ThermometerBar({ tempC }: { tempC: number }) {
  // Map typical body temp 35-41C to a 0-100% scale for the animation
  const clamped = Math.max(35, Math.min(tempC, 41));
  const percentage = ((clamped - 35) / (41 - 35)) * 100;
  
  const isHigh = tempC >= 38;

  return (
    <div className="relative flex items-center justify-center h-10 w-10">
      <Thermometer className={`h-6 w-6 z-10 ${isHigh ? 'text-orange-500' : 'text-teal-600'}`} />
      
      {/* Visual mercury background */}
      <div className="absolute w-2 h-4 bottom-2 rounded-sm overflow-hidden bg-slate-200">
        <motion.div 
          className={`absolute bottom-0 w-full ${isHigh ? 'bg-orange-400' : 'bg-teal-400'}`}
          initial={{ height: 0 }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
