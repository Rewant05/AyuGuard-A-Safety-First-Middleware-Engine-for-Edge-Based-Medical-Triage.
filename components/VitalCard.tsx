"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { HeartBeater } from "./animated/HeartBeater";
import { SpO2Wave } from "./animated/SpO2Wave";
import { ThermometerBar } from "./animated/ThermometerBar";

interface VitalCardProps {
  label: string;
  value: number | string;
  rawValue?: number;
  unit: string;
  helper: string;
  status: "normal" | "watch" | "urgent";
  icon: LucideIcon;
}

const statusStyles = {
  normal:
    "border-white/10 bg-white/5 hover:bg-white/10 hover:border-teal-500/50 hover:shadow-[0_0_20px_rgba(45,212,191,0.2)]",
  watch:
    "border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]",
  urgent:
    "border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(225,29,72,0.3)]",
};

const labelColors = {
  normal: "text-slate-400",
  watch: "text-amber-200",
  urgent: "text-rose-200",
};

const valueColors = {
  normal: "#f8fafc",
  watch: "#fcd34d",
  urgent: "#fda4af",
};

const unitColors = {
  normal: "text-slate-500",
  watch: "text-amber-500/70",
  urgent: "text-rose-500/70",
};

const helperColors = {
  normal: "text-slate-500",
  watch: "text-amber-200/70",
  urgent: "text-rose-200/70",
};

export function VitalCard({
  label,
  value,
  rawValue,
  unit,
  helper,
  status,
  icon: Icon,
}: VitalCardProps) {
  const renderAnimatedIcon = () => {
    const val = rawValue !== undefined ? rawValue : value;

    if (label === "Heart rate" && typeof val === "number") {
      return <HeartBeater bpm={val} />;
    }

    if (label === "SpO2" && typeof val === "number") {
      return <SpO2Wave spo2={val} />;
    }

    if (label === "Temperature" && typeof val === "number") {
      return <ThermometerBar tempC={val} />;
    }

    return (
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border backdrop-blur-md ${
          status === "normal"
            ? "border-white/10 bg-white/5 text-slate-300"
            : status === "watch"
            ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
            : "border-rose-500/20 bg-rose-500/10 text-rose-400"
        }`}
      >
        <Icon className="h-6 w-6" aria-hidden />
      </div>
    );
  };

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative flex h-full min-h-[176px] flex-col justify-between overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 ${statusStyles[status]}`}
    >
      <div
        className={`absolute -inset-10 z-0 opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40 ${
          status === "normal"
            ? "bg-teal-500"
            : status === "watch"
            ? "bg-amber-500"
            : "bg-rose-500"
        }`}
      />

      <div className="absolute right-5 top-5 z-20 flex h-12 w-12 items-center justify-center">
        {renderAnimatedIcon()}
      </div>

      <div className="relative z-10 pr-16">
        <p className={`text-xs font-bold uppercase tracking-[0.1em] ${labelColors[status]}`}>
          {label}
        </p>

        <div className="mt-3 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <motion.span
            key={value}
            initial={{ scale: 1.15, filter: "brightness(1.5)" }}
            animate={{ scale: 1, filter: "brightness(1)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`font-black tracking-tighter ${
              label === "Blood pressure" ? "text-3xl sm:text-4xl" : "text-4xl"
            }`}
            style={{ color: valueColors[status] }}
          >
            {value}
          </motion.span>

          {unit && (
            <span className={`text-sm font-bold ${unitColors[status]}`}>
              {unit}
            </span>
          )}
        </div>
      </div>

      <p
        className={`relative z-10 mt-5 pr-2 text-xs font-medium leading-relaxed ${helperColors[status]}`}
      >
        {helper}
      </p>
    </motion.article>
  );
}