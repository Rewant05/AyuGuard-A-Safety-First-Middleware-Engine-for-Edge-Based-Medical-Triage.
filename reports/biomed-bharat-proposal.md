# AyuGuard Edge: BioMed Bharat 2026 Proposal

## Concept
AyuGuard Edge is an offline biomedical triage hub designed for rural primary health centres (PHCs). It acts as a local intelligence node that connects basic physiological sensors, monitors patient trends over time, and alerts health workers to potential clinical deterioration.

## Architecture
The system consists of three main layers:
1. **Hardware Edge Node:** A low-cost SBC (Single Board Computer) acting as a local offline server.
2. **Clinical Dashboard:** A local web interface for frontline health workers to log and review vitals.
3. **Safety Router (Clinical AI Layer):** A guardrail system that evaluates text queries and sensor trends to ensure safe escalation without attempting automated diagnosis.

## Hardware BoM (Bill of Materials)
- **Compute:** Raspberry Pi 4 (2GB) or equivalent low-cost SBC (~INR 4,500)
- **Power:** UPS HAT with 18650 Battery Backup (~INR 1,200)
- **Connectivity:** Local Wi-Fi Router (No internet required) (~INR 800)
- **Storage:** 32GB High-Endurance MicroSD (~INR 600)
- **Display:** 7-inch Touchscreen (Optional, for headless PHCs, workers use mobile phones) (~INR 3,000)
- **Total Estimated Cost:** ~INR 10,100

## Rural PHC Workflow
1. **Vitals Capture:** A health worker measures basic vitals (BP, SpO2, Temp, HR) using standard standalone medical devices.
2. **Local Logging:** Vitals are logged into the AyuGuard offline dashboard via a local Wi-Fi connection.
3. **Trend Monitoring:** The system plots longitudinal trends, which are often missed when recorded on paper.
4. **Deterioration Alert:** If a negative trend is detected (e.g., dropping SpO2 over hours), the dashboard flags the patient.
5. **Human-in-the-loop Escalation:** The health worker is prompted to escalate the case to the district hospital clinician via a structured summary.

## Safety & Compliance
- **No Diagnosis:** AyuGuard Edge explicitly does not provide medical diagnoses.
- **Triage Assistance Only:** The tool assists in prioritizing patients and recognizing deterioration trends.
- **Offline First:** Ensures 100% uptime in areas with unreliable internet connectivity, ensuring patient data is always accessible locally.
