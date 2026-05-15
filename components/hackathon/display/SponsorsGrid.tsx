// ============================================================
// SPONSORS GRID — Sponsor display component
// Acepta Bitcoin México | Oracle System v2.0
// Design System: "Bitcoin Matrix" v2.0
// ============================================================

import { cn } from "@/lib/utils";
import { Sponsor as SponsorType } from "@/lib/hackathon/editions/types";

// 🎨 Role config alineado con Design System "Bitcoin Matrix" v2.0
const ROLE_CONFIG: Record<
  SponsorType["role"],
  {
    label: string;
    borderColor: string;
    bgColor: string;
    textColor: string;
    glow: string;
  }
> = {
  convocante: {
    label: "ORGANIZADOR",
    borderColor: "border-bitcoin/50",
    bgColor: "bg-bitcoin/10",
    textColor: "text-bitcoin",
    glow: "hover:shadow-[0_0_25px_rgba(247,147,26,0.5)]", // DS Glow estándar naranja
  },
  sponsor: {
    label: "SPONSOR",
    borderColor: "border-bitcoin/30",
    bgColor: "bg-bitcoin/5",
    textColor: "text-bitcoin",
    glow: "hover:shadow-[0_0_20px_rgba(247,147,26,0.4)]",
  },
  aliado: {
    label: "ALIADO",
    borderColor: "border-matrix/30", // ✅ DS: evitar cyan, usar Matrix Green
    bgColor: "bg-matrix/5",
    textColor: "text-matrix",
    glow: "hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]", // DS Glow estándar verde
  },
  hub: {
    label: "HUB",
    borderColor: "border-matrix/30",
    bgColor: "bg-matrix/5",
    textColor: "text-matrix",
    glow: "hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]",
  },
  "hub-presencial": {
    label: "SEDE",
    borderColor: "border-matrix/50",
    bgColor: "bg-matrix/10",
    textColor: "text-matrix",
    glow: "hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]",
  },
};

interface SponsorCardProps {
  sponsor: SponsorType;
}

function SponsorCard({ sponsor }: SponsorCardProps) {
  const config = ROLE_CONFIG[sponsor.role];

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        // Glassmorphism "Bunker" DS
        "relative flex flex-col items-center justify-center p-6 rounded-xl",
        "bg-black/80 backdrop-blur-md border transition-all duration-300",
        config.borderColor,
        config.bgColor,
        config.glow,
        "group hover:scale-[1.02] hover:border-white/30"
      )}
    >
      {/* Featured badge — solo para sponsors destacados */}
      {sponsor.featured && (
        <span className="absolute -top-2 -right-2 text-[9px] font-mono bg-bitcoin text-black px-1.5 py-0.5 rounded-full border border-bitcoin/50 animate-pulse">
          ★
        </span>
      )}

      {/* Logo / Nombre */}
      <div className="relative w-full h-14 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity mb-3">
        {sponsor.logo ? (
          // 🖼️ Placeholder para componente Image de Next.js
          // <Image src={sponsor.logo} alt={sponsor.name} fill className="object-contain" />
          <span className="font-serif font-bold text-base text-[#FAFAFA] group-hover:text-bitcoin transition-colors text-center line-clamp-2">
            {sponsor.name}
          </span>
        ) : (
          <span className="font-serif font-bold text-base text-[#FAFAFA] group-hover:text-bitcoin transition-colors text-center line-clamp-2">
            {sponsor.name}
          </span>
        )}
      </div>

      {/* Role label — font-mono, DS colors */}
      <span
        className={cn(
          "font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border",
          config.textColor,
          sponsor.role === "convocante" || sponsor.role === "hub-presencial"
            ? "border-white/30 bg-black/40"
            : "border-white/10 bg-black/30"
        )}
      >
        {config.label}
      </span>

      {/* Dirección para hubs presenciales */}
      {sponsor.address && (
        <span className="font-mono text-[9px] text-gray-500 mt-2 text-center max-w-[180px] line-clamp-2">
          {sponsor.address}
        </span>
      )}

      {/* Corner accent — Matrix Green subtle */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-matrix/20 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-matrix/20 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

export default function SponsorsGrid({
  sponsors,
  className,
  title = "Colaboradores",
}: {
  sponsors: SponsorType[];
  className?: string;
  title?: string;
}) {
  // Separar sponsors por rol para orden visual (convocantes primero)
  const sortedSponsors = [...sponsors].sort((a, b) => {
    const order: SponsorType["role"][] = [
      "convocante",
      "hub-presencial",
      "hub",
      "sponsor",
      "aliado",
    ];
    return order.indexOf(a.role) - order.indexOf(b.role);
  });

  return (
    <section className={cn("py-8", className)}>
      {/* Header opcional */}
      {title && (
        <h3 className="font-serif text-lg font-bold text-white mb-6 text-center">
          {title}
        </h3>
      )}

      {/* Grid responsivo */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedSponsors.map((sponsor, idx) => (
          <SponsorCard
            key={`${sponsor.name}-${idx}`} // 🔑 Key único para evitar warnings
            sponsor={sponsor}
          />
        ))}
      </div>
    </section>
  );
}