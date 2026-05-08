"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Activity, RefreshCw, Bitcoin, TrendingUp, TrendingDown, Minus, ExternalLink, HelpCircle } from "lucide-react";
import { useMarketMood } from "@/hooks/useMarketMood";
import { formatPrice } from "@/lib/market/binance";

// ============================================================
// DCA QUALITY SIGNAL — Bitcoin Matrix Edition v3.0 (Educational)
// Oracle System • Enfoque DCA para ahorradores principiantes
// Compliance: design-system.md, MANTENIMIENTO.md
// ============================================================

// 🔹 TIMEFRAME FIJO: Solo 4H para evitar confusión en estudiantes
const DEFAULT_TIMEFRAME = "4h" as const;

// 🔹 CONFIGURACIÓN DE AUREOBITCOIN (Sponsor)
const SPONSOR_CONFIG = {
  name: "AureoBitcoin",
  url: "https://app.aureobitcoin.com/es/auth/signup?ref=Aldar1",
  ctaText: "Comprar BTC en AureoBitcoin",
};

interface DCAConfig {
  status: string;
  color: string;
  bgGlow: string;
  message: string;
  dcaImpact: string;
  emoji: string;
  icon: React.ElementType;
  borderColor: string;
}

function getDCAConfig(value: number): DCAConfig {
  // ≤25 = Precio "en oferta" → mejora tu DCA
  if (value <= 25) {
    return {
      status: "FAVORABLE PARA DCA",
      color: "#00FF41", // matrix green ✓
      bgGlow: "rgba(0, 255, 65, 0.45)",
      message: "Bitcoin está en zona de acumulación.\nCada sat cuenta más.",
      dcaImpact: "😊 Esta compra MEJORA tu DCA",
      emoji: "😊",
      icon: TrendingDown,
      borderColor: "border-matrix/30",
    };
  }
  // ≥80 = Precio "caro" → tu DCA se diluye ligeramente
  if (value >= 80) {
    return {
      status: "MENOS FAVORABLE",
      color: "#ef4444", // red-500 aprobado en design-system.md
      bgGlow: "rgba(239, 68, 68, 0.3)",
      message: "Bitcoin está en zona alta.\nTu compra compra menos sats.",
      dcaImpact: "😔 Esta compra DILUYE ligeramente tu DCA",
      emoji: "😔",
      icon: TrendingUp,
      borderColor: "border-red-500/30",
    };
  }
  // 26-79 = Neutral → sigue tu plan sin estrés
  return {
    status: "NEUTRAL",
    color: "#F7931A", // bitcoin orange ✓
    bgGlow: "rgba(247, 147, 26, 0.35)",
    message: "Mercado en rango.\nSigue tu plan de acumulación.",
    dcaImpact: "😐 Sigue acumulando sin estrés",
    emoji: "😐",
    icon: Minus,
    borderColor: "border-bitcoin/30",
  };
}

// 🔹 SPONSOR BADGE — Componente reutilizable
function SponsorBadge() {
  return (
    <div className="pt-3 border-t border-white/5">
      <span className="font-mono text-[10px] text-gray-500">
        Señal por{" "}
        <a
          href={SPONSOR_CONFIG.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-matrix hover:text-bitcoin transition-colors inline-flex items-center gap-0.5"
          aria-label="Crear cuenta en AureoBitcoin"
        >
          {SPONSOR_CONFIG.name}
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </span>
    </div>
  );
}

// 🔹 EDUCATIONAL TOOLTIP — Explica DCA y por qué 4H
function DCAInfoTooltip() {
  return (
    <div className="relative group">
      <button
        className="p-1.5 text-gray-400 hover:text-matrix transition-colors rounded"
        aria-label="¿Qué es DCA?"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      
      <div className="absolute right-0 top-full mt-2 w-72 p-4 bg-black/95 border border-matrix/30 rounded-lg shadow-[0_0_30px_rgba(0,255,65,0.2)] z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
        <div className="space-y-3 text-xs font-mono text-gray-300">
          <p className="text-matrix font-bold">¿Qué es DCA?</p>
          <p>DCA (Dollar Cost Averaging) es acumular Bitcoin en cantidades fijas, sin importar el precio. Así evitas el estrés de "adivinar" el momento perfecto.</p>
          
          <p className="text-matrix font-bold pt-2">¿Qué significa este indicador?</p>
          <ul className="space-y-1">
            <li><span className="text-matrix">😊 Verde</span> = Precio favorable → tu compra rinde más sats</li>
            <li><span className="text-bitcoin">😐 Naranja</span> = Precio neutral → sigue tu plan</li>
            <li><span className="text-red-400">😔 Rojo</span> = Precio alto → tu compra rinde menos sats</li>
          </ul>
          
          <p className="text-matrix font-bold pt-2">¿Por qué solo 4 horas?</p>
          <p>Usamos 4H porque filtra el "ruido" de minutos y da una señal más estable para aprender. No es trading, es educación.</p>
          
          <p className="text-[10px] text-gray-500 pt-2 border-t border-white/10">
            ⚠️ Esto es educativo, no consejo financiero. El DCA funciona a largo plazo: lo importante es no dejar de acumular.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MarketMoodWidget() {
  // 🔹 TIMEFRAME FIJO: 4h (sin toggle para evitar confusión)
  const { result, loading, error, refresh, btcPrice } = useMarketMood(DEFAULT_TIMEFRAME);

  const dca = useMemo(() => {
    if (!result) return null;
    return getDCAConfig(result.value);
  }, [result]);

  if (error) {
    return (
      <Card className="bg-black/80 border border-red-500/30 p-6 backdrop-blur-md">
        <div className="text-center text-red-400 space-y-3">
          <Activity className="h-8 w-8 mx-auto opacity-70" />
          <p className="font-mono text-xs">ERROR EN LA MATRIZ</p>
          <button
            onClick={refresh}
            className="px-4 py-2 text-xs font-mono border border-matrix/50 hover:bg-matrix/10 text-matrix transition-all"
          >
            REINTENTAR CONEXIÓN →
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-black/70 backdrop-blur-md border border-white/10 transition-all duration-700 group">
      {/* Scanlines y efectos CRT */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#00ff4122_0px,#00ff4122_1px,transparent_1px,transparent_4px)] pointer-events-none opacity-40" />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-matrix to-transparent animate-scanline" />

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-matrix/30" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-matrix/30" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-matrix/30" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-matrix/30" />

      <div className="p-6 space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-matrix animate-pulse" />
            <span className="font-mono text-[10px] text-matrix uppercase tracking-[0.125em] font-bold">
              ORACLE • DCA QUALITY
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Help Button — Tooltip educativo */}
            <DCAInfoTooltip />

            {/* Refresh Button */}
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-matrix transition-colors disabled:opacity-50"
              title="Actualizar señal"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && !result ? (
          <div className="space-y-6 py-8 animate-pulse">
            <div className="mx-auto w-20 h-20 rounded-full border border-white/10" />
            <div className="h-6 bg-white/5 rounded w-40 mx-auto" />
            <div className="h-4 bg-white/5 rounded w-52 mx-auto" />
          </div>
        ) : dca && result ? (
          <>
            {/* BTC Price */}
            {btcPrice && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Bitcoin className="h-5 w-5 text-bitcoin" />
                  <span className="font-vt323 text-3xl md:text-4xl text-white tracking-wider">
                    {formatPrice(btcPrice)}
                  </span>
                </div>
                <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest mt-1">
                  BTC/USD • BINANCE • 4H
                </p>
              </div>
            )}

            {/* DCA Core */}
            <div className="text-center space-y-4">
              {/* Emoji grande + glow */}
              <div className="flex justify-center">
                <div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-500"
                  style={{
                    borderColor: dca.color,
                    boxShadow: `0 0 50px ${dca.bgGlow}, inset 0 0 25px ${dca.bgGlow}`,
                  }}
                >
                  <span className="text-4xl" role="img" aria-label={dca.dcaImpact}>
                    {dca.emoji}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div
                className="font-serif text-2xl md:text-3xl font-bold tracking-[0.08em] uppercase drop-shadow-lg"
                style={{ color: dca.color }}
              >
                {dca.status}
              </div>

              {/* Valor numérico */}
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="font-vt323 text-5xl md:text-6xl text-white tabular-nums">
                  {result.value}
                </span>
                <span className="font-mono text-sm text-gray-500">/100</span>
              </div>

              {/* Mensaje educativo */}
              <p className="font-mono text-sm text-gray-300 whitespace-pre-line leading-relaxed max-w-[280px] mx-auto">
                {dca.message}
              </p>

              {/* Impacto en DCA — Badge destacado */}
              <div
                className="inline-block px-5 py-2.5 rounded-full border text-xs font-mono font-bold tracking-wide"
                style={{
                  color: dca.color,
                  borderColor: `${dca.color}60`,
                  backgroundColor: `${dca.color}10`,
                  boxShadow: `0 0 15px ${dca.color}30`,
                }}
              >
                {dca.dcaImpact}
              </div>

              {/* CTA contextual — Siempre visible */}
              <a
                href={SPONSOR_CONFIG.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 border border-matrix/30 bg-matrix/5 text-matrix font-mono text-[10px] hover:bg-matrix/10 hover:text-bitcoin transition-all duration-200 rounded-sm mx-auto"
              >
                <span>{SPONSOR_CONFIG.ctaText}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Sparkline histórico */}
            {result.historicalValues.length > 1 && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest mb-3">
                  HISTÓRICO • ÚLTIMAS {result.historicalValues.length} LECTURAS (4H)
                </p>
                <div className="h-12 flex items-end gap-px px-1">
                  {result.historicalValues.slice(-36).map((val, i) => {
                    const barColor = val >= 80 ? "#ef4444" : val <= 25 ? "#00FF41" : "#F7931A";
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-t transition-all duration-300 hover:opacity-100"
                        style={{
                          height: `${Math.max(12, val * 0.95)}%`,
                          backgroundColor: barColor,
                          opacity: 0.35 + (i / 36) * 0.65,
                        }}
                        title={`${val.toFixed(1)}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Last Update — Timezone México */}
            <div className="text-center">
              <span className="text-[9px] font-mono text-gray-700">
                Última sincronización:{" "}
                {new Date(result.lastUpdate).toLocaleTimeString("es-MX", {
                  timeZone: "America/Mexico_City",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                CST
              </span>
            </div>

            {/* Disclaimer educativo */}
            <p className="text-[9px] font-mono text-gray-600 text-center italic">
              Herramienta educativa • No es consejo financiero • El DCA funciona a largo plazo
            </p>

            {/* Sponsor Badge */}
            <SponsorBadge />
          </>
        ) : null}
      </div>
    </Card>
  );
}