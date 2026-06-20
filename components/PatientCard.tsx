import { MapPin, Stethoscope, UserRound } from "lucide-react";
import type { PatientProfile, VitalsReading } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

export function PatientCard({ patient, latest }: { patient: PatientProfile; latest: VitalsReading }) {
  return (
    <section className="glass-panel rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-teal-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 p-32 bg-blue-500/10 blur-3xl rounded-full" />
      
      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Current patient</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">{patient.name}</h2>
          <p className="mt-2 text-sm font-medium text-slate-400">
            {patient.age} years, {patient.sex} <span className="mx-2 text-slate-600">|</span> ID: {patient.id}
          </p>
        </div>
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm font-bold text-teal-300 backdrop-blur-md">
          Live Connection
        </div>
      </div>

      <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition hover:bg-white/10">
          <div className="p-2.5 rounded-lg bg-teal-500/20 text-teal-300">
            <MapPin className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Village</p>
            <p className="mt-0.5 text-sm font-bold text-slate-200">{patient.village}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition hover:bg-white/10">
          <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-300">
            <Stethoscope className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Clinic</p>
            <p className="mt-0.5 text-sm font-bold text-slate-200">{patient.clinicId}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition hover:bg-white/10">
          <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-300">
            <UserRound className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Last update</p>
            <p className="mt-0.5 text-sm font-bold text-slate-200">{formatDateTime(latest.timestamp)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
