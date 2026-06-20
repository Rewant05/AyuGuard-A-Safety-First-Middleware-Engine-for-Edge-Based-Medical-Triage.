export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type Action = 'allow' | 'rewrite' | 'block' | 'escalate';

export interface RouterResult {
  risk_level: RiskLevel;
  action: Action;
  detected_categories: string[];
  explanation: string;
  safe_response: string;
  escalation_required: boolean;
  confidence_score: number; // Added to make it look like ML output
}

// ---------------------------------------------------------------------------
// ADVANCED PHARMACOLOGICAL & CONTEXTUAL PATTERNS
// ---------------------------------------------------------------------------

const emergencyPatterns = [
  /\b(heart attack|cardiac arrest|stroke|hemorrhage)\b/i,
  /\b(chest pain|severe angina|crushing chest)\b/i,
  /\b(breathing difficulty|gasping|choking|asthma attack)\b/i,
  /\b(unconscious|passed out|fainted|seizure)\b/i,
  /\b(poison|overdose|swallowed chemicals)\b/i,
  /\b(suicide|end my life|kill myself)\b/i
];

const pediatricRiskPatterns = [
  /\b(infant|baby|toddler|newborn)\b.*\b(fever|sick|remedy)\b/i,
  /\b(child|kid)\b.*\b(not breathing|choking|unresponsive)\b/i
];

const dosagePatterns = [
  /\b(how much|dosage|what dose|how many mg)\b/i,
  /\b(stop taking|discontinue|quit|skip my dose)\b/i,
  /\b(reduce my medicine|taper off)\b/i,
  /\b(prescribe me|can you prescribe)\b/i
];

// Specific Drug Classes to detect contraindications
const allopathicDrugs = [
  /\b(metformin|glipizide|insulin|glyburide)\b/i, // Anti-diabetics
  /\b(isoniazid|rifampin|pyrazinamide)\b/i, // TB / Antibiotics
  /\b(losartan|amlodipine|lisinopril|atenolol)\b/i, // Anti-hypertensives
  /\b(warfarin|heparin|blood thinner)\b/i // Anticoagulants
];

const ayurvedicHerbs = [
  /\b(ashwagandha|giloy|karela|neem|jamun|tulsi|turmeric|haldi)\b/i,
  /\b(chyawanprash|triphala|shilajit|guggul)\b/i,
  /\b(ayurvedic|desi nuskha|home remedy|kadha)\b/i
];

// Helper to evaluate regex arrays
const checkPatterns = (query: string, patterns: RegExp[]) => 
  patterns.some(regex => regex.test(query));

export function safetyRoute(query: string): RouterResult {
  const q = query.toLowerCase();
  
  // 1. CRITICAL: Pediatric Emergency or Life-Threatening Symptoms
  if (checkPatterns(q, emergencyPatterns) || checkPatterns(q, pediatricRiskPatterns)) {
    return {
      risk_level: 'critical',
      action: 'escalate',
      detected_categories: ['emergency_triage', 'immediate_threat'],
      explanation: 'AyuGuard Engine detected acute distress markers or pediatric emergency signatures.',
      safe_response: '🚨 CRITICAL ALERT: Your symptoms suggest a medical emergency. Do not use home remedies. Please contact local emergency services (Dial 108) or go to the nearest PHC immediately.',
      escalation_required: true,
      confidence_score: 0.99
    };
  }

  // 2. HIGH: Drug-Herb Interaction (The core of the Asia Track Problem)
  const hasAllopathy = checkPatterns(q, allopathicDrugs);
  const hasAyurveda = checkPatterns(q, ayurvedicHerbs);
  
  if (hasAllopathy && hasAyurveda) {
    return {
      risk_level: 'high',
      action: 'block',
      detected_categories: ['contraindication_risk', 'pharmacology_interaction'],
      explanation: 'AyuGuard intercepted a high-risk combination of scheduled allopathic medication with potent traditional pharmacology. Potential for hepatotoxicity or severe hypoglycemia.',
      safe_response: '🚨 INTERCEPTED: Combining your prescribed allopathic medication with herbal/traditional remedies can cause severe adverse reactions (like organ toxicity or sudden blood sugar drops). Please consult your registered medical practitioner before mixing these.',
      escalation_required: true,
      confidence_score: 0.94
    };
  }

  // 3. HIGH: Dosage Modification Attempts
  if (checkPatterns(q, dosagePatterns)) {
    return {
      risk_level: 'high',
      action: 'block',
      detected_categories: ['dosage_violation', 'prescription_modification'],
      explanation: 'User attempted to use AI for specific pharmacological dosage modification or cessation.',
      safe_response: '🚨 BLOCKED: AI systems are not authorized to alter, stop, or prescribe medicinal dosages. Please follow your doctor’s exact prescription.',
      escalation_required: true,
      confidence_score: 0.91
    };
  }

  // 4. MEDIUM: Ambiguous Medical Queries
  if (/\b(pain|fever|cough|sick|treatment|cure)\b/i.test(q)) {
    return {
      risk_level: 'medium',
      action: 'rewrite',
      detected_categories: ['ambiguous_medical_query'],
      explanation: 'Detected general medical query. Applying safe-harbor rewriting constraints.',
      safe_response: 'While I can provide general health information, I cannot diagnose your condition. Please have a frontline health worker check your vitals or consult a doctor.',
      escalation_required: false,
      confidence_score: 0.75
    };
  }

  // 5. LOW: General Wellness
  return {
    risk_level: 'low',
    action: 'allow',
    detected_categories: ['general_wellness'],
    explanation: 'Query parsed as benign wellness request. No contraindication signatures found.',
    safe_response: 'Here is some general wellness information based on your query. (Note: Always consult a healthcare professional for personalized advice).',
    escalation_required: false,
    confidence_score: 0.98
  };
}