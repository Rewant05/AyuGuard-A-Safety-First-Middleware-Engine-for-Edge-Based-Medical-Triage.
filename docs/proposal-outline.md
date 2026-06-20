# AyuGuard Edge Proposal Outline

## Title

AyuGuard Edge - Offline AI-Powered Biomedical Triage Hub for Rural Primary Health Centres

## Problem Statement Mapping

Selected problem statement: Longitudinal Clinical Investigation Intelligence System

Rural clinics often face unreliable internet, limited specialist availability, delayed escalation, and fragmented vitals tracking. AyuGuard Edge focuses on longitudinal physiological monitoring and deterioration alerts for frontline health workers.

## Proposed Solution

AyuGuard Edge combines a low-cost edge device, vitals sensors, local storage, an offline risk engine, and a health worker dashboard. It records SpO2, heart rate, temperature, respiratory rate, blood pressure, and optional glucose input, then generates a conservative triage risk level and escalation summary.

## Novelty

- Device-and-dashboard workflow rather than chatbot-only interaction.
- Trend-based risk detection from local vitals history.
- Offline-first PHC operation with localStorage and PWA basics in the MVP.
- Human-in-the-loop safety router for clinical review.

## MVP Scope

- Simulated live vitals dashboard.
- TypeScript risk scoring engine.
- Longitudinal trend charts.
- Medication, emergency, diagnosis, and hallucination-risk safety router.
- Hardware architecture and estimated Bill of Materials.

## Clinical Safety Position

The MVP is not a certified medical device. It uses simulated data and does not diagnose disease or prescribe treatment. It is a decision-support prototype intended to route cases toward clinician review.

## Expected Impact

- Lower escalation delay in PHCs.
- Better visibility of deterioration trends.
- Reduced dependence on continuous internet.
- More standardized handoff summaries for clinicians.

## Future Work

- Sensor firmware integration.
- Device calibration and biomedical safety testing.
- Clinician-reviewed threshold configuration.
- Multilingual interface.
- FHIR export and referral network sync.
- Prospective validation study design.

## References Placeholder

- WHO digital health intervention guidance.
- Early warning score and deterioration detection literature.
- Indian primary health centre workflow references.
- Biomedical device safety and calibration standards.
