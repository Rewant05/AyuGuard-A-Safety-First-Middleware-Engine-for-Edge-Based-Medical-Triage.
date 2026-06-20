import { Activity, BatteryCharging, CircleDot, Database, HeartPulse, ShieldAlert, Thermometer } from "lucide-react";

export function DeviceHeroMock() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="rounded-lg border border-slate-300 bg-slate-950 p-4 shadow-soft">
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">AyuGuard Edge Unit</p>
              <p className="mt-1 text-lg font-extrabold text-white">PHC offline triage console</p>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-teal-400/15 px-3 py-2 text-sm font-bold text-teal-200">
              <CircleDot className="h-4 w-4" aria-hidden />
              Edge AI
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "SpO2", value: "92%", icon: Activity },
              { label: "Pulse", value: "108 bpm", icon: HeartPulse },
              { label: "Temp", value: "38.6 C", icon: Thermometer },
              { label: "Local cache", value: "36 reads", icon: Database }
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-lg border border-slate-700 bg-slate-800 p-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Icon className="h-4 w-4" aria-hidden />
                  <span className="text-xs font-bold uppercase tracking-[0.14em]">{label}</span>
                </div>
                <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-amber-300/40 bg-amber-300/10 p-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-200" aria-hidden />
              <div>
                <p className="text-sm font-extrabold text-amber-100">Moderate deterioration risk</p>
                <p className="mt-1 text-sm text-amber-50/80">SpO2 below threshold + elevated pulse + fever trend</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <BatteryCharging className="h-4 w-4 text-lime-300" aria-hidden />
            Battery backup active
          </div>
          <div className="h-3 w-28 rounded-full bg-slate-800">
            <div className="h-3 w-20 rounded-full bg-lime-300" />
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 left-8 right-8 h-4 rounded-full bg-slate-300/60 blur-xl" />
    </div>
  );
}
