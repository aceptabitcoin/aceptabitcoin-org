// ============================================================
// TIMELINE — Hackathon timeline display
// Acepta Bitcoin México | Oracle System v2.0
// Design System: "Bitcoin Matrix" v2.0
// ============================================================

import { cn } from "@/lib/utils";
import { TimelineItem as TimelineItemType } from "@/lib/hackathon/editions/types";

interface TimelineItemProps {
  step: string;
  title: string;
  description: string;
  date?: string;
  location?: string;
  status: "completed" | "upcoming" | "pending" | "current";
}

function TimelineItem({ step, title, description, date, location, status }: TimelineItemProps) {
  // 🎨 Config de estados alineado con Design System
  const statusConfig = {
    completed: { 
      color: "text-matrix", 
      bg: "bg-matrix/10", 
      border: "border-matrix/30", 
      glow: "",
      icon: "✅",
      label: "Completado"
    },
    current: { 
      color: "text-bitcoin", 
      bg: "bg-bitcoin/10", 
      border: "border-bitcoin/50", 
      glow: "shadow-[0_0_20px_rgba(247,147,26,0.4)]", // DS Glow estándar
      icon: "🔵",
      label: "En curso"
    },
    upcoming: { 
      color: "text-gray-300", 
      bg: "bg-white/5", 
      border: "border-white/20", 
      glow: "",
      icon: "○",
      label: "Próximo"
    },
    pending: { 
      color: "text-gray-500", 
      bg: "bg-white/5", 
      border: "border-white/10", 
      glow: "",
      icon: "○",
      label: "Pendiente"
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-start gap-4 group">
      {/* Timeline node + connector */}
      <div className="flex flex-col items-center pt-1">
        <div
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-all duration-300",
            config.bg,
            config.border,
            config.color,
            config.glow
          )}
        >
          {config.icon}
        </div>
        {/* Connector line — Matrix Green gradient, hide on last item */}
        <div className="w-[2px] flex-1 bg-gradient-to-b from-matrix/20 to-transparent mt-1 group-last:hidden" />
      </div>
      
      {/* Content */}
      <div className="pb-6 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={cn("font-mono text-sm font-bold", config.color)}>
            {step}. {title}
          </span>
          {status === "current" && (
            <span className="text-[8px] font-mono bg-bitcoin/20 text-bitcoin px-1.5 py-0.5 rounded-full animate-pulse border border-bitcoin/30">
              ACTIVO
            </span>
          )}
          {status === "completed" && (
            <span className="text-[8px] font-mono bg-matrix/20 text-matrix px-1.5 py-0.5 rounded-full border border-matrix/30">
              {config.label}
            </span>
          )}
        </div>
        
        <p className="font-mono text-xs text-gray-400 mb-1 leading-relaxed">
          {description}
        </p>
        
        {/* Metadata: date + location */}
        <div className="flex flex-wrap items-center gap-3">
          {date && (
            <span className="font-mono text-[11px] text-gray-500 flex items-center gap-1">
              📅 {date}
            </span>
          )}
          {location && (
            <span className="font-mono text-[11px] text-matrix/80 flex items-center gap-1">
              📍 {location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Timeline({
  items,
  editionDates,
  className,
}: {
  items: TimelineItemType[];
  editionDates?: {
    start: string;      // ISO 8601: "2026-06-05T09:00:00-06:00"
    end: string;
    timezone: string;   // "America/Mexico_City"
  };
  className?: string;
}) {
  // 🧠 Helper: Calcula estado real basado en fechas de la edición
  const calculateStatus = (
    itemDate: string | undefined, 
    index: number, 
    totalItems: number
  ): "completed" | "upcoming" | "pending" | "current" => {
    
    // Fallback si no hay fechas (para ediciones legacy o testing)
    if (!editionDates) {
      if (index === 0) return "completed";
      if (index === 1) return "current";
      return "upcoming";
    }

    const now = new Date();
    const eventStart = new Date(editionDates.start);
    const eventEnd = new Date(editionDates.end);
    
    // 🟡 Evento aún no comienza
    if (now < eventStart) {
      return index === 0 ? "upcoming" : "pending";
    }
    
    // 🟢 Evento en progreso (lógica simplificada para demo)
    if (now >= eventStart && now <= eventEnd) {
      if (index === 0) return "completed";
      if (index === 1) return "current";
      return "upcoming";
    }
    
    // ✅ Evento finalizado
    if (now > eventEnd) {
      return "completed";
    }
    
    return "upcoming";
  };

  return (
    <section className={cn("py-8", className)}>
      <div className={cn(
        "rounded-xl border backdrop-blur-md transition-all duration-300",
        "bg-black/80 border-white/10" // Glassmorphism "Bunker" DS
      )}>
        <div className="p-6">
          <h3 className="font-serif text-lg font-bold text-white mb-6 text-center">
            Línea del Tiempo
          </h3>
          
          <div className="md:ml-4 space-y-0">
            {items.map((item, idx) => {
              const status = calculateStatus(item.date, idx, items.length);
              
              return (
                <TimelineItem 
                  key={`${item.step}-${idx}`} // 🔑 Key único para evitar warnings
                  step={item.step}
                  title={item.title}
                  description={item.description}
                  date={item.date}
                  location={item.location} // 📍 Soporte para sede física/remota
                  status={status} 
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}