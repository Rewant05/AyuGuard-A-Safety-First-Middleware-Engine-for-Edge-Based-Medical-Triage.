import type { VitalsReading } from "@/lib/types";

const STORAGE_KEY = "ayuguard-edge-readings";

type StoredReadings = Record<string, VitalsReading[]>;

export function loadStoredReadings(patientId: string): VitalsReading[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredReadings;
    return parsed[patientId] ?? null;
  } catch (error) {
    console.warn("Unable to read AyuGuard local cache", error);
    return null;
  }
}

export function saveStoredReadings(patientId: string, readings: VitalsReading[]) {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredReadings) : {};
    parsed[patientId] = readings.slice(-36);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.warn("Unable to save AyuGuard local cache", error);
  }
}
