export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export type TriageRecommendation =
  | "Continue observation"
  | "Repeat measurement"
  | "Refer to doctor"
  | "Emergency escalation";

export type SafetyFlag =
  | "emergency_symptoms"
  | "medicine_interaction"
  | "prescription_change"
  | "diagnosis_request"
  | "hallucination_risk"
  | "general_safe";

export interface VitalsReading {
  timestamp: string;
  spo2: number;
  heartRate: number;
  temperatureC: number;
  respiratoryRate: number;
  systolicBp: number;
  diastolicBp: number;
  glucoseMgDl?: number;
  source: "simulated_sensor" | "manual_entry";
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  sex: "Female" | "Male" | "Other";
  village: string;
  clinicId: string;
  healthWorker: string;
  notes: string;
  history: VitalsReading[];
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  recommendation: TriageRecommendation;
  reasons: string[];
  trendFlags: string[];
  clinicalSafetyNote: string;
}

export interface SafetyRouterResult {
  flags: SafetyFlag[];
  severity: "routine" | "review" | "urgent";
  response: string;
  rationale: string[];
}
