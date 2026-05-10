// ============================================================
// EXPERIENCE TIER — Level-based experience badges
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { cn } from "@/lib/utils";

interface ExperienceTierProps {
  level: "beginner" | "intermediate" | "advanced";
  className?: string;
}

export default function ExperienceTier({ level, className }: ExperienceTierProps) {
  const tiers = {
    beginner: {
      label: "Principiante",
      description: "Nueva en Bitcoin y desarrollo",
      color: "hackathon-badge--participant",
    },
    intermediate: {
      label: "Intermedio",
      description: "Experiencia con APIs y desarrollo",
      color: "hackathon-badge--matrix",
    },
    advanced: {
      label: "Avanzado",
      description: "Desarrollador Bitcoin experimentado",
      color: "hackathon-badge--gold",
    },
  };

  const tier = tiers[level];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className={cn("hackathon-badge", tier.color)}>
        {tier.label}
      </span>
      <span className="font-mono text-xs text-gray-500">
        {tier.description}
      </span>
    </div>
  );
}