import { FileText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const sections = [
  {
    title: "Project summary",
    body: "AyuGuard Edge is an offline biomedical triage hub for rural primary health centres. It simulates collection of SpO2, pulse, temperature, respiratory rate, blood pressure, and optional glucose readings, stores readings locally, and produces a conservative deterioration risk score for health worker escalation."
  },
  {
    title: "Novelty",
    body: "The prototype combines edge-device framing, longitudinal trend detection, local-first operation, and a safety router that prevents the system from drifting into diagnosis or prescription advice."
  },
  {
    title: "Existing solution comparison",
    body: "Many triage apps rely on cloud access, single-visit forms, or chatbot-style interaction. AyuGuard is positioned as a PHC device workflow: vitals first, longitudinal context second, and human escalation always."
  },
  {
    title: "Clinical safety disclaimer",
    body: "This is a hackathon prototype using simulated data. It is not a certified medical device, has not been clinically validated, and must not be used for diagnosis, prescription, or emergency decision-making without qualified clinician review."
  },
  {
    title: "Future scope",
    body: "Future work can include calibrated sensor integration, multilingual health worker UI, referral network sync, FHIR-compatible exports, clinician audit logs, on-device model validation, and prospective clinical studies."
  },
  {
    title: "References placeholder",
    body: "Add references for national PHC workflows, WHO digital health guidance, validated early warning score literature, device calibration standards, and biomedical safety regulations."
  }
];

export default function DocumentationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Documentation"
        title="Export-ready proposal content"
        description="Use this page as a concise project proposal draft for judges, mentors, and submission forms."
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-teal-700" aria-hidden />
            <h2 className="text-2xl font-extrabold text-slate-950">AyuGuard Edge proposal draft</h2>
          </div>

          <div className="mt-6 space-y-5">
            {sections.map((section) => (
              <article key={section.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-extrabold text-slate-950">{section.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{section.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
