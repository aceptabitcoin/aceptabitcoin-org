// ============================================================
// SPONSORS GRID — Sponsor display component
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { Sponsor as SponsorType } from "@/lib/hackathon/editions/types";

const ROLE_CONFIG: Record<SponsorType["role"], { label: string; borderColor: string; bgColor: string }> = {
  convocante: {
    label: "ORGANIZADOR",
    borderColor: "border-bitcoin/30",
    bgColor: "bg-bitcoin/5",
  },
  sponsor: {
    label: "SPONSOR",
    borderColor: "border-yellow-400/30",
    bgColor: "bg-yellow-400/5",
  },
  aliado: {
    label: "ALIADO",
    borderColor: "border-cyan-400/30",
    bgColor: "bg-cyan-400/5",
  },
  hub: {
    label: "HUB SEDE",
    borderColor: "border-matrix/30",
    bgColor: "bg-matrix/5",
  },
};

export default function SponsorsGrid({
  sponsors,
  className,
}: {
  sponsors: SponsorType[];
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className || ""}`}>
      {sponsors.map((sponsor, idx) => {
        const config = ROLE_CONFIG[sponsor.role];
        return (
          <a
            key={idx}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`hackathon-card flex flex-col items-center justify-center p-6 border ${config.borderColor} ${config.bgColor} group transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="relative w-full h-12 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity mb-3">
              {/* Logo display would go here with Image component */}
              <span className="font-serif font-bold text-lg text-white group-hover:text-bitcoin transition-colors text-center">
                {sponsor.name}
              </span>
            </div>
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-tighter bg-black/40 px-2 py-0.5 rounded border border-white/5">
              {config.label}
            </span>
          </a>
        );
      })}
    </div>
  );
}