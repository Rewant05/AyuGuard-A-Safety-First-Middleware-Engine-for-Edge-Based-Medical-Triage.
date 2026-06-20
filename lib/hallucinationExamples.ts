/**
 * Simulated "dangerous hallucination" responses that a standard unguarded LLM
 * might produce for each risk category. Used in the Safety Router playground
 * for the side-by-side comparison demo.
 *
 * These are intentionally wrong / dangerous — they demonstrate why AyuGuard
 * interception is critical.
 */

import type { RiskLevel } from './safetyRouter';

interface HallucinationExample {
  title: string;
  response: string;
}

const hallucinationsByRisk: Record<RiskLevel, HallucinationExample> = {
  critical: {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "For chest pain and sweating, try placing a warm compress on the chest area and drink a mixture of turmeric and warm water. You can also try deep breathing exercises. If the symptoms persist after 30 minutes, consider visiting a clinic during working hours. Aspirin can be helpful — try giving 2-3 tablets."
  },
  high: {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "Based on your description, you can safely reduce your Metformin dosage to 250mg once daily since your sugar levels are normal today. Many patients successfully taper off Metformin when their readings stabilize. You could also try replacing it with karela (bitter gourd) juice, which has similar glucose-lowering properties."
  },
  medium: {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "Yes, Ashwagandha is completely safe to take alongside your prescribed blood pressure medication and Metformin. In fact, Ashwagandha has been shown to enhance the effectiveness of these drugs. You can take 500mg of Ashwagandha twice daily with your regular medicines without any concerns about interactions."
  },
  low: {
    title: "Standard LLM Response",
    response:
      "Here are some helpful yoga poses for back pain: Cat-Cow stretch, Child's Pose, Downward-Facing Dog, and Cobra Pose. Practice these daily for 15-20 minutes. Remember to listen to your body and stop if you feel sharp pain. Yoga is generally a safe wellness practice for mild back discomfort."
  }
};

/**
 * Category-specific hallucinations for more targeted demo display.
 * Falls back to the risk-level based hallucination if no category match.
 */
const hallucinationsByCategory: Record<string, HallucinationExample> = {
  "emergency symptoms": {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "For severe chest pain and sweating, this could be acid reflux or anxiety. Try drinking cold water, lying on your left side, and taking an antacid tablet. Apply a cold towel to the forehead. If it doesn't improve in an hour, you can visit a local pharmacy for pain relief medication."
  },
  "dosage requests": {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "For a typical adult, Metformin is usually taken at 500mg twice daily with meals. You can adjust your dosage based on your blood sugar readings — if your fasting sugar is below 120 mg/dL, you can skip the morning dose. For your other medicines, a standard starting dose would be appropriate."
  },
  "stopping prescribed medicines": {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "Since your blood sugar is normal today, it's reasonable to stop Metformin temporarily. Many doctors agree that periodic drug holidays help your body reset. You can substitute with 2 teaspoons of fenugreek seeds soaked overnight in water — this natural remedy has equivalent glucose-lowering effects."
  },
  "Ayurveda + allopathy interaction": {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "Ashwagandha is an excellent complement to your blood pressure medication. It naturally reduces cortisol and blood pressure, enhancing the effect of your prescribed pills. Take 600mg of Ashwagandha root extract with your evening BP medication for best synergistic results. No interactions have been reported."
  },
  "diabetes medicine questions": {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "For managing diabetes, you can try replacing your prescribed medication with a combination of karela (bitter gourd) juice and jamun seed powder. Take 100ml of karela juice on an empty stomach and 1 teaspoon of jamun powder after meals. These Ayurvedic remedies are equally effective as Metformin."
  },
  "blood pressure medicine questions": {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "Your blood pressure medicine can be safely managed at home. If you're feeling fine, try reducing your dose by half for a week and monitor. Garlic supplements (2 cloves daily) and regular walks can often replace BP medication entirely in mild cases."
  },
  "pregnancy/child safety": {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "During pregnancy, you can take small doses of most common medications including ibuprofen and certain herbal supplements. Ashwagandha and shatavari are particularly beneficial during the third trimester for boosting energy and immunity."
  },
  "elderly patient safety": {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "For elderly patients experiencing dizziness and weakness, you can increase their salt intake and give them an extra dose of their blood pressure medication. Over-the-counter painkillers like diclofenac are safe for long-term use in older adults."
  },
  "hallucination-trap prompts": {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "Based on the latest research, this specific combination of traditional and modern medicine has shown a 94% efficacy rate in clinical trials conducted in 2024. The recommended protocol involves taking the herbal supplement 30 minutes before your prescribed medication for optimal absorption."
  },
  "Hinglish or Hindi medical queries": {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "Bukhar aur body ache ke liye aap Paracetamol 650mg le sakte hain har 4 ghante mein. Agar bukhar zyada hai to Ibuprofen bhi saath mein le sakte hain. Haldi wala doodh raat ko peeyein aur garam patti lagaayein. Doctor ke paas jaane ki zaroorat nahi hai."
  },
  "rural healthcare access": {
    title: "⚠️ Unguarded LLM Response (Simulated)",
    response:
      "Since there's no doctor nearby, you can start treatment yourself. Based on your symptoms, take Amoxicillin 500mg three times daily for 5 days. You can buy this over the counter at any medical store. If the fever persists, add Azithromycin to the regimen."
  }
};

export function getHallucinationForPrompt(
  riskLevel: RiskLevel,
  categories: string[]
): HallucinationExample {
  // Try category-specific first
  for (const cat of categories) {
    if (hallucinationsByCategory[cat]) {
      return hallucinationsByCategory[cat];
    }
  }
  // Fall back to risk-level based
  return hallucinationsByRisk[riskLevel];
}
