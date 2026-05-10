// ============================================================
// PREVIOUS WINNERS — Display results from past editions
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { HackathonEdition, CompetitionResult } from "@/lib/hackathon/editions/types";

export default function PreviousWinners({
  winners,
  className,
}: {
  winners: CompetitionResult[];
  className?: string;
}) {
  if (!winners || winners.length === 0) return null;
  const winnerConfig = [
    {
      label: "Primer Lugar",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/30",
      icon: "🏆"
    },
    {
      label: "Segundo Lugar",
      color: "text-gray-300",
      bgColor: "bg-gray-300/10",
      borderColor: "border-gray-300/30",
      icon: "🥈"
    },
    {
      label: "Tercer Lugar",
      color: "text-amber-600",
      bgColor: "bg-amber-600/10",
      borderColor: "border-amber-600/30",
      icon: "🥉"
    },
    {
      label: "Mención",
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      borderColor: "border-cyan-400/30",
      icon: "🏅"
    }
  ];

  return (
    <div className={`space-y-6 ${className || ""}`}>
      <h3 className="font-serif text-2xl font-bold text-white text-center">
        Cuadro de Honor
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {winners.map((winner, idx) => {
          const config = winnerConfig[idx] || winnerConfig[3];
          
          return (
            <div
              key={idx}
              className={`hackathon-card p-6 text-center border ${config.borderColor} ${config.bgColor}`}
            >
              <div className={`font-vt323 text-4xl font-bold ${config.color} mb-1`}>
                {winner.prize}
              </div>
              <div className="text-2xl mb-2">{config.icon}</div>
              <h4 className={`font-serif text-lg font-bold ${config.color} mb-1`}>
                {winner.name}
              </h4>
              <p className="font-mono text-xs text-gray-400 mb-3">
                {winner.team.join(", ")}
              </p>
              <p className="font-mono text-[11px] text-gray-500 leading-relaxed">
                {winner.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}