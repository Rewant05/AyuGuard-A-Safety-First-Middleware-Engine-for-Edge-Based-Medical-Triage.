"use client";

import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";

export function HeartBeater({ bpm }: { bpm: number }) {
  // Convert BPM to seconds per beat
  const duration = 60 / bpm;

  return (
    <div className="relative flex items-center justify-center h-10 w-10">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <HeartPulse className="h-6 w-6 text-rose-500" />
      </motion.div>
    </div>
  );
}
