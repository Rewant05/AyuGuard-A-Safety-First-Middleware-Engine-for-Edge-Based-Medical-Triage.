"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types for the form fields you want to update
interface VoiceDictationProps {
  onVitalsExtracted: (vitals: {
    temperatureC?: string;
    heartRate?: string;
    spo2?: string;
    systolicBp?: string;
  }) => void;
}

export function VoiceDictation({ onVitalsExtracted }: VoiceDictationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError("Browser does not support voice input.");
    }
  }, []);

  const startListening = () => {
    setError(null);
    setTranscript("");
    
    // @ts-ignore - TypeScript doesn't natively know webkitSpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Set to Indian region to handle Hinglish natively
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setError("Failed to hear you. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
      processTranscript(transcript);
    };

    recognition.start();
  };

  // This is the magic Hackathon parser!
  const processTranscript = (text: string) => {
    if (!text) return;

    const textLower = text.toLowerCase();
    const extracted: any = {};

    // Match "Bukhar 38" or "Temperature is 38.5"
    const tempMatch = textLower.match(/(?:temperature|bukhar|temp|tapman).*\s(\d{2,3}(?:\.\d)?)/);
    if (tempMatch) extracted.temperatureC = tempMatch[1];

    // Match "Heart rate 110" or "Pulse 110" or "Dharkan 110"
    const hrMatch = textLower.match(/(?:heart rate|pulse|dharkan).*\s(\d{2,3})/);
    if (hrMatch) extracted.heartRate = hrMatch[1];

    // Match "Oxygen 95" or "SpO2 95"
    const spo2Match = textLower.match(/(?:oxygen|spo2|o2).*\s(\d{2,3})/);
    if (spo2Match) extracted.spo2 = spo2Match[1];

    // Match "BP 120" or "Blood pressure 120" (Just grabbing systolic for the demo)
    const bpMatch = textLower.match(/(?:bp|blood pressure|pressure).*\s(\d{2,3})/);
    if (bpMatch) extracted.systolicBp = bpMatch[1];

    // Send the extracted numbers back to your main form
    if (Object.keys(extracted).length > 0) {
      onVitalsExtracted(extracted);
    }
  };

  return (
    <div className="mb-6 rounded-2xl bg-teal-50 border border-teal-100 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-teal-900">Voice Intake (Hinglish Supported)</h3>
          <p className="text-xs text-teal-700 mt-1">
            Try saying: "Patient ka bukhar 38 hai aur heart rate 110 hai."
          </p>
        </div>

        <button
          onClick={isListening ? undefined : startListening}
          className={`relative shrink-0 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${
            isListening 
              ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]' 
              : 'bg-teal-600 text-white hover:bg-teal-500 hover:shadow-md'
          }`}
        >
          {isListening ? (
            <>
              <motion.div 
                animate={{ scale: [1, 1.3, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-full bg-rose-400 opacity-40"
              />
              <Loader2 className="h-6 w-6 animate-spin relative z-10" />
            </>
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Live Transcription Display */}
      <AnimatePresence>
        {transcript && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 rounded-xl bg-white p-3 text-sm italic text-slate-600 border border-teal-100"
          >
            "{transcript}"
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-2 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}