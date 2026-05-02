"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Activity, RefreshCw, Bitcoin, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { useMarketMood, type Timeframe } from "@/hooks/useMarketMood";
import { formatPrice } from "@/lib/market/binance";
import MarketMoodInfoPopover from "./MarketMoodInfoPopover";

// ============================================================
// MARKET MOOD WIDGET — Bitcoin Matrix Edition v2.3
// Oracle System • Con Instructivo + Sponsor AureoBitcoin
// Compliance: design-system.md, MANTENIMIENTO.md
// ============================================================

// 🔹 TIMEFRAMES LIMITADOS: Solo 1H y 4H para mayor frecuencia en eventos
const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: "1h", label: "1H" },
  { value: "4h", label: "4H" },
];

// 🔹 CONFIGURACIÓN DE AUREOBITCOIN (Sponsor)
const SPONSOR_CONFIG = {
  name: "AureoBitcoin",
  url: "https://app.aureobitcoin.com/es/auth/signup?ref=Aldar1",
  ctaText: "Operar en AureoBitcoin",
};

interface MoodConfig {
  status: string;
  color: string;
  bgGlow: string;
  message: string;
  recommendation: string;
  emoji: string;
  icon: React.ElementType;
  borderColor: string; // ← Agregado para consistencia
}

function getMoodConfig(value: number): MoodConfig {
  if (value >= 80) {
    return {
      status: "ZONA DE CODICIA",
      color: "#ef4444", // ← red-500 aprobado en design-system.md (NO #ff2a6d)
      bgGlow: "rgba(239, 68, 68, 0.3)",
      message: "Los débiles venden.\nLos fuertes acumulan en silencio.",
      recommendation: "🛡️ HODL o vende a fiat slaves",
      emoji: "☠️",
      icon: TrendingUp,
      borderColor: "border-red-500/30",
    };
  }
  if (value <= 25) {
    return {
      status: "DIP BENDICIÓN",
      color: "#00FF41", // matrix green ✓
      bgGlow: "rgba(0, 255, 65, 0.45)",
      message: "El mercado ofrece bitcoin barato.\nSatoshi sonríe.",
      recommendation: "💎 Acumula como si el fiat muriera mañana",
      emoji: "🪙",
      icon: TrendingDown,
      borderColor: "border-matrix/30",
    };
  }
  return {
    status: "RANGO NEUTRAL",
    color: "#F7931A", // bitcoin orange ✓
    bgGlow: "rgba(247, 147, 26, 0.35)",
    message: "Mercado lateral.\nMantén calma y observa.",
    recommendation: "🟠 Espera señal clara del sistema",
    emoji: "⚖️",
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

export default function MarketMoodWidget() {
  // 🔹 TIMEFRAME POR DEFECTO: 4h (más estable para eventos)
  const { result, loading, error, timeframe, setTimeframe, refresh, btcPrice } = useMarketMood("4h");

  const mood = useMemo(() => {
    if (!result) return null;
    return getMoodConfig(result.value);
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
              ORACLE • MARKET MOOD
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Timeframe Selector — Solo 1H y 4H */}
            <div className="flex gap-1 bg-black/50 p-1 rounded border border-white/10">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setTimeframe(tf.value)}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded transition-all duration-200 ${
                    timeframe === tf.value
                      ? "bg-bitcoin text-black shadow-[0_0_10px_rgba(247,147,26,0.5)]"
                      : "text-gray-400 hover:text-white hover:border-white/30"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Help Button */}
            <MarketMoodInfoPopover />

            {/* Refresh Button */}
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-matrix transition-colors disabled:opacity-50"
              title="Actualizar Oracle"
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
        ) : mood && result ? (
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
                  BTC/USD • BINANCE • LIVE
                </p>
              </div>
            )}

            {/* Mood Core */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-500"
                  style={{
                    borderColor: mood.color,
                    boxShadow: `0 0 50px ${mood.bgGlow}, inset 0 0 25px ${mood.bgGlow}`,
                  }}
                >
                  <mood.icon
                    className="h-12 w-12 transition-all"
                    style={{ color: mood.color }}
                  />
                </div>
              </div>

              <div
                className="font-serif text-2xl md:text-3xl font-bold tracking-[0.08em] uppercase drop-shadow-lg"
                style={{ color: mood.color }}
              >
                {mood.status}
              </div>

              <div className="flex items-baseline justify-center gap-1.5">
                <span className="font-vt323 text-5xl md:text-6xl text-white tabular-nums">
                  {result.value}
                </span>
                <span className="font-mono text-sm text-gray-500">/100</span>
              </div>

              <p className="font-mono text-sm text-gray-300 whitespace-pre-line leading-relaxed max-w-[280px] mx-auto">
                {mood.message}
              </p>

              <div
                className="inline-block px-6 py-2.5 rounded-full border text-xs font-mono font-bold tracking-widest"
                style={{
                  color: mood.color,
                  borderColor: `${mood.color}60`,
                  backgroundColor: `${mood.color}10`,
                  boxShadow: `0 0 15px ${mood.color}30`,
                }}
              >
                {mood.recommendation}
              </div>

              {/* 🔹 CTA CONTEXTUAL — Siempre visible para eventos */}
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

            {/* Sparkline */}
            {result.historicalValues.length > 1 && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest mb-3">
                  HISTÓRICO • ÚLTIMAS {result.historicalValues.length} LECTURAS
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

            {/* 🔹 Last Update — Timezone México */}
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

            {/* 🔹 SPONSOR BADGE — Atribución persistente */}
            <SponsorBadge />
          </>
        ) : null}
      </div>
    </Card>
  );
}