# AyuGuard: Safety-First AI Middleware for Global South Healthcare
### *Track A: Global South AI Safety Hackathon*

**AyuGuard** is an open-source, safety-first middleware engine designed to solve the critical "hallucination crisis" in medical AI deployment for rural and underserved regions. By implementing a rigorous safety router, AyuGuard ensures that AI-driven diagnostic assistance in primary health centers (PHCs) is verified, context-aware, and fundamentally safe.

![AyuGuard Dashboard](dashboard.png)

---

## 🌍 The Problem
In the Global South, primary care providers often lack specialized training and immediate access to clinical decision support. While LLMs offer a potential solution, they pose severe risks:
1.  **Diagnostic Hallucinations:** Unverified medical advice can lead to life-threatening patient outcomes.
2.  **Linguistic Context:** Standard models struggle with regional dialects, Hinglish, and cultural medical nuances.
3.  **Lack of Escalation:** Most AI tools function as "black boxes," leaving health workers without a clear path to consult a human doctor.

---

## 🛡️ The Solution: AyuGuard MedSafety Router
AyuGuard acts as a **Guardian Layer** between the raw LLM and the frontline health worker.

### Core Features
*   ✅ **Context-Aware Safety Parsing:** Routes medical queries through a custom rule-based triage system before hitting the LLM.
*   ✅ **Dynamic Risk Escalation:** Automatically classifies responses as *Safe*, *Escalate to Human*, or *Block*.
*   ✅ **Linguistic Robustness:** Specifically designed to handle multilingual/code-mixed inputs common in Indian clinical settings.
*   ✅ **Audit & Evaluation:** Built-in automated testing for safety thresholds to ensure high precision in high-stakes environments.

---

## 📊 Technical Architecture (Track A Focus)

| Module | Description |
| :--- | :--- |
| **Safety Router** | `src/lib/safetyRouter.ts` - The primary logic layer for intercepting and classifying high-risk prompts. |
| **Safety Dataset** | `dataset/indian_medical_safety_prompts.json` - A curated library of 100+ edge-case medical safety probes. |
| **Evaluation Engine** | `scripts/evaluateRouter.ts` - Automated pipeline generating safety metrics (F1-score, False Negative Rate). |
| **Telemetry** | Real-time logging of blocked vs. escalated queries for clinical review. |

---

## 🚀 How to Run Locally

**1. Clone & Install**
```bash
git clone [https://github.com/Rewant05/AyuGuard-A-Safety-First-Middleware-Engine-for-Edge-Based-Medical-Triage.git](https://github.com/Rewant05/AyuGuard-A-Safety-First-Middleware-Engine-for-Edge-Based-Medical-Triage.git)
cd AyuGuard-A-Safety-First-Middleware-Engine-for-Edge-Based-Medical-Triage
npm install