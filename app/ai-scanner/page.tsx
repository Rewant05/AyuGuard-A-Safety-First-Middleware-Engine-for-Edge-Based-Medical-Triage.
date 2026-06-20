import { PageHeader } from "@/components/PageHeader";
import { CameraAnalyzer } from "@/components/CameraAnalyzer";

export const metadata = {
  title: "AI Camera Scanner | AyuGuard Edge",
  description: "Futuristic visual AI analysis for frontline health workers.",
};

export default function AiScannerPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Vision Assistant"
        title="Visual Health Scanner"
        description="Point the camera at the patient. The local AI model will simulate isolating remote photoplethysmography (rPPG) signals to estimate heart rate and visually check for common physical symptoms."
      />
      
      <section className="bg-slate-900 py-10 min-h-[calc(100vh-200px)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <CameraAnalyzer />
          
          <div className="mt-8 rounded-xl border border-teal-900/30 bg-teal-900/10 p-4 text-sm text-teal-200">
            <strong>Prototype Disclaimer:</strong> This is a simulation for the BioMed Bharat prototype. In a real edge device, this would utilize local Small Language Models (SLMs) and computer vision models running offline on the device hardware.
          </div>
        </div>
      </section>
    </>
  );
}
