# Architecture

## System Overview

AyuGuard Edge is a local-first biomedical triage prototype built with Next.js, TypeScript, and Tailwind CSS. The MVP simulates an edge device deployed in a rural primary health centre.

## Workflow

1. Sensors or manual inputs capture basic vitals.
2. The edge board stores readings locally.
3. The TypeScript risk engine evaluates thresholds and trend deltas.
4. The dashboard displays risk level, explanation, and triage recommendation.
5. Health worker generates a summary or queues escalation for clinician review.

## Software Modules

- `data/samplePatients.ts`: simulated patient profiles and vitals history.
- `lib/riskEngine.ts`: conservative prototype deterioration score.
- `lib/simulator.ts`: mock live reading generator.
- `lib/storage.ts`: localStorage cache for offline-first behavior.
- `lib/safetyRouter.ts`: rule-based safety router for unsafe medical prompts.
- `components/TrendChart.tsx`: custom SVG trend charts.
- `components/LiveDashboard.tsx`: simulated PHC triage dashboard.

## Risk Engine Inputs

- SpO2
- Heart rate
- Body temperature
- Respiratory rate
- Systolic and diastolic blood pressure
- Optional glucose
- Recent trend changes against local baseline

## Offline-First Behavior

- Latest readings are cached in localStorage.
- PWA manifest is available at `/manifest.webmanifest`.
- Service worker caches app shell routes and falls back to dashboard when offline.

## Safety Boundaries

- No diagnosis.
- No prescription advice.
- No medicine interaction advice.
- Emergency symptoms route to immediate escalation.
- Human review remains mandatory.

## Deployment Notes

The MVP can run on a laptop, tablet, or Raspberry Pi class device using a local Next.js server. Real hardware integration would require firmware, calibration, validation, and regulatory review before clinical use.
