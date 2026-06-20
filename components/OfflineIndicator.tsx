"use client";

import { CloudOff, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof window === "undefined" ? true : window.navigator.onLine
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
        isOnline
          ? "border-teal-200 bg-teal-50 text-teal-800"
          : "border-amber-300 bg-amber-50 text-amber-900"
      }`}
      aria-live="polite"
    >
      {isOnline ? <Wifi className="h-4 w-4" aria-hidden /> : <CloudOff className="h-4 w-4" aria-hidden />}
      {isOnline ? "Offline cache ready" : "Offline mode active"}
    </div>
  );
}
