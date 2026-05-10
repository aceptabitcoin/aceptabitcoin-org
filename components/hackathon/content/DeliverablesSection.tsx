import { CheckCircle2, Zap } from "lucide-react";
import type { Deliverable } from "@/lib/hackathon/editions/types";

interface DeliverablesSectionProps {
  deliverables: Deliverable[];
}

export default function DeliverablesSection({ deliverables }: DeliverablesSectionProps) {
  return (
    <section className="py-12 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-bitcoin/10 rounded-lg border border-bitcoin/30">
          <Zap className="w-6 h-6 text-bitcoin" />
        </div>
        <h2 className="font-serif text-3xl text-white">
          Entregables <span className="text-bitcoin text-lg font-mono">// Objetivos</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mandatorios */}
        <div className="space-y-4">
          <h3 className="font-vt323 text-xl text-matrix border-b border-matrix/30 pb-2 mb-4">
            🚩 MÍNIMO VIABLE (OBLIGATORIO)
          </h3>
          <ul className="space-y-3">
            {deliverables.filter(d => d.isMandatory).map((item, idx) => (
              <li 
                key={idx} 
                className="flex items-start gap-3 bg-matrix/5 p-4 rounded-lg border border-matrix/10 hover:border-matrix/40 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-matrix shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold text-sm block mb-1">{item.title}</span>
                  <span className="text-gray-400 text-xs font-mono">{item.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bonus */}
        <div className="space-y-4">
          <h3 className="font-vt323 text-xl text-bitcoin border-b border-bitcoin/30 pb-2 mb-4">
            🚀 PUNTOS EXTRA (BONUS)
          </h3>
          <ul className="space-y-3">
            {deliverables.filter(d => !d.isMandatory).map((item, idx) => (
              <li 
                key={idx} 
                className="flex items-start gap-3 bg-bitcoin/5 p-4 rounded-lg border border-bitcoin/10 hover:border-bitcoin/40 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-bitcoin/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-bitcoin text-xs font-bold">+</span>
                </div>
                <div>
                  <span className="text-white font-bold text-sm block mb-1">{item.title}</span>
                  <span className="text-gray-400 text-xs font-mono">{item.description}</span>
                  {item.bonus && (
                    <span className="text-bitcoin text-[10px] font-mono block mt-1">
                      {item.bonus}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
