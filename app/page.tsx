import Link from "next/link";
import { ArrowRight, Cpu, IndianRupee, Languages, RadioTower, ShieldCheck, Stethoscope, WifiOff } from "lucide-react";
import { DeviceHeroMock } from "@/components/DeviceHeroMock";

const problemPoints = [
  "Unreliable internet interrupts remote triage and record syncing.",
  "Limited specialist access delays escalation from primary health centres.",
  "Vitals are often fragmented across notebooks, devices, and verbal handoffs.",
  "Deterioration can be missed when trends are not visible to frontline workers."
];

const solutionPoints = [
  "Low-cost edge device captures basic vitals and keeps a local timeline.",
  "Offline risk engine combines thresholds and trends without paid APIs.",
  "Health worker dashboard gives human-in-the-loop escalation prompts.",
  "Summary output helps standardize clinician referral handoffs."
];

const impactMetrics = [
  { label: "Low-cost", value: "INR 8k-14k", icon: IndianRupee },
  { label: "Offline-first", value: "Local cache", icon: WifiOff },
  { label: "Multilingual-ready", value: "PHC workflows", icon: Languages },
  { label: "Human escalation", value: "Clinician review", icon: RadioTower }
];

export default function LandingPage() {
  return (
    <div>
      <section className="surface-grid border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-extrabold text-teal-800">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              BioMed Bharat 2026 prototype
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
              AyuGuard Edge
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-semibold leading-8 text-slate-700">
              Offline biomedical triage and deterioration-alert hub for rural primary health centres
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              A simulated biomedical device and software system that monitors physiological trends, flags deterioration
              risk, and helps frontline health workers escalate safely without claiming to diagnose disease.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="focus-ring inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800"
              >
                Open Live Triage
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/hardware"
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-extrabold text-slate-900 transition hover:bg-slate-50"
              >
                View Hardware BoM
                <Cpu className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
          <DeviceHeroMock />
        </div>
      </section>

      <section className="bg-slate-950 py-5 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-200">Selected problem statement</p>
            <p className="mt-1 text-xl font-extrabold">Longitudinal Clinical Investigation Intelligence System</p>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-300">
            AyuGuard maps repeated vitals into a local timeline, detects risk changes, and routes alerts to human review.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
              <Stethoscope className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Problem</h2>
          </div>
          <ul className="mt-6 space-y-4">
            {problemPoints.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-6 text-slate-700">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-rose-600" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Cpu className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Solution</h2>
          </div>
          <ul className="mt-6 space-y-4">
            {solutionPoints.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-6 text-slate-700">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-600" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Impact placeholders</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">Built for rural PHC constraints</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {impactMetrics.map(({ label, value, icon: Icon }) => (
              <article key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <Icon className="h-6 w-6 text-teal-700" aria-hidden />
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-950">{value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
