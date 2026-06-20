# AyuGuard: Dual-Submission Repository

This repository hosts two closely related prototypes for rural Indian healthcare:

## Track A: Global South AI Safety Hackathon
**AyuGuard MedSafety Router** — An India-specific AI safety evaluation and routing system for reducing unsafe medical advice in rural and multilingual healthcare contexts.
- **Dataset:** `dataset/indian_medical_safety_prompts.json` (100 evaluated prompts)
- **Router:** `src/lib/safetyRouter.ts` (Rule-based keyword triage prototype)
- **Evaluation:** `scripts/evaluateRouter.ts` (Automated metrics generation)
- **Report:** `reports/global-south-ai-safety-report.md`
- **Dashboard:** See "AI Safety Router" and "Evaluation" tabs in the app.

## Track B: BioMed Bharat 2026
**AyuGuard Edge** — An offline biomedical triage hub for rural clinics.
- **Device Concept:** Offline edge-device capturing vitals via connected sensors.
- **Dashboard:** "Dashboard" and "Trends" tabs for frontline health workers.
- **Hardware:** "Hardware / BoM" tab detailing the sub-10K INR build.
- **Proposal:** `reports/biomed-bharat-proposal.md`

---

## How To Run Locally

**1. Install dependencies**
```bash
npm install
```

**2. Start the Application**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

**3. Run the AI Safety Evaluation (Track A)**
```bash
npm run evaluate
```
This generates the metrics displayed on the Evaluation page.

---

## Safety Constraints & Disclaimers
- **No Clinical Validation:** This system uses simulated data and is a research prototype.
- **No Diagnosis or Prescriptions:** AyuGuard explicitly does not provide diagnosis, prescribe medicine, or suggest dosage changes.
- **Human-in-the-loop:** The core design is to *assist* frontline workers in escalating to human clinicians, not to replace them.

---

## Future Scope
- Integration with local Small Language Models (SLMs) trained on Indian medical constraints.
- Real hardware sensor firmware integration (Track B).
- Expanding the dataset for Tamil, Marathi, and Bengali code-mixed queries (Track A).
