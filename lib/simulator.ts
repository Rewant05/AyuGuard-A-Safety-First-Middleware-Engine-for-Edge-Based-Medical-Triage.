import type { VitalsReading } from "@/lib/types";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function jitter(range: number) {
  return (Math.random() - 0.5) * range;
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}

export function nextSimulatedReading(history: VitalsReading[]): VitalsReading {
  const latest = history[history.length - 1];
  const deteriorationPulse = Math.random() > 0.72;

  return {
    timestamp: new Date().toISOString(),
    spo2: Math.round(clamp(latest.spo2 + jitter(1.4) - (deteriorationPulse ? 0.7 : 0), 86, 99)),
    heartRate: Math.round(clamp(latest.heartRate + jitter(6) + (deteriorationPulse ? 3 : 0), 48, 138)),
    temperatureC: roundOne(clamp(latest.temperatureC + jitter(0.25) + (deteriorationPulse ? 0.12 : 0), 35.6, 40.4)),
    respiratoryRate: Math.round(clamp(latest.respiratoryRate + jitter(2.4) + (deteriorationPulse ? 1.2 : 0), 10, 34)),
    systolicBp: Math.round(clamp(latest.systolicBp + jitter(8), 86, 184)),
    diastolicBp: Math.round(clamp(latest.diastolicBp + jitter(5), 54, 122)),
    glucoseMgDl:
      latest.glucoseMgDl === undefined
        ? undefined
        : Math.round(clamp(latest.glucoseMgDl + jitter(18) + (deteriorationPulse ? 4 : 0), 62, 320)),
    source: "simulated_sensor"
  };
}
