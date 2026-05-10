// ============================================================
// RULES SECTION — Hackathon rules and guidelines
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { Gavel, Clock, Users, CheckCircle, Ban } from "lucide-react";

export default function RulesSection({ 
  rules 
}: { 
  rules?: any // Flexible to handle legacy and new structures
}) {
  const allowed = (rules && typeof rules === 'object' && 'allowed' in rules) ? rules.allowed : [
    "Uso de bibliotecas y frameworks de código abierto",
    "Integración con APIs públicas de Bitcoin/Lightning",
    "Código pre-escrito de los participantes",
    "Uso de IAs como herramienta de asistencia (con divulgación)",
    "Colaboración entre equipos",
    "Consulta de documentación y Stack Overflow",
  ];

  const forbidden = (rules && typeof rules === 'object' && 'forbidden' in rules) ? rules.forbidden : [
    "Código propietario o con licencias restrictivas",
    "Uso de IAs generativas como autor principal sin divulgación",
    "Proyectos que violen derechos de autor",
    "Discriminación, acoso o contenido ofensivo",
    "Bots que den ventaja injusta",
    "Trabajo activo previo al hackathon en un proyecto competidor",
  ];

  return (
    <section className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-bold text-white mb-2">
          <span className="text-bitcoin">❯</span> Reglas del Hackathon
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-bitcoin to-matrix mt-2" />
      </div>

      {/* Timeline */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="hackathon-card p-6 text-center">
          <Clock className="h-6 w-6 text-bitcoin mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-white mb-2">Duración</h3>
          <p className="font-mono text-sm text-gray-400">48 horas de desarrollo intensivo. El código debe ser creado durante el evento.</p>
        </div>
        <div className="hackathon-card p-6 text-center">
          <Users className="h-6 w-6 text-matrix mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-white mb-2">Equipos</h3>
          <p className="font-mono text-sm text-gray-400">Máximo 4 personas por equipo. Se aceptan equipos individuales.</p>
        </div>
        <div className="hackathon-card p-6 text-center">
          <Gavel className="h-6 w-6 text-purple-400 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-white mb-2">Licencia</h3>
          <p className="font-mono text-sm text-gray-400">Todos los proyectos deben ser open source con licencia MIT o compatible.</p>
        </div>
      </div>

      {/* Do's and Don'ts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="hackathon-card p-6">
          <h3 className="font-serif text-xl font-bold text-matrix mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" /> Se Permite
          </h3>
          <ul className="space-y-3">
            {allowed.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 font-mono text-sm text-gray-300">
                <CheckCircle className="h-4 w-4 text-matrix flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="hackathon-card p-6">
          <h3 className="font-serif text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
            <Ban className="h-5 w-5" /> No Se Permite
          </h3>
          <ul className="space-y-3">
            {forbidden.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 font-mono text-sm text-gray-300">
                <Ban className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Evaluation Criteria */}
      <div className="hackathon-card p-6">
        <h3 className="font-serif text-xl font-bold text-white mb-6 text-center">
          Criterios de Evaluación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: "Innovación", weight: "25%", icon: "💡", desc: "Originalidad y creatividad" },
            { label: "Complejidad Técnica", weight: "25%", icon: "⚙️", desc: "Profundidad técnica y desafío" },
            { label: "Relevancia Bitcoin", weight: "25%", icon: "₿", desc: "Alineación con el ecosistema Bitcoin" },
            { label: "Presentación", weight: "10%", icon: "🎤", desc: "Claridad y demostración" },
            { label: "Completitud", weight: "15%", icon: "✅", desc: "Funcionalidad del producto" },
          ].map((criterion, idx) => (
            <div key={idx} className="text-center p-4 rounded-lg bg-black/50 border border-white/5">
              <div className="text-2xl mb-2">{criterion.icon}</div>
              <div className="font-vt323 text-xl font-bold text-bitcoin">{criterion.weight}</div>
              <div className="font-mono text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{criterion.label}</div>
              <div className="font-mono text-[9px] text-gray-600 mt-1">{criterion.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}