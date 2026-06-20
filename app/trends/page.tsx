"use client";

import { AlertTriangle, CheckCircle2, TableProperties, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { RiskBadge } from "@/components/RiskBadge";
import { TrendChart } from "@/components/TrendChart";
import { samplePatients } from "@/data/samplePatients";
import { formatBp, formatDateTime } from "@/lib/format";
import { assessRisk } from "@/lib/riskEngine";
import { motion } from "framer-motion";

export default function TrendsPage() {
  const patient = samplePatients[0];
  const readings = patient.history;
  const assessment = assessRisk(readings);

  const charts = [
    { title: "SpO2", unit: "%", color: "#2dd4bf", getValue: (reading: (typeof readings)[number]) => reading.spo2 }, // teal-400
    { title: "Heart rate", unit: "bpm", color: "#60a5fa", getValue: (reading: (typeof readings)[number]) => reading.heartRate }, // blue-400
    { title: "Temperature", unit: "deg C", color: "#fb923c", getValue: (reading: (typeof readings)[number]) => reading.temperatureC }, // orange-400
    { title: "Respiratory rate", unit: "/min", color: "#fb7185", getValue: (reading: (typeof readings)[number]) => reading.respiratoryRate } // rose-400
  ];

  return (
    <>
      <PageHeader
        eyebrow="Longitudinal trends"
        title="Trend-based risk detection"
        description="AyuGuard compares recent readings against the patient's local baseline, so deterioration is flagged when values drift over time, not only when a single threshold is crossed."
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <article className="glass-panel rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-teal-500/10 blur-3xl rounded-full" />
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Patient history</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-white">{patient.name}</h2>
                <p className="mt-2 text-sm text-slate-400 font-medium">{patient.clinicId}</p>
              </div>
              <RiskBadge level={assessment.level} />
            </div>
            
            <div className="relative z-10 mt-8 rounded-xl bg-slate-950/50 border border-slate-800 p-5 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-500/20 rounded-xl text-teal-400">
                  <TrendingUp className="h-6 w-6" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400">Current trend score</p>
                  <p className="text-3xl font-black text-white">{assessment.score}<span className="text-lg text-slate-500">/15</span></p>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 mt-6 space-y-3">
              {assessment.trendFlags.map((flag) => (
                <div key={flag} className="flex gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200 backdrop-blur-md">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
                  <p>{flag}</p>
                </div>
              ))}
            </div>
            
            <div className="relative z-10 mt-6 rounded-xl border border-teal-500/30 bg-teal-500/10 p-5 backdrop-blur-md">
              <div className="flex gap-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
                <p className="text-sm leading-relaxed text-teal-100">
                  The prototype stores readings locally and calculates trend deltas from the recent window. Clinical
                  deployment would require validated thresholds, device calibration, and clinician oversight.
                </p>
              </div>
            </div>
          </article>

          <section className="grid gap-6 md:grid-cols-2">
            {charts.map((chart) => (
              <TrendChart key={chart.title} readings={readings} {...chart} />
            ))}
          </section>
        </section>

        <section className="mt-8 glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-teal-500/20 text-teal-400">
              <TableProperties className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Sample patient history table</h2>
          </div>
          <div className="mt-6 overflow-x-auto rounded-xl border border-white/5 bg-slate-950/50 backdrop-blur-md">
            <table className="min-w-full divide-y divide-white/5 text-left text-sm">
              <thead className="bg-white/5 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                <tr>
                  <th className="px-5 py-4">Time</th>
                  <th className="px-5 py-4">SpO2</th>
                  <th className="px-5 py-4">HR</th>
                  <th className="px-5 py-4">Temp</th>
                  <th className="px-5 py-4">RR</th>
                  <th className="px-5 py-4">BP</th>
                  <th className="px-5 py-4">Glucose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {readings.map((reading) => (
                  <tr key={reading.timestamp} className="text-slate-300 transition hover:bg-white/5">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-200">{formatDateTime(reading.timestamp)}</td>
                    <td className="px-5 py-4">{reading.spo2}%</td>
                    <td className="px-5 py-4">{reading.heartRate} bpm</td>
                    <td className="px-5 py-4">{reading.temperatureC.toFixed(1)} °C</td>
                    <td className="px-5 py-4">{reading.respiratoryRate}/min</td>
                    <td className="px-5 py-4">{formatBp(reading)}</td>
                    <td className="px-5 py-4">{reading.glucoseMgDl ?? "NA"} mg/dL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
