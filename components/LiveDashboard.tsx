"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ClipboardPlus,
  Droplet,
  HeartPulse,
  Send,
  Thermometer,
  Wind,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatBp, formatDateTime } from "@/lib/format";
import { assessRisk, buildReasonSentence } from "@/lib/riskEngine";
import { nextSimulatedReading } from "@/lib/simulator";
import type { VitalsReading } from "@/lib/types";
import { PatientCard } from "@/components/PatientCard";
import { RiskBadge } from "@/components/RiskBadge";
import { VitalCard } from "@/components/VitalCard";

function vitalStatus(label: string, latest: VitalsReading): "normal" | "watch" | "urgent" {
  if (label === "SpO2") {
    if (latest.spo2 < 90) return "urgent";
    if (latest.spo2 < 94) return "watch";
  }

  if (label === "Heart rate") {
    if (latest.heartRate >= 130 || latest.heartRate <= 45) return "urgent";
    if (latest.heartRate >= 110 || latest.heartRate <= 55) return "watch";
  }

  if (label === "Temperature") {
    if (latest.temperatureC >= 40 || latest.temperatureC <= 35) return "urgent";
    if (latest.temperatureC >= 38) return "watch";
  }

  if (label === "Respiratory rate") {
    if (latest.respiratoryRate >= 30 || latest.respiratoryRate <= 8) return "urgent";
    if (latest.respiratoryRate >= 24 || latest.respiratoryRate <= 10) return "watch";
  }

  if (label === "Blood pressure") {
    if (
      latest.systolicBp < 90 ||
      latest.diastolicBp < 60 ||
      latest.systolicBp >= 180 ||
      latest.diastolicBp >= 120
    ) {
      return "urgent";
    }

    if (latest.systolicBp >= 160 || latest.diastolicBp >= 100) return "watch";
  }

  if (label === "Glucose" && latest.glucoseMgDl !== undefined && latest.glucoseMgDl !== null) {
    if (latest.glucoseMgDl < 54 || latest.glucoseMgDl > 300) return "urgent";
    if (latest.glucoseMgDl < 70 || latest.glucoseMgDl > 180) return "watch";
  }

  return "normal";
}

function getRiskTone(level: string) {
  if (level === "Critical") {
    return {
      glow: "bg-rose-500",
      softBg: "bg-rose-500/10",
      border: "border-rose-500/30",
      text: "text-rose-200",
      bar: "bg-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.7)]",
      button: "bg-rose-600/90 hover:bg-rose-500 border-rose-400/40 shadow-[0_0_24px_rgba(225,29,72,0.35)]",
    };
  }

  if (level === "High") {
    return {
      glow: "bg-orange-500",
      softBg: "bg-orange-500/10",
      border: "border-orange-500/30",
      text: "text-orange-200",
      bar: "bg-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.7)]",
      button: "bg-orange-600/90 hover:bg-orange-500 border-orange-400/40 shadow-[0_0_24px_rgba(249,115,22,0.3)]",
    };
  }

  if (level === "Moderate") {
    return {
      glow: "bg-amber-500",
      softBg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-200",
      bar: "bg-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.7)]",
      button: "bg-amber-600/90 hover:bg-amber-500 border-amber-400/40 shadow-[0_0_24px_rgba(245,158,11,0.3)]",
    };
  }

  return {
    glow: "bg-teal-500",
    softBg: "bg-teal-500/10",
    border: "border-teal-500/30",
    text: "text-teal-200",
    bar: "bg-teal-400 shadow-[0_0_18px_rgba(45,212,191,0.7)]",
    button: "bg-teal-600/90 hover:bg-teal-500 border-teal-400/40 shadow-[0_0_24px_rgba(45,212,191,0.3)]",
  };
}

export function LiveDashboard() {
  const [patient, setPatient] = useState<any>(null);
  const [readings, setReadings] = useState<VitalsReading[]>([]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [escalationQueuedAt, setEscalationQueuedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/patients");

        if (res.ok) {
          const patients = await res.json();

          if (patients && patients.length > 0) {
            const selected = patients[0];

            setPatient({
              id: selected.id,
              name: selected.name,
              age: selected.age,
              sex: selected.gender,
              village: selected.village,
              clinicId: "PHC Kolaram - Bed 02",
              healthWorker: "ANM Kavitha",
              notes: "Simulated longitudinal record connected to real SQLite backend.",
            });

            setReadings(
              selected.readings.map((r: any) => ({
                ...r,
                source: "simulated_sensor",
              }))
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch patients", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!patient || readings.length === 0) return;

    const interval = window.setInterval(async () => {
      const next = nextSimulatedReading(readings);

      setReadings((current) => [...current, next].slice(-36));

      try {
        await fetch("/api/vitals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: patient.id,
            spo2: next.spo2,
            heartRate: next.heartRate,
            temperatureC: next.temperatureC,
            respiratoryRate: next.respiratoryRate,
            systolicBp: next.systolicBp,
            diastolicBp: next.diastolicBp,
            glucoseMgDl: next.glucoseMgDl,
          }),
        });
      } catch (error) {
        console.error("Failed to sync new reading", error);
      }
    }, 4500);

    return () => window.clearInterval(interval);
  }, [patient, readings]);

  const assessment = useMemo(() => {
    if (!readings || readings.length === 0) return null;
    return assessRisk(readings);
  }, [readings]);

  if (loading || !patient || readings.length === 0 || !assessment) {
    return (
      <div className="relative flex h-[70vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.14),transparent_38%)]" />

        <div className="relative rounded-3xl border border-white/10 bg-slate-950/70 px-10 py-9 text-center shadow-2xl backdrop-blur-xl">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.15, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10"
          >
            <Activity className="h-8 w-8 text-teal-300 drop-shadow-[0_0_16px_rgba(45,212,191,0.9)]" />
          </motion.div>

          <h2 className="mt-5 text-lg font-extrabold text-white">Loading live clinical dashboard</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
            Pulling patient profile, longitudinal vitals, and offline risk intelligence.
          </p>
        </div>
      </div>
    );
  }

  const latest = readings[readings.length - 1];
  const reasonSentence = buildReasonSentence(assessment);
  const tone = getRiskTone(assessment.level);

  const vitalCards = [
    {
      label: "SpO2",
      value: latest.spo2,
      unit: "%",
      helper: "Pulse oximeter stream",
      icon: Activity,
    },
    {
      label: "Heart rate",
      value: latest.heartRate,
      unit: "bpm",
      helper: "Derived from pulse waveform",
      icon: HeartPulse,
    },
    {
      label: "Temperature",
      value: latest.temperatureC.toFixed(1),
      rawValue: latest.temperatureC,
      unit: "°C",
      helper: "Digital temperature sensor",
      icon: Thermometer,
    },
    {
      label: "Respiratory rate",
      value: latest.respiratoryRate,
      unit: "/min",
      helper: "Manual or sensor-assisted input",
      icon: Wind,
    },
    {
      label: "Blood pressure",
      value: formatBp(latest),
      unit: "mmHg",
      helper: "BP monitor integration",
      icon: Droplet,
    },
    {
      label: "Glucose",
      value: latest.glucoseMgDl ?? "NA",
      unit: latest.glucoseMgDl ? "mg/dL" : "",
      helper: "Optional manual entry",
      icon: ClipboardPlus,
    },
  ];

  const summary = [
    `Patient: ${patient.name}, ${patient.age} years, ${patient.village}`,
    `Latest reading: ${formatDateTime(latest.timestamp)}`,
    `Vitals: SpO2 ${latest.spo2}%, HR ${latest.heartRate} bpm, Temp ${latest.temperatureC.toFixed(
      1
    )} °C, RR ${latest.respiratoryRate}/min, BP ${formatBp(latest)} mmHg, Glucose ${
      latest.glucoseMgDl ?? "not entered"
    } mg/dL`,
    `Risk: ${assessment.level} (${assessment.score}/15)`,
    `Recommendation: ${assessment.recommendation}`,
    `Reason: ${reasonSentence}`,
    assessment.clinicalSafetyNote,
  ].join("\n");

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute right-0 top-52 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur-xl"
      >
        <div className="relative p-6 sm:p-7 lg:p-8">
          <div className={`absolute -right-20 -top-24 h-72 w-72 rounded-full ${tone.glow} opacity-20 blur-3xl`} />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-teal-200">
                <span className="h-2 w-2 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.9)]" />
                Live Offline Edge Monitoring
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                AyuGuard Edge Clinical Command
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Continuous vitals, longitudinal deterioration scoring, and health-worker handoff support
                for low-connectivity clinical environments.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[420px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Readings</p>
                <p className="mt-2 text-2xl font-black text-white">{readings.length}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Score</p>
                <p className="mt-2 text-2xl font-black text-white">{assessment.score}/15</p>
              </div>

              <div className={`rounded-2xl border ${tone.border} ${tone.softBg} p-4`}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Status</p>
                <p className={`mt-2 text-2xl font-black ${tone.text}`}>{assessment.level}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
        <main className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <PatientCard patient={patient} latest={latest} />
          </motion.div>

          <motion.section
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            aria-label="Live simulated vitals"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {vitalCards.map((card) => (
              <motion.div
                key={card.label}
                variants={{
                  hidden: { opacity: 0, y: 24, scale: 0.96 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", bounce: 0.32, duration: 0.65 },
                  },
                }}
                className="transition duration-300 hover:-translate-y-1"
              >
                <VitalCard {...card} status={vitalStatus(card.label, latest)} />
              </motion.div>
            ))}
          </motion.section>

          <AnimatePresence>
            {summaryOpen && (
              <motion.section
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.2 } }}
                className="glass-panel overflow-hidden rounded-[1.7rem] border border-white/10 p-0"
              >
                <div className="border-b border-white/10 bg-white/[0.03] px-6 py-5">
                  <h2 className="text-lg font-black uppercase tracking-[0.12em] text-white">
                    Health Worker Summary
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    AI-generated plain-language handoff note ready for transfer.
                  </p>
                </div>

                <pre className="overflow-x-auto whitespace-pre-wrap bg-slate-950/70 p-6 text-sm leading-relaxed text-slate-300">
                  {summary}
                </pre>
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <section className="glass-panel relative overflow-hidden rounded-[1.7rem] border border-white/10 p-6 shadow-2xl">
            <div className={`absolute -right-16 -top-16 h-56 w-56 rounded-full ${tone.glow} opacity-25 blur-3xl`} />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Offline AI Engine
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Risk Profile</h2>
              </div>

              <RiskBadge level={assessment.level} />
            </div>

            <div className="relative z-10 mt-7 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-md">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

              <div className="relative flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-400">Composite Score</p>

                  <motion.p
                    key={assessment.score}
                    initial={{ scale: 1.24, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-2 text-6xl font-black tracking-tight text-white"
                  >
                    {assessment.score}
                  </motion.p>
                </div>

                <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-slate-500">
                  / 15
                </p>
              </div>

              <div className="relative mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className={`absolute bottom-0 left-0 top-0 rounded-full ${tone.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((assessment.score / 15) * 100, 100)}%` }}
                  transition={{ type: "spring", stiffness: 45, damping: 14 }}
                />
              </div>
            </div>

            <div className={`relative z-10 mt-5 rounded-2xl border ${tone.border} ${tone.softBg} p-5`}>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Triage Recommendation
              </p>

              <p className="mt-3 text-xl font-black leading-snug text-white">
                {assessment.recommendation}
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-300">{reasonSentence}</p>
            </div>

            <div className="relative z-10 mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => setSummaryOpen((open) => !open)}
                className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/15"
              >
                <ClipboardPlus className="h-4 w-4" aria-hidden />
                {summaryOpen ? "Hide Handoff Summary" : "Generate Handoff Summary"}
              </button>

              <button
                type="button"
                onClick={() => setEscalationQueuedAt(new Date().toISOString())}
                className={`focus-ring inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-sm font-black text-white backdrop-blur-md transition ${tone.button}`}
              >
                <Send className="h-4 w-4" aria-hidden />
                Escalate Case to Cloud
              </button>
            </div>

            <AnimatePresence>
              {escalationQueuedAt && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 22 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="relative z-10 flex gap-3 overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100 backdrop-blur-md"
                >
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
                  <p>
                    Queued in offline outbox at{" "}
                    <span className="font-black text-white">{formatDateTime(escalationQueuedAt)}</span>.
                    Will sync when satellite network connects.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section className="glass-panel rounded-[1.7rem] border border-white/10 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.22em] text-slate-400">
                  Clinical Reasoning
                </h3>
                <p className="mt-2 text-sm text-slate-500">Signals used by the edge risk engine.</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10">
                <Activity className="h-5 w-5 text-teal-300" />
              </div>
            </div>

            <ul className="mt-6 space-y-4">
              {assessment.reasons.concat(assessment.trendFlags).map((item) => (
                <li key={item} className="flex gap-4 text-sm leading-6 text-slate-300">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.85)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs font-semibold italic leading-6 text-slate-400">
              {assessment.clinicalSafetyNote}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}