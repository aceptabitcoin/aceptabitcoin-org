// ============================================================
// PRIZES — Prize display component
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { Prize } from "@/lib/hackathon/editions/types";

export default function Prizes({
  prizes,
  paidInBitcoin,
  currency = "MXN",
  className,
}: {
  prizes: Prize[];
  paidInBitcoin?: boolean;
  currency?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-6 ${className || ""}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {prizes.map((prize, idx) => {
          const icon = prize.place.includes("1") ? "🏆" : prize.place.includes("2") ? "🥈" : prize.place.includes("3") ? "🥉" : "🏅";
          
          return (
            <div key={idx} className="hackathon-card p-5 text-center">
              <div className="text-3xl mb-3">
                {icon}
              </div>
              <div className="font-vt323 text-xl font-bold text-bitcoin mb-1">
                ${prize.amountMXN.toLocaleString()} {currency}
              </div>
              <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                {prize.place} Lugar
              </div>
              <div className="font-mono text-[11px] text-gray-400">
                {prize.description}
              </div>
              {paidInBitcoin && (
                <div className="mt-3 inline-flex items-center gap-1 text-[9px] font-mono text-matrix bg-matrix/5 px-2 py-0.5 rounded-full border border-matrix/20">
                  ⚡ Pagado en Bitcoin
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}