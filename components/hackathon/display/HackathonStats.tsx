// ============================================================
// HACKATHON STATS — Key metrics display
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { HackathonEdition } from "@/lib/hackathon/editions/types";

export default function HackathonStats({ 
  edition 
}: { 
  edition: HackathonEdition 
}) {
  const metrics = edition.metrics || {
    totalProjects: 0,
    totalParticipants: 0,
    lightningTransactions: 0,
    mediaMentions: 0,
  };

  const items = [
    { value: metrics.totalProjects, label: "Proyectos", icon: "🏗️", color: "text-bitcoin" },
    { value: metrics.totalParticipants, label: "Participantes", icon: "👥", color: "text-matrix" },
    { value: metrics.lightningTransactions, label: "Txs Lightning", icon: "⚡", color: "text-bitcoin" },
    { value: metrics.mediaMentions, label: "Medios", icon: "📰", color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="hackathon-card p-6 flex flex-col items-center justify-center">
          <div className={`flex items-center justify-center gap-1.5 mb-1 ${item.color}`}>
            <span className="text-xl">{item.icon}</span>
            <span className="font-vt323 text-2xl md:text-3xl font-bold">
              {item.value.toLocaleString()}
            </span>
          </div>
          <div className="font-mono text-[10px] md:text-[11px] text-gray-500 uppercase tracking-wider text-center">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}