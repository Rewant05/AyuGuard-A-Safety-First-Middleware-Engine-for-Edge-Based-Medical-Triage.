import type { PatientProfile } from "@/lib/types";

export const samplePatients: PatientProfile[] = [
  {
    id: "PHC-KR-042",
    name: "Meera Devi",
    age: 62,
    sex: "Female",
    village: "Kolaram",
    clinicId: "PHC Kolaram - Bed 02",
    healthWorker: "ANM Kavitha",
    notes: "Simulated longitudinal record for hackathon demo. Not real patient data.",
    history: [
      {
        timestamp: "2026-06-18T08:05:00+05:30",
        spo2: 96,
        heartRate: 84,
        temperatureC: 37.1,
        respiratoryRate: 18,
        systolicBp: 136,
        diastolicBp: 84,
        glucoseMgDl: 166,
        source: "simulated_sensor"
      },
      {
        timestamp: "2026-06-18T09:05:00+05:30",
        spo2: 95,
        heartRate: 88,
        temperatureC: 37.4,
        respiratoryRate: 19,
        systolicBp: 138,
        diastolicBp: 86,
        glucoseMgDl: 172,
        source: "simulated_sensor"
      },
      {
        timestamp: "2026-06-18T10:05:00+05:30",
        spo2: 94,
        heartRate: 94,
        temperatureC: 37.9,
        respiratoryRate: 21,
        systolicBp: 142,
        diastolicBp: 88,
        glucoseMgDl: 184,
        source: "simulated_sensor"
      },
      {
        timestamp: "2026-06-18T11:05:00+05:30",
        spo2: 93,
        heartRate: 102,
        temperatureC: 38.3,
        respiratoryRate: 23,
        systolicBp: 146,
        diastolicBp: 90,
        glucoseMgDl: 196,
        source: "simulated_sensor"
      },
      {
        timestamp: "2026-06-18T12:05:00+05:30",
        spo2: 92,
        heartRate: 108,
        temperatureC: 38.6,
        respiratoryRate: 25,
        systolicBp: 150,
        diastolicBp: 92,
        glucoseMgDl: 214,
        source: "simulated_sensor"
      }
    ]
  },
  {
    id: "PHC-BR-018",
    name: "Rafiq Ansari",
    age: 47,
    sex: "Male",
    village: "Bhadrakpur",
    clinicId: "PHC Bhadrakpur - Chair 01",
    healthWorker: "CHO Neha",
    notes: "Simulated stable reference case.",
    history: [
      {
        timestamp: "2026-06-18T08:20:00+05:30",
        spo2: 98,
        heartRate: 76,
        temperatureC: 36.8,
        respiratoryRate: 16,
        systolicBp: 124,
        diastolicBp: 78,
        glucoseMgDl: 118,
        source: "simulated_sensor"
      },
      {
        timestamp: "2026-06-18T09:20:00+05:30",
        spo2: 98,
        heartRate: 78,
        temperatureC: 36.9,
        respiratoryRate: 16,
        systolicBp: 126,
        diastolicBp: 80,
        glucoseMgDl: 121,
        source: "simulated_sensor"
      }
    ]
  }
];
