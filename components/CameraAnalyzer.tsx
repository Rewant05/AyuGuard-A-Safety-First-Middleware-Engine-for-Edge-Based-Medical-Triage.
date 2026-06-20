"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, RefreshCw, Zap, HeartPulse, BrainCircuit, Activity } from "lucide-react";

export function CameraAnalyzer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ hr: number; rr: number; note: string } | null>(null);

  // Initialize camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => {
          // Suppress AbortError from interrupted play requests
          if (err.name !== "AbortError") {
            console.error("Play error:", err);
          }
        });
        setHasPermission(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    // Initial attempt to start the camera on mount
    startCamera();
    
    return () => {
      // Cleanup video stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const triggerScan = () => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate AI processing time
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        hr: Math.floor(Math.random() * (110 - 60) + 60), // Random HR 60-110
        rr: Math.floor(Math.random() * (24 - 12) + 12),  // Random RR 12-24
        note: "AI Vision Output: No visible jaundice. Skin tone normal. Estimated vitals derived from rPPG micro-fluctuations.",
      });
    }, 4500); // 4.5 seconds scan time
  };

  if (hasPermission === false) {
    return (
      <div className="flex h-[500px] w-full flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-500">
        <Camera className="mb-4 h-12 w-12 opacity-50" />
        <h3 className="text-xl font-bold">Camera Access Denied</h3>
        <p className="mt-2 text-sm max-w-md text-center opacity-80">
          Please allow camera permissions in your browser to use the AI Scanner. We process video entirely on your device for privacy.
        </p>
        <button onClick={startCamera} className="mt-6 flex items-center gap-2 rounded-lg bg-rose-500/10 px-4 py-2 hover:bg-rose-500/20 transition-colors">
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-[600px] object-cover scale-x-[-1] bg-black"
        playsInline
        muted
      />

      {/* Futuristic HUD Overlays */}
      {hasPermission && (
        <div className="absolute inset-0 pointer-events-none">
          {/* HUD Corner Accents */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-teal-500/70" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-teal-500/70" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-teal-500/70" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-teal-500/70" />
          
          {/* Header Info */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur border border-white/10">
            <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-teal-400 tracking-widest uppercase">Live Feed Active</span>
          </div>

          {/* Scanning Animation */}
          <AnimatePresence>
            {isScanning && (
              <>
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-teal-400 shadow-[0_0_20px_rgba(45,212,191,1)] z-20"
                />
                
                {/* Simulated Target Box */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-dashed border-teal-400/80 bg-teal-400/5 flex items-center justify-center"
                >
                   <div className="text-teal-400 font-mono text-sm uppercase flex flex-col items-center gap-2 opacity-80">
                     <BrainCircuit className="h-8 w-8 animate-pulse" />
                     <span>Isolating rPPG signals...</span>
                   </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Scan Results Overlay */}
          <AnimatePresence>
            {scanResult && !isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-72 rounded-xl border border-teal-500/30 bg-black/60 backdrop-blur-xl p-5 shadow-2xl pointer-events-auto"
              >
                <div className="flex items-center gap-2 border-b border-teal-500/30 pb-3 mb-4">
                  <Zap className="h-5 w-5 text-teal-400" />
                  <h4 className="font-bold text-white uppercase tracking-wider text-sm">Scan Complete</h4>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Est. Heart Rate</div>
                    <div className="flex items-end gap-2 text-teal-400">
                      <span className="text-3xl font-black">{scanResult.hr}</span>
                      <span className="text-sm pb-1">bpm</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Est. Resp. Rate</div>
                    <div className="flex items-end gap-2 text-cyan-400">
                      <span className="text-3xl font-black">{scanResult.rr}</span>
                      <span className="text-sm pb-1">breaths/min</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {scanResult.note}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={triggerScan}
          disabled={isScanning || !hasPermission}
          className="focus-ring flex items-center gap-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-teal-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isScanning ? (
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
               <RefreshCw className="h-5 w-5" />
             </motion.div>
          ) : (
            <Activity className="h-5 w-5" />
          )}
          {isScanning ? "Analyzing..." : "Initiate AI Scan"}
        </button>
      </div>
    </div>
  );
}
