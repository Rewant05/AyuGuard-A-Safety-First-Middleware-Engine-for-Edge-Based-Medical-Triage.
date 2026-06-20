"use client";

import { useState, useMemo } from "react";
import {
  HeartPulse, Thermometer, Wind, Activity, Gauge,
  Brain, User, MapPin, Calendar, AlertTriangle, CheckCircle2, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── NEWS2 Scoring Parameters ─── */
/* Based on Royal College of Physicians NEWS2 chart */

function scoreRespirationRate(rr: number): number {
  if (rr <= 8) return 3;
  if (rr <= 11) return 1;
  if (rr <= 20) return 0;
  if (rr <= 24) return 2;
  return 3; // >=25
}

function scoreSpO2Scale1(spo2: number): number {
  if (spo2 <= 91) return 3;
  if (spo2 <= 93) return 2;
  if (spo2 <= 95) return 1;
  return 0; // >=96
}

function scoreSystolicBP(sbp: number): number {
  if (sbp <= 90) return 3;
  if (sbp <= 100) return 2;
  if (sbp <= 110) return 1;
  if (sbp <= 219) return 0;
  return 3; // >=220
}

function scoreHeartRate(hr: number): number {
  if (hr <= 40) return 3;
  if (hr <= 50) return 1;
  if (hr <= 90) return 0;
  if (hr <= 110) return 1;
  if (hr <= 130) return 2;
  return 3; // >=131
}

function scoreTemperature(temp: number): number {
  if (temp <= 35.0) return 3;
  if (temp <= 36.0) return 1;
  if (temp <= 38.0) return 0;
  if (temp <= 39.0) return 1;
  return 2; // >=39.1
}

function scoreConsciousness(level: string): number {
  return level === "Alert" ? 0 : 3; // CVPU = 3
}

interface VitalInput {
  label: string;
  key: string;
  icon: typeof HeartPulse;
  unit: string;
  placeholder: string;
  min: number;
  max: number;
  step: number;
  defaultValue: string;
}

const vitalInputs: VitalInput[] = [
  { label: "Heart Rate",        key: "heartRate",       icon: HeartPulse,  unit: "bpm",  placeholder: "72",  min: 20,  max: 200, step: 1,   defaultValue: "78" },
  { label: "SpO₂",              key: "spo2",            icon: Activity,    unit: "%",    placeholder: "97",  min: 70,  max: 100, step: 1,   defaultValue: "97" },
  { label: "Temperature",       key: "temperature",     icon: Thermometer, unit: "°C",   placeholder: "37.0", min: 33,  max: 42,  step: 0.1, defaultValue: "37.1" },
  { label: "Systolic BP",       key: "systolicBp",      icon: Gauge,       unit: "mmHg", placeholder: "120", min: 60,  max: 250, step: 1,   defaultValue: "126" },
  { label: "Respiratory Rate",  key: "respiratoryRate", icon: Wind,        unit: "/min", placeholder: "16",  min: 4,   max: 50,  step: 1,   defaultValue: "17" },
];

export function NEWS2IntakeForm() {
  const [patientName, setPatientName] = useState("Lakshmi Devi");
  const [patientAge, setPatientAge] = useState("58");
  const [patientVillage, setPatientVillage] = useState("Kolaram");

  const [vitals, setVitals] = useState<Record<string, string>>({
    heartRate: "78",
    spo2: "97",
    temperature: "37.1",
    systolicBp: "126",
    respiratoryRate: "17",
  });
  const [consciousness, setConsciousness] = useState("Alert");

  const updateVital = (key: string, value: string) => {
    setVitals((prev) => ({ ...prev, [key]: value }));
  };

  /* ─── Compute NEWS2 Score ─── */
  const news2 = useMemo(() => {
    const hr = parseFloat(vitals.heartRate) || 0;
    const spo2 = parseFloat(vitals.spo2) || 0;
    const temp = parseFloat(vitals.temperature) || 0;
    const sbp = parseFloat(vitals.systolicBp) || 0;
    const rr = parseFloat(vitals.respiratoryRate) || 0;

    const scores = {
      respiratoryRate: scoreRespirationRate(rr),
      spo2: scoreSpO2Scale1(spo2),
      systolicBp: scoreSystolicBP(sbp),
      heartRate: scoreHeartRate(hr),
      temperature: scoreTemperature(temp),
      consciousness: scoreConsciousness(consciousness),
    };

    const total = Object.values(scores).reduce((a, b) => a + b, 0);

    let risk: "low" | "medium" | "high";
    let label: string;
    let description: string;

    if (total >= 7) {
      risk = "high";
      label = "CRITICAL — Immediate Medical Review";
      description = "This patient requires urgent assessment by a clinical team. Escalate immediately to the nearest physician or emergency services.";
    } else if (total >= 5) {
      risk = "medium";
      label = "Monitoring Required — Escalate Triage";
      description = "Increased observation frequency needed. Alert the attending clinician for review and consider escalation within 30 minutes.";
    } else {
      risk = "low";
      label = "Stable — Routine Care";
      description = "Continue routine monitoring. Reassess vitals at standard intervals and document observations.";
    }

    return { scores, total, risk, label, description };
  }, [vitals, consciousness]);

  const riskStyles = {
    low:    { bg: "bg-emerald-50",  border: "border-emerald-200", text: "text-emerald-800", badge: "bg-emerald-500", glow: "" },
    medium: { bg: "bg-amber-50",    border: "border-amber-200",   text: "text-amber-800",   badge: "bg-amber-500",   glow: "" },
    high:   { bg: "bg-rose-50",     border: "border-rose-200",    text: "text-rose-800",     badge: "bg-rose-500",    glow: "animate-pulse-glow" },
  };

  const style = riskStyles[news2.risk];

  const scoreLabels: Record<string, string> = {
    respiratoryRate: "Respiratory Rate",
    spo2: "SpO₂ (Scale 1)",
    systolicBp: "Systolic BP",
    heartRate: "Heart Rate",
    temperature: "Temperature",
    consciousness: "Consciousness",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

        {/* ─── LEFT: Patient Intake Form ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Patient Info */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <User className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Patient Information</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Village / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={patientVillage}
                    onChange={(e) => setPatientVillage(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Vitals Entry */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Physiological Vitals</h2>
                <p className="text-sm text-slate-400">Adjust values to see real-time NEWS2 scoring</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {vitalInputs.map((input) => {
                const val = parseFloat(vitals[input.key]) || 0;
                const paramScore =
                  input.key === "heartRate" ? scoreHeartRate(val) :
                  input.key === "spo2" ? scoreSpO2Scale1(val) :
                  input.key === "temperature" ? scoreTemperature(val) :
                  input.key === "systolicBp" ? scoreSystolicBP(val) :
                  scoreRespirationRate(val);

                const scoreBg = paramScore === 0 ? "bg-emerald-100 text-emerald-700" :
                                paramScore <= 1 ? "bg-amber-100 text-amber-700" :
                                paramScore <= 2 ? "bg-orange-100 text-orange-700" :
                                "bg-rose-100 text-rose-700";

                const Icon = input.icon;

                return (
                  <motion.div
                    key={input.key}
                    whileHover={{ y: -2 }}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-emerald-200 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{input.label}</span>
                      </div>
                      <motion.span
                        key={paramScore}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold ${scoreBg}`}
                      >
                        +{paramScore}
                      </motion.span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <input
                        type="number"
                        value={vitals[input.key]}
                        onChange={(e) => updateVital(input.key, e.target.value)}
                        min={input.min}
                        max={input.max}
                        step={input.step}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xl font-black text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-sm font-bold text-slate-400 shrink-0">{input.unit}</span>
                    </div>
                  </motion.div>
                );
              })}

              {/* Consciousness dropdown */}
              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-emerald-200 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Consciousness</span>
                  </div>
                  <motion.span
                    key={news2.scores.consciousness}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      news2.scores.consciousness === 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    +{news2.scores.consciousness}
                  </motion.span>
                </div>
                <select
                  value={consciousness}
                  onChange={(e) => setConsciousness(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xl font-black text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 cursor-pointer appearance-none"
                >
                  <option value="Alert">Alert (A)</option>
                  <option value="Confusion">Confusion (C)</option>
                  <option value="Voice">Voice (V)</option>
                  <option value="Pain">Pain (P)</option>
                  <option value="Unresponsive">Unresponsive (U)</option>
                </select>
              </motion.div>
            </div>
          </section>
        </motion.div>

        {/* ─── RIGHT: NEWS2 Score Panel ─── */}
        <motion.aside
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-6"
        >
          {/* Score + Risk Badge */}
          <AnimatePresence mode="wait">
            <motion.section
              key={news2.risk}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`rounded-2xl border-2 ${style.border} ${style.bg} p-6 shadow-sm relative overflow-hidden ${style.glow}`}
            >
              {/* Gradient top bar */}
              <div className={`h-1.5 absolute top-0 inset-x-0 ${
                news2.risk === "low" ? "bg-gradient-to-r from-emerald-400 to-green-500" :
                news2.risk === "medium" ? "bg-gradient-to-r from-amber-400 to-yellow-500" :
                "bg-gradient-to-r from-rose-400 to-red-500"
              }`} />

              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">NEWS2 Clinical Score</p>

                <div className="flex items-end gap-3 mb-4">
                  <motion.p
                    key={news2.total}
                    initial={{ scale: 1.4, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`text-7xl font-black tracking-tighter ${style.text}`}
                  >
                    {news2.total}
                  </motion.p>
                  <p className="text-lg font-bold text-slate-400 mb-2">/ 20</p>
                </div>

                {/* Risk Badge */}
                <motion.div
                  layout
                  className={`inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 ${
                    news2.risk === "low" ? "bg-emerald-500 text-white" :
                    news2.risk === "medium" ? "bg-amber-500 text-white" :
                    "bg-rose-500 text-white"
                  } ${news2.risk === "high" ? "animate-pulse" : ""}`}
                >
                  {news2.risk === "low" && <CheckCircle2 className="h-5 w-5" />}
                  {news2.risk === "medium" && <Clock className="h-5 w-5" />}
                  {news2.risk === "high" && <AlertTriangle className="h-5 w-5" />}
                  <span className="text-sm font-extrabold uppercase tracking-wider">
                    {news2.label}
                  </span>
                </motion.div>

                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {news2.description}
                </p>
              </div>
            </motion.section>
          </AnimatePresence>

          {/* Score Breakdown */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">Parameter Breakdown</h3>
            <div className="space-y-2.5">
              {Object.entries(news2.scores).map(([key, score]) => {
                const bg = score === 0 ? "bg-emerald-500" :
                           score <= 1 ? "bg-amber-500" :
                           score <= 2 ? "bg-orange-500" : "bg-rose-500";
                const textColor = score === 0 ? "text-emerald-600" :
                                  score <= 1 ? "text-amber-600" :
                                  score <= 2 ? "text-orange-600" : "text-rose-600";
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">{scoreLabels[key]}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          key={score}
                          initial={{ width: 0 }}
                          animate={{ width: `${(score / 3) * 100}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={`h-full rounded-full ${bg}`}
                        />
                      </div>
                      <motion.span
                        key={score}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        className={`text-sm font-extrabold min-w-[24px] text-right ${textColor}`}
                      >
                        {score}
                      </motion.span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Total NEWS2</span>
              <span className={`text-lg font-black ${
                news2.risk === "low" ? "text-emerald-600" :
                news2.risk === "medium" ? "text-amber-600" : "text-rose-600"
              }`}>
                {news2.total}
              </span>
            </div>
          </section>

          {/* Disclaimer */}
          <div className="rounded-xl bg-slate-100 border border-slate-200 p-4">
            <p className="text-xs font-semibold leading-5 text-slate-500">
              <strong className="text-slate-700">Prototype only.</strong> NEWS2 implementation follows Royal College of Physicians parameters.
              This is a simulation for the hackathon and does not replace clinical decision-making. Always confirm with a qualified clinician.
            </p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
