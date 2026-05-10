// ============================================================
// HACKATHON LAYOUT WRAPPER — Composition wrapper
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { HackathonNavbar } from "./HackathonNavbar";
import { HackathonFooter } from "./HackathonFooter";
import { MatrixRain } from "@/components/ui/MatrixRain";

export default function HackathonLayout({
  children,
  showNavbar = true,
  showFooter = true,
}: {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}) {
  return (
    <div className="min-h-screen bg-black">
      {/* Background decoratives */}
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"
        aria-hidden="true"
      />
      <MatrixRain className="opacity-[0.03]" speed={0.2} density={6} />

      {showNavbar && <HackathonNavbar />}

      <main className="relative z-10 pt-16">
        {children}
      </main>

      {showFooter && <HackathonFooter />}
    </div>
  );
}