"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { NewPatientModal } from "./NewPatientModal";
import { useRouter } from "next/navigation";

export function DashboardHeaderActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="focus-ring inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-500/20 transition hover:from-teal-400 hover:to-cyan-500 active:scale-95"
      >
        <UserPlus className="h-4 w-4" />
        Register New Patient
      </button>

      <NewPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          // Refresh the page data
          router.refresh();
        }}
      />
    </>
  );
}
