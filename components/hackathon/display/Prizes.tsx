// components/hackathon/display/Prizes.tsx
// Alineado con: Design System "Bitcoin Matrix" v2.0 + types.ts v2.0
import { Trophy, Gift, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prize } from "@/lib/hackathon/editions/types";

export default function Prizes({
  prizes,
  paidInBitcoin = false,
  className,
}: {
  prizes: Prize[];
  paidInBitcoin?: boolean;
  className?: string;
}) {
  // 🎨 Helper: Extrae estilos del Prize o usa fallbacks (backward compatibility)
  const getPrizeClasses = (prize: Prize, index: number) => {
    // Fallbacks por índice (solo si prize no trae dsColor/glow)
    const fallbacks = [
      { color: "text-bitcoin", glow: "hover:shadow-[0_0_20px_rgba(247,147,26,0.4)]", border: "border-bitcoin/30", bg: "bg-bitcoin/5" },
      { color: "text-matrix", glow: "hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]", border: "border-matrix/30", bg: "bg-matrix/5" },
      { color: "text-gray-300", glow: "hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]", border: "border-white/20", bg: "bg-white/5" },
    ];
    const fallback = fallbacks[index] ?? fallbacks[2];

    return {
      color: prize.dsColor ?? fallback.color,
      glow: prize.glow ?? fallback.glow,
      border: prize.dsColor?.includes("bitcoin") ? "border-bitcoin/30" 
              : prize.dsColor?.includes("matrix") ? "border-matrix/30" 
              : "border-white/20",
      bg: prize.dsColor?.includes("bitcoin") ? "bg-bitcoin/5" 
              : prize.dsColor?.includes("matrix") ? "bg-matrix/5" 
              : "bg-white/5",
    };
  };

  const formatAmount = (amountMXN: number) => {
    return new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amountMXN);
  };

  return (
    <section className={cn("py-20", className)}>
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-matrix/10 border border-matrix/30 rounded-full">
          <Trophy className="h-3.5 w-3.5 text-matrix animate-pulse" />
          <span className="font-mono text-[10px] text-matrix uppercase tracking-[0.2em]">
            Recompensas Oficiales
          </span>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">
          Premios & <span className="text-bitcoin drop-shadow-[0_0_25px_rgba(247,147,26,0.4)]">Impacto Real</span>
        </h2>
        <p className="font-mono text-sm text-gray-400 max-w-2xl mx-auto">
          Construye, compite y escala. El reconocimiento económico es solo el inicio.
        </p>
      </div>

      {/* Main Prize Tiers */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {prizes.slice(0, 3).map((prize, idx) => {
          const style = getPrizeClasses(prize, idx);
          return (
            <div
              key={`${prize.place}-${idx}`}
              className={cn(
                "relative group p-6 rounded-xl border backdrop-blur-md transition-all duration-300",
                style.bg,
                style.border,
                style.glow
              )}
            >
              {/* Corner Accents — Matrix Green subtle */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-matrix/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-tl-lg" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-matrix/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-br-lg" />

              <div className="flex items-center justify-between mb-4">
                <Trophy className={cn("h-7 w-7", style.color)} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  {prize.place}
                </span>
              </div>

              <div className="space-y-1">
                <span className={cn("font-serif text-4xl md:text-5xl font-bold", style.color)}>
                  ${formatAmount(prize.amountMXN)}
                </span>
                <p className="font-mono text-xs text-gray-400">
                  {paidInBitcoin ? "BTC • Transferencia inmediata" : "MXN • Transferencia bancaria"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Prizes & ArcadiaB Impulse */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Merch & Hardware — Glassmorphism Bunker */}
        <div className="p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl transition-all hover:border-white/20">
          <h3 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5 text-matrix" /> Merch & Hardware
          </h3>
          <ul className="font-mono text-sm text-gray-400 space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-matrix mt-0.5">▹</span> Camisetas & Stickers exclusivos edición limitada
            </li>
            <li className="flex items-start gap-3">
              <span className="text-matrix mt-0.5">▹</span> Hardware Wallets <span className="text-bitcoin font-bold">(Trezor)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-matrix mt-0.5">▹</span> Kits de desarrollo (Node Starter + Librerías BDK)
            </li>
          </ul>
        </div>

        {/* ArcadiaB Industry Impulse — Bitcoin Orange accent */}
        <div className="p-6 bg-bitcoin/5 backdrop-blur-md border border-bitcoin/30 rounded-xl relative overflow-hidden transition-all hover:border-bitcoin/50 hover:shadow-[0_0_30px_rgba(247,147,26,0.15)]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-bitcoin/10 blur-3xl rounded-full pointer-events-none" />
          
          <h3 className="font-serif text-xl text-white mb-4 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-bitcoin" /> Impulso ArcadiaB
          </h3>
          <p className="font-mono text-sm text-gray-300 leading-relaxed mb-4">
            Si tu proyecto es <span className="text-bitcoin font-bold">viable para la industria Bitcoin</span>, 
            ArcadiaB lo impulsará directamente con:
          </p>
          <ul className="font-mono text-sm text-gray-400 space-y-2 mb-4">
            <li className="flex items-start gap-3">
              <span className="text-bitcoin mt-0.5">⚡</span> Mentoría técnica & producto
            </li>
            <li className="flex items-start gap-3">
              <span className="text-bitcoin mt-0.5">⚡</span> Seed funding & acceso a partners institucionales
            </li>
            <li className="flex items-start gap-3">
              <span className="text-bitcoin mt-0.5">⚡</span> Integración real en el ecosistema soberano
            </li>
          </ul>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-bitcoin/10 border border-bitcoin/30 rounded-full">
            <span className="font-mono text-[10px] text-bitcoin uppercase tracking-wider">Eco-system Grant</span>
          </div>
        </div>
      </div>
    </section>
  );
}