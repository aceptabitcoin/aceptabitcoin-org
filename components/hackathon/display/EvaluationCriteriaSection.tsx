import type { EvaluationCriterion } from "@/lib/hackathon/editions/types";

interface EvaluationCriteriaSectionProps {
  criteria: EvaluationCriterion[];
}

export default function EvaluationCriteriaSection({ criteria }: EvaluationCriteriaSectionProps) {
  return (
    <section className="py-12 space-y-6">
      <div className="mb-8">
        <h2 className="font-serif text-3xl text-white">
          Criterios de Evaluación <span className="text-cyan-400 text-lg font-mono">// Scorecard</span>
        </h2>
        <p className="text-gray-400 text-sm font-mono mt-2">¿Cómo determinamos al ganador?</p>
      </div>

      <div className="space-y-6">
        {criteria.map((criterion, idx) => {
          // Extraer el número del peso para el ancho de la barra (ej: "35%" -> 35)
          const weightValue = parseInt(criterion.weight) || 0;
          
          return (
            <div key={idx} className="group">
              <div className="flex justify-between items-end mb-2 font-mono">
                <h4 className="text-white text-lg font-bold">{criterion.criterion}</h4>
                <span className="text-bitcoin text-xl font-vt323">{criterion.weight}</span>
              </div>
              
              <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-600 to-matrix transition-all duration-1000 ease-out group-hover:shadow-[0_0_15px_rgba(0,255,65,0.5)]"
                  style={{ width: `${weightValue}%` }}
                />
              </div>
              
              <p className="text-gray-500 text-xs mt-2 pl-1 border-l-2 border-cyan-500/30">
                {criterion.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
