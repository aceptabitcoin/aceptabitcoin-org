// ============================================================
// TIMELINE — Hackathon timeline display
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { TimelineItem as TimelineItemType } from "@/lib/hackathon/editions/types";

interface TimelineItemProps {
  step: string;
  title: string;
  description: string;
  date?: string;
  status: "completed" | "upcoming" | "pending" | "current";
}

function TimelineItem({ step, title, description, date, status }: TimelineItemProps) {
  const statusConfig = {
    completed: { color: "text-matrix", bg: "bg-matrix/10", border: "border-matrix/30", icon: "✅" },
    upcoming: { color: "text-bitcoin", bg: "bg-bitcoin/10", border: "border-bitcoin/30", icon: "🔜" },
    pending: { color: "text-gray-500", bg: "bg-white/5", border: "border-white/10", icon: "○" },
    current: { color: "text-matrix", bg: "bg-matrix/5", border: "border-matrix/50", icon: "🔵" },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center pt-1">
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${config.bg} ${config.border} ${config.color}`}
        >
          {config.icon}
        </div>
        <div className="w-[2px] flex-1 bg-gradient-to-b from-matrix/20 to-transparent mt-1" />
      </div>
      <div className="pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-mono text-sm font-bold ${config.color}`}>{step}. {title}</span>
          {status === "current" && (
            <span className="text-[8px] font-mono bg-matrix/20 text-matrix px-1.5 py-0.5 rounded-full animate-pulse">
              ACTIVO
            </span>
          )}
        </div>
        <div className="font-mono text-xs text-gray-400 mb-1">{description}</div>
        {date && (
          <div className="font-mono text-[11px] text-gray-500">
            {date}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Timeline({
  items,
  className,
}: {
  items: TimelineItemType[];
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className || ""}`}>
      <div className="hackathon-card p-6">
        <h3 className="font-serif text-lg font-bold text-white mb-6 text-center">
          Línea del Tiempo
        </h3>
        <div className="md:ml-4 space-y-0">
          {items.map((item, idx) => {
            // Simple status logic for now
            let status: "completed" | "upcoming" | "pending" | "current" = "upcoming";
            if (idx === 0) status = "completed"; // Mocking for now
            
            return (
              <TimelineItem 
                key={idx} 
                step={item.step}
                title={item.title}
                description={item.description}
                date={item.date}
                status={status} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}