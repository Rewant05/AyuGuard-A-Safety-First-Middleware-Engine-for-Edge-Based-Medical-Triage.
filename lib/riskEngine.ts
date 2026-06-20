import type { RiskAssessment, TriageRecommendation, VitalsReading } from "@/lib/types";

const CLINICAL_SAFETY_NOTE =
  "Prototype decision support only. It does not diagnose disease and is not a certified medical device.";

function pushScore(
  reasons: string[],
  label: string,
  points: number,
  score: { value: number }
) {
  reasons.push(label);
  score.value += points;
}

function average(numbers: number[]) {
  return numbers.reduce((sum, value) => sum + value, 0) / Math.max(numbers.length, 1);
}

function classify(score: number, latest: VitalsReading): RiskAssessment["level"] {
  const criticalSingleReading =
    latest.spo2 < 90 ||
    latest.respiratoryRate >= 30 ||
    latest.systolicBp < 90 ||
    latest.systolicBp >= 180 ||
    latest.diastolicBp >= 120 ||
    latest.temperatureC >= 40 ||
    (latest.glucoseMgDl !== undefined && (latest.glucoseMgDl < 54 || latest.glucoseMgDl > 300));

  if (criticalSingleReading || score >= 11) return "Critical";
  if (score >= 7) return "High";
  if (score >= 3) return "Moderate";
  return "Low";
}

function recommendationForLevel(level: RiskAssessment["level"]): TriageRecommendation {
  if (level === "Critical") return "Emergency escalation";
  if (level === "High") return "Refer to doctor";
  if (level === "Moderate") return "Repeat measurement";
  return "Continue observation";
}

export function assessRisk(readings: VitalsReading[]): RiskAssessment {
  if (readings.length === 0) {
    return {
      level: "Low",
      score: 0,
      recommendation: "Repeat measurement",
      reasons: ["No vitals available"],
      trendFlags: ["Capture a fresh complete reading"],
      clinicalSafetyNote: CLINICAL_SAFETY_NOTE
    };
  }

  const latest = readings[readings.length - 1];
  const score = { value: 0 };
  const reasons: string[] = [];
  const trendFlags: string[] = [];

  // Thresholds are intentionally simple and conservative for a hackathon prototype.
  // In a clinical product, these must be reviewed, localized, validated, and audited.
  if (latest.spo2 < 90) pushScore(reasons, "SpO2 below emergency threshold", 5, score);
  else if (latest.spo2 < 94) pushScore(reasons, "SpO2 below observation threshold", 3, score);
  else if (latest.spo2 < 96) pushScore(reasons, "SpO2 slightly reduced", 1, score);

  if (latest.heartRate >= 130 || latest.heartRate <= 45) {
    pushScore(reasons, "Heart rate outside urgent range", 4, score);
  } else if (latest.heartRate >= 110 || latest.heartRate <= 55) {
    pushScore(reasons, "Heart rate outside normal observation range", 2, score);
  }

  if (latest.temperatureC >= 40 || latest.temperatureC <= 35) {
    pushScore(reasons, "Temperature outside urgent range", 4, score);
  } else if (latest.temperatureC >= 38) {
    pushScore(reasons, "Fever threshold crossed", 2, score);
  }

  if (latest.respiratoryRate >= 30 || latest.respiratoryRate <= 8) {
    pushScore(reasons, "Respiratory rate outside urgent range", 4, score);
  } else if (latest.respiratoryRate >= 24 || latest.respiratoryRate <= 10) {
    pushScore(reasons, "Respiratory rate needs repeat check", 2, score);
  }

  if (latest.systolicBp < 90 || latest.diastolicBp < 60) {
    pushScore(reasons, "Blood pressure below safe observation range", 4, score);
  } else if (latest.systolicBp >= 180 || latest.diastolicBp >= 120) {
    pushScore(reasons, "Blood pressure in emergency escalation range", 4, score);
  } else if (latest.systolicBp >= 160 || latest.diastolicBp >= 100) {
    pushScore(reasons, "Blood pressure elevated", 2, score);
  }

  if (latest.glucoseMgDl !== undefined) {
    if (latest.glucoseMgDl < 54 || latest.glucoseMgDl > 300) {
      pushScore(reasons, "Glucose outside urgent range", 4, score);
    } else if (latest.glucoseMgDl < 70 || latest.glucoseMgDl > 250) {
      pushScore(reasons, "Glucose needs clinician review", 2, score);
    } else if (latest.glucoseMgDl > 180) {
      pushScore(reasons, "Glucose elevated for follow-up", 1, score);
    }
  }

  if (readings.length >= 3) {
    const previousWindow = readings.slice(Math.max(0, readings.length - 4), readings.length - 1);
    const avgSpo2 = average(previousWindow.map((reading) => reading.spo2));
    const avgHeartRate = average(previousWindow.map((reading) => reading.heartRate));
    const avgTemp = average(previousWindow.map((reading) => reading.temperatureC));
    const avgRespiratory = average(previousWindow.map((reading) => reading.respiratoryRate));
    const avgSystolic = average(previousWindow.map((reading) => reading.systolicBp));

    if (avgSpo2 - latest.spo2 >= 2) {
      trendFlags.push("SpO2 has fallen by 2 or more points from recent baseline");
      score.value += 2;
    }
    if (latest.heartRate - avgHeartRate >= 12) {
      trendFlags.push("Pulse is rising compared with recent baseline");
      score.value += 1;
    }
    if (latest.temperatureC - avgTemp >= 0.6) {
      trendFlags.push("Temperature is trending upward");
      score.value += 1;
    }
    if (latest.respiratoryRate - avgRespiratory >= 3) {
      trendFlags.push("Respiratory rate is increasing over time");
      score.value += 2;
    }
    if (avgSystolic - latest.systolicBp >= 15) {
      trendFlags.push("Systolic blood pressure has dropped against baseline");
      score.value += 2;
    }
  }

  if (reasons.length === 0) reasons.push("No current threshold breach detected");
  if (trendFlags.length === 0) trendFlags.push("No deterioration trend detected in the recent window");

  const level = classify(score.value, latest);

  return {
    level,
    score: Math.min(score.value, 15),
    recommendation: recommendationForLevel(level),
    reasons,
    trendFlags,
    clinicalSafetyNote: CLINICAL_SAFETY_NOTE
  };
}

export function buildReasonSentence(assessment: RiskAssessment) {
  const reason = assessment.reasons[0] ?? "Current vitals reviewed";
  const trend = assessment.trendFlags.find((flag) => !flag.startsWith("No deterioration"));
  return trend ? `${reason} + ${trend.toLowerCase()}` : reason;
}
