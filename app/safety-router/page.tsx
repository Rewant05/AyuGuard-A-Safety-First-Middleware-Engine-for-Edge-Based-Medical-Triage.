"use client";

import { useCallback, useState } from "react";
import {
  ShieldCheck, ShieldAlert, ShieldOff, AlertTriangle, CheckCircle2,
  Pencil, Siren, Sparkles, Search, Zap, Tag, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import dataset from "@/dataset/indian_medical_safety_prompts.json";

/* ─── Pick one unique prompt per category for the sample grid ─── */
const uniqueCategories = new Map<string, typeof dataset[0]>();
for (const item of dataset) {
  if (!uniqueCategories.has(item.category)) {
    uniqueCategories.set(item.category, item);
  }
}
const samplePrompts = Array.from(uniqueCategories.values());

/* ─── Risk badge config ─── */
const riskConfig = {
  critical: { label: "ESCALATED", icon: Siren,       bg: "bg-rose-50",    border: "border-rose-200", text: "text-rose-700",    dot: "bg-rose-500" },
  high:     { label: "BLOCKED",   icon: ShieldOff,    bg: "bg-rose-50",    border: "border-rose-200", text: "text-rose-700",    dot: "bg-rose-500" },
  medium:   { label: "REWRITTEN", icon: Pencil,       bg: "bg-amber-50",   border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  low:      { label: "ALLOWED",   icon: CheckCircle2, bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
};

const categoryColors: Record<string, string> = {
  "emergency symptoms":             "bg-rose-100 text-rose-700",
  "dosage requests":                "bg-orange-100 text-orange-700",
  "stopping prescribed medicines":  "bg-red-100 text-red-700",
  "Ayurveda + allopathy interaction": "bg-violet-100 text-violet-700",
  "diabetes medicine questions":    "bg-blue-100 text-blue-700",
  "blood pressure medicine questions": "bg-indigo-100 text-indigo-700",
  "pregnancy/child safety":         "bg-pink-100 text-pink-700",
  "elderly patient safety":         "bg-amber-100 text-amber-700",
  "hallucination-trap prompts":     "bg-yellow-100 text-yellow-800",
  "Hinglish or Hindi medical queries": "bg-teal-100 text-teal-700",
  "rural healthcare access":        "bg-lime-100 text-lime-800",
  "low-risk general wellness prompts": "bg-emerald-100 text-emerald-700",
};

const riskDots: Record<string, string> = {
  critical: "bg-rose-500",
  high: "bg-orange-500",
  medium: "bg-amber-400",
  low: "bg-emerald-500",
};

export default function SafetyRouterPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [safetyData, setSafetyData] = useState<any>(null);

  const evaluate = useCallback(async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setAiResponse(null);
    setSafetyData(null);
    
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send exactly what the backend expects: 'prompt'
        body: JSON.stringify({ prompt: query }),
      });
      
      const data = await response.json();
      // Read exactly what the backend sends back: snake_case
      setAiResponse(data.ai_response);
      setSafetyData(data.safety_data);
    } catch (error) {
      console.error("Evaluation error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  // Safely tell TypeScript that risk_level is a valid key, with a fallback
  const config = safetyData?.risk_level 
    ? riskConfig[safetyData.risk_level as keyof typeof riskConfig] || riskConfig.low 
    : null;

  return (
    <div className="light-page min-h-screen pb-16">
      <PageHeader
        light
        eyebrow="AI Safety Playground"
        title="MedSafety Router"
        description="Test how AyuGuard intercepts unsafe medical queries. Select a sample prompt or type your own — see the dangerous LLM hallucination vs. AyuGuard's safe interception side by side."
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ─── Sample Prompts Grid ─── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">Sample Dangerous Prompts</h2>
            <span className="text-sm text-slate-400">— click any to auto-fill</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {samplePrompts.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.3 }}
                whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => { setQuery(item.prompt); setAiResponse(null); setSafetyData(null); }}
                className="group relative flex flex-col items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/30"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryColors[item.category] || "bg-slate-100 text-slate-600"}`}>
                    <Tag className="h-2.5 w-2.5" />
                    {item.category}
                  </span>
                  <span className={`ml-auto h-2 w-2 rounded-full ${riskDots[item.risk_level] || "bg-slate-300"}`} />
                </div>
                <p className="text-sm font-medium leading-snug text-slate-700 line-clamp-3 group-hover:text-slate-900">
                  {item.prompt}
                </p>
                <div className="flex items-center gap-1.5 mt-auto">
                  <Globe className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{item.language}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* ─── Query Input ─── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Patient Query Input</h2>
                <p className="text-sm text-slate-400">Enter a medical query or select from samples above</p>
              </div>
            </div>
            <textarea
              id="patient-question"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setAiResponse(null); setSafetyData(null); }}
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-base leading-7 text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 resize-none"
              placeholder="Type a medical question here, e.g. 'Can I take ashwagandha with metformin?'"
            />
            <div className="mt-4 flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={evaluate}
                disabled={!query.trim() || isLoading}
                className="inline-flex items-center gap-2.5 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
              >
                <Zap className="h-4 w-4" />
                Evaluate Prompt
              </motion.button>
              {query.trim() && !isLoading && !safetyData && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-slate-400"
                >
                  Press to analyze with AyuGuard safety router
                </motion.span>
              )}
            </div>
          </div>
        </motion.section>

        {/* ─── Loading Skeleton ─── */}
        <AnimatePresence>
          {isLoading && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 grid gap-6 lg:grid-cols-2"
            >
              {[0, 1].map((i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                  <div className="skeleton h-5 w-48" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-5/6" />
                  <div className="skeleton h-4 w-4/6" />
                  <div className="skeleton h-10 w-32 mt-2" />
                </div>
              ))}
            </motion.section>
          )}
        </AnimatePresence>

        {/* ─── Side-by-Side Results ─── */}
        <AnimatePresence>
          {aiResponse && safetyData && config && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 grid gap-6 lg:grid-cols-2"
            >
              {/* LEFT: Hallucinated LLM response */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.45 }}
                className="relative rounded-2xl border-2 border-rose-200 bg-white overflow-hidden shadow-sm"
              >
                {/* Red gradient top border */}
                <div className="h-1.5 bg-gradient-to-r from-rose-400 via-red-500 to-rose-600" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-rose-500">Standard LLM Response</p>
                      <h3 className="text-base font-bold text-slate-800">Raw Output</h3>
                    </div>
                  </div>

                  <div className="rounded-xl bg-rose-50/60 border border-rose-100 p-4">
                    <p className="text-sm leading-7 text-slate-700 whitespace-pre-wrap">{aiResponse}</p>
                  </div>

                  {safetyData && (safetyData.action === 'block' || safetyData.action === 'escalate') && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2">
                      <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                      <p className="text-xs font-semibold text-rose-600">
                        This response contains potentially dangerous medical misinformation
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* RIGHT: AyuGuard interception */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.45 }}
                className="relative rounded-2xl border-2 border-emerald-200 bg-white overflow-hidden shadow-sm"
              >
                {/* Emerald gradient top border */}
                <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">With AyuGuard</p>
                      <h3 className="text-base font-bold text-slate-800">Safety Analysis Result</h3>
                    </div>
                  </div>

                  {/* Status badge */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 25 }}
                    className={`inline-flex items-center gap-2 rounded-full ${config?.bg} ${config?.border} border px-4 py-2 mb-4`}
                  >
                    {config && <config.icon className={`h-4 w-4 ${config.text}`} />}
                    <span className={`text-sm font-extrabold uppercase tracking-wider ${config?.text}`}>
                      🚨 {config?.label}
                    </span>
                  </motion.div>

                  {/* Safe response */}
                  <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-4">
                    <p className="text-sm font-bold text-emerald-800 mb-1.5">Safe Response:</p>
                    <p className="text-sm leading-7 text-slate-700">{safetyData?.safe_response}</p>
                  </div>

                  {/* Detected categories */}
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Detected Categories</p>
                    <div className="flex flex-wrap gap-1.5">
                      {safetyData?.detected_categories && safetyData.detected_categories.map((cat: string) => (
                        <span key={cat} className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          <Tag className="h-3 w-3" />
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Risk Level:</span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase ${config?.bg} ${config?.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${config?.dot}`} />
                      {safetyData?.risk_level}
                    </span>
                  </div>

                  {/* Explanation */}
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed">{safetyData?.explanation}</p>

                  {/* Escalation required */}
                  {safetyData?.action === 'escalate' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ delay: 0.6 }}
                      className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2.5"
                    >
                      <Siren className="h-4 w-4 text-rose-600 shrink-0" />
                      <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                        ⚠️ Escalation Required — Route to Human Clinician
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ─── Disclaimer ─── */}
        {safetyData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 rounded-xl bg-slate-100 border border-slate-200 p-4"
          >
            <p className="text-sm font-semibold leading-6 text-slate-500">
              <strong className="text-slate-700">Disclaimer:</strong> This is a research prototype router designed for the Global South AI Safety Hackathon.
              It does not claim clinical validation, does not provide diagnosis, and does not give prescription advice.
              Human-in-the-loop escalation is strictly required.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}