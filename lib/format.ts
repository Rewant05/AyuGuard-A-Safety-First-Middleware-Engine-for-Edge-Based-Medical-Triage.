import type { VitalsReading } from "@/lib/types";

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatBp(reading: VitalsReading) {
  return `${reading.systolicBp}/${reading.diastolicBp}`;
}
