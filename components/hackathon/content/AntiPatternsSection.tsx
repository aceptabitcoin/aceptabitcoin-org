import { AlertTriangle, ShieldAlert } from "lucide-react";

interface AntiPatternsSectionProps {
  antiPatterns: string[];
}

export default function AntiPatternsSection({ antiPatterns }: AntiPatternsSectionProps) {
  return (
    <section className="py-12">
      <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-6 md:p-8 relative overflow-hidden">
        {/* Efecto Scanline Rojo sutil */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiAvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwwLDAsMC4wNSkiIC8+Cjwvc3ZnPg==')] opacity-30 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/40 animate-pulse">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="font-serif text-3xl text-white">
              Anti-Patrones <span className="text-red-500 text-lg font-mono">// SYSTEM WARNING</span>
            </h2>
          </div>

          <p className="text-red-200/70 font-mono mb-6 text-sm">
            ⚠️ La siguiente lista contiene acciones que bajarán tu puntuación inmediatamente o descalificarán tu participación.
          </p>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {antiPatterns.map((pattern, idx) => (
              <li 
                key={idx} 
                className="flex items-start gap-3 text-red-200 text-sm font-mono bg-black/40 p-4 rounded border border-red-900/50"
              >
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{pattern.replace(/❌\s?/, "")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
