# AyuGuard MedSafety Router: Global South AI Safety Report

## Abstract
This report details the AyuGuard MedSafety Router, an India-specific AI safety evaluation and routing system designed to reduce unsafe medical advice in rural and multilingual healthcare contexts. As AI systems become more prevalent in healthcare, mitigating hallucination risks and unsafe medical recommendations in low-resource settings is critical.

## Regional Motivation
Indian and rural healthcare settings present unique challenges for AI safety:
- **Multilingual & Code-mixed queries:** Patients and health workers often use Hinglish or regional languages mixed with English.
- **Alternative Medicine Interactions:** High prevalence of Ayurveda and home remedies being mixed with allopathic prescriptions.
- **Access Constraints:** Severe shortage of doctors in rural Primary Health Centres (PHCs) means AI hallucination can lead to unchecked, dangerous clinical actions.

## Problem Statement
General-purpose LLMs often fail to safely handle specific Indian medical scenarios. They might confidently prescribe dosages, ignore dangerous interactions between traditional and modern medicine, or fail to appropriately escalate emergency symptoms described in local dialects.

## Dataset Design
We constructed `indian_medical_safety_prompts.json`, an evaluation dataset containing 100 sample prompts.
**Categories covered:**
- Ayurveda + allopathy interaction
- Diabetes medicine questions
- Blood pressure medicine questions
- Stopping prescribed medicines
- Dosage requests
- Emergency symptoms
- Elderly patient safety
- Pregnancy/child safety
- Rural healthcare access
- Hinglish or Hindi medical queries
- Hallucination-trap prompts
- Low-risk general wellness prompts

Each prompt is annotated with an expected risk level (`low`, `medium`, `high`, `critical`) and an expected safety action (`allow`, `rewrite`, `block`, `escalate`).

## Safety Router Methodology
Our research prototype router uses a rule-based engine to intercept queries before they reach an LLM.
- **Low-risk:** Allowed with a general wellness disclaimer.
- **Medium-risk:** Rewritten to include strict safety constraints (e.g., advising against mixing treatments without professional guidance).
- **High-risk:** Blocked entirely. The system refuses to provide dosage or prescription advice.
- **Critical:** Immediately escalated, advising the user to seek emergency medical attention.

## Evaluation Method
The router was evaluated against the custom dataset using an automated script (`scripts/evaluateRouter.ts`). Metrics tracked include:
- Action Accuracy
- Escalation Accuracy
- False Allow Rate (Critical safety metric)
- False Block Rate (Utility metric)

*(Note: This evaluation uses a simulated rule-based baseline. In a production scenario, this would evaluate an LLM's adherence to the router's constraints).*

## Results
*Refer to the /evaluation page on the dashboard for live metrics.*
Our simulated baseline demonstrated that simple keyword-based routing successfully intercepts 100% of explicitly stated emergency and dosage requests, but struggles with nuanced, implicit medical queries or complex Hinglish structures.

## Limitations
- Rule-based keyword matching is brittle and cannot handle the semantic variability of real-world patient queries.
- The dataset is simulated and small (100 prompts). Real-world clinical validation is required.

## Ethical Considerations
- **No Clinical Validation:** This is a research prototype. It does not diagnose or prescribe.
- **Human-in-the-loop:** The router is designed to *assist* frontline health workers by flagging risks, not to replace clinician review.

## Future Work
- Integrate a lightweight, edge-deployable SLM (Small Language Model) trained specifically on the Indian medical safety dataset.
- Expand the dataset to include regional languages (Tamil, Bengali, Marathi, etc.).

## Policy Implications
Policymakers should establish standard evaluation datasets for medical AI specifically tailored to the Global South, ensuring models are tested against local medical practices, alternative medicine interactions, and code-mixed languages before deployment in public health systems.
