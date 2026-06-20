import { BatteryCharging, Cpu, Database, MonitorSmartphone, RadioTower, Router, Thermometer, Waves } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const hardwareItems = [
  {
    item: "Raspberry Pi Zero 2 W or equivalent edge board",
    role: "Local compute, display server, offline risk engine",
    estimate: "INR 2,500-4,500"
  },
  { item: "MAX30102 pulse oximeter sensor", role: "SpO2 and pulse acquisition", estimate: "INR 250-600" },
  { item: "DS18B20 or MLX90614 temperature sensor", role: "Contact or non-contact temperature", estimate: "INR 150-900" },
  { item: "Optional BP monitor integration", role: "Manual or serial/Bluetooth BP capture", estimate: "INR 1,500-3,500" },
  { item: "Small 5 inch display", role: "Local dashboard for PHC desk", estimate: "INR 1,800-3,500" },
  { item: "Battery backup and charging board", role: "Power continuity during outages", estimate: "INR 900-1,800" },
  { item: "Local storage microSD", role: "Offline longitudinal record cache", estimate: "INR 350-700" },
  { item: "Enclosure, cables, buttons, mounts", role: "Clinic-safe prototype housing", estimate: "INR 800-1,500" }
];

const architecture = [
  { label: "Sensors", detail: "SpO2, pulse, temperature, BP, glucose entry", icon: Waves },
  { label: "Edge device", detail: "Raspberry Pi class board with local storage", icon: Cpu },
  { label: "Offline risk engine", detail: "Threshold plus trend scoring in TypeScript", icon: Router },
  { label: "Dashboard", detail: "Local PHC interface on display or tablet", icon: MonitorSmartphone },
  { label: "Health worker alert", detail: "Human escalation and summary handoff", icon: RadioTower }
];

export default function HardwarePage() {
  return (
    <>
      <PageHeader
        eyebrow="Hardware and BoM"
        title="Edge-device architecture"
        description="A practical low-cost biomedical prototype stack that can be assembled with common sensors, local compute, battery backup, and offline storage."
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <Cpu className="h-7 w-7 text-teal-700" aria-hidden />
            <h2 className="mt-4 text-xl font-extrabold text-slate-950">Local compute</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Runs the dashboard and risk engine at the clinic even when internet access is unavailable.
            </p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <Thermometer className="h-7 w-7 text-amber-700" aria-hidden />
            <h2 className="mt-4 text-xl font-extrabold text-slate-950">Basic vitals</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Collects common triage signals: SpO2, pulse, temperature, respiratory rate, BP, and optional glucose.
            </p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <BatteryCharging className="h-7 w-7 text-blue-700" aria-hidden />
            <h2 className="mt-4 text-xl font-extrabold text-slate-950">Power resilient</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Battery backup and local cache support rural clinics with intermittent power and connectivity.
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-950">Hardware workflow</h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-5">
            {architecture.map(({ label, detail, icon: Icon }, index) => (
              <div key={label} className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <p className="mt-4 text-base font-extrabold text-slate-950">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
                {index < architecture.length - 1 ? (
                  <div className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950 text-xs font-extrabold text-white lg:flex">
                    &gt;
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-teal-700" aria-hidden />
            <h2 className="text-xl font-extrabold text-slate-950">Estimated Bill of Materials</h2>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Component</th>
                  <th className="px-4 py-3">Prototype role</th>
                  <th className="px-4 py-3">Approx cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hardwareItems.map((item) => (
                  <tr key={item.item}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.item}</td>
                    <td className="px-4 py-3 text-slate-700">{item.role}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-900">{item.estimate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950">
            The prototype stays low-cost by using commodity sensors, local TypeScript scoring, local storage, and optional
            syncing instead of continuous cloud inference.
          </div>
        </section>
      </div>
    </>
  );
}
