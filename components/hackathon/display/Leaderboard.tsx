// ============================================================
// LEADERBOARD — Team ranking display
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

export default function Leaderboard({
  edition,
  className,
}: {
  edition: any;
  className?: string;
}) {
  const results = [];

  if (edition.results?.winner) results.push({ ...edition.results.winner, rank: 1 });
  if (edition.results?.second) results.push({ ...edition.results.second, rank: 2 });
  if (edition.results?.third) results.push({ ...edition.results.third, rank: 3 });

  if (results.length === 0) return null;

  const rankColors: Record<number, string> = {
    1: "text-yellow-400",
    2: "text-gray-300",
    3: "text-amber-600",
  };

  return (
    <div className={`space-y-4 ${className || ""}`}>
      <h3 className="font-serif text-2xl font-bold text-white text-center">
        <span className="text-bitcoin">❯</span> Clasificación Final
      </h3>
      <div className="hackathon-card p-6 space-y-2">
        {results.map((team) => (
          <div key={team.rank} className="hackathon-leaderboard-row">
            <div className={`hackathon-leaderboard-rank ${rankColors[team.rank]}`}>
              {team.rank === 1 ? "🏆" : team.rank === 2 ? "🥈" : "🥉"}
            </div>
            <div className="hackathon-leaderboard-team">
              <div className="hackathon-leaderboard-name">{team.name}</div>
              <div className="hackathon-leaderboard-members">
                {team.team?.join(", ") || "—"}
              </div>
            </div>
            <div className="hackathon-leaderboard-score text-bitcoin">
              {team.prize}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}