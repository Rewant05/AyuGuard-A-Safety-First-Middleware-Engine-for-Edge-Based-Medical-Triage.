import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "AyuGuard Edge",
  description: "Offline biomedical triage and deterioration-alert hub for rural primary health centres.",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
