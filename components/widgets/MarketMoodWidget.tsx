"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Activity, RefreshCw, Bitcoin, TrendingUp, TrendingDown, Minus, ExternalLink, HelpCircle } from "lucide-react";
import { useMarketMood } from "@/hooks/useMarketMood";
import { formatPrice } from "@/lib/market/binance";

const DEFAULT_TIMEFRAME = "4h" as const;

const SPONSOR_CONFIG = {
  name: "AureoBitcoin",
  url: "https://app.aureobitcoin.com/es/auth/signup?ref=abo",
  ctaText: "Comprar BTC con AureoBitcoin →",
  description: "Plataforma mexicana confiable",
};

function getDCAConfig(value: number) {
  if (value <= 25) {
    return {
      status: "EXCELENTE MOMENTO PARA DCA",
      color: "#00FF41",
      glow: "rgba(0, 255, 65, 0.6)",
      message: "Bitcoin está en zona de acumulación fuerte.\nCada sat que compres hoy vale más.",
      impact: "😊 Esta compra MEJORA significativamente tu DCA",
      emoji: "🚀",
      icon: TrendingDown,
    };
  }
  if (value >= 75) {
    return {
      status: "ZONA ALTA - CAUTELA",
      color: "#ef4444",
      glow: "rgba(239, 68, 68, 0.4)",
      message: "Precio elevado.\nTu compra rinde menos satoshis por dólar.",
      impact: "😔 Esta compra DILUYE tu promedio",
      emoji: "⚠️",
      icon: TrendingUp,
    };
  }
  return {
    status: "ZONA NEUTRAL",
    color: "#F7931A",
    glow: "rgba(247, 147, 26, 0.5)",
    message: "Mercado en rango lateral.\nSigue tu estrategia de acumulación.",
    impact: "😐 Buen momento para seguir tu plan DCA",
    emoji: "🟠",
    icon: Minus,
  };
}

export default function MarketMoodWidget() {
  const { result, loading, error, refresh, btcPrice } = useMarketMood(DEFAULT_TIMEFRAME);

  const dca = useMemo(() => {
    if (!result?.value) return null;
    return getDCAConfig(result.value);
  }, [result]);

  if (error) {
    return (
      <Card className="bg-black/80 border-red-500/30 p-8 text-center">
        <p className="text-red-400 font-mono text-sm mb-4">ERROR EN LA SEÑAL DEL ORACLE</p>
        <button onClick={refresh} className="text-matrix hover:underline">
          Reintentar →
        </button>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-black/80 backdrop-blur-2xl border border-white/10">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#00ff4122_0px,#00ff4122_1px,transparent_4px)] opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-matrix to-transparent animate-scanline" />

      <div className="p-6 sm:p-8 relative z-10 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-matrix/10 border border-matrix/30 flex items-center justify-center">
              <Activity className="h-5 w-5 text-matrix" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold tracking-tight">DCA Oracle</h3>
              <p className="font-mono text-xs text-matrix/70">Calidad de compra • 4H</p>
            </div>
          </div>

          <button
            onClick={refresh}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-matrix transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading && !result ? (
          <div className="py-12 flex flex-col items-center justify-center animate-pulse">
            <div className="w-16 h-16 border-2 border-matrix/30 border-t-matrix rounded-full animate-spin" />
            <p className="text-xs font-mono text-gray-500 mt-6">Analizando mercado...</p>
          </div>
        ) : dca && result ? (
          <>
            {btcPrice && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Bitcoin className="h-5 w-5 text-bitcoin" />
                  <span className="font-mono text-4xl font-bold tracking-wider">
                    {formatPrice(btcPrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Indicador Principal con Carita Grande */}
            <div className="text-center space-y-5">
              <div
                className="mx-auto w-28 h-28 rounded-2xl flex items-center justify-center border-[6px] transition-all duration-700 text-6xl"
                style={{
                  borderColor: dca.color,
                  boxShadow: `0 0 60px ${dca.glow}`,
                }}
              >
                {dca.emoji}
              </div>

              <div>
                <div className="font-serif text-[28px] font-bold tracking-wider uppercase" style={{ color: dca.color }}>
                  {dca.status}
                </div>
                <div className="font-mono text-6xl font-bold text-white mt-1 tabular-nums tracking-tighter">
                  {result.value}
                  <span className="text-2xl text-gray-500">/100</span>
                </div>
              </div>

              <p className="font-mono text-sm text-gray-300 max-w-xs mx-auto leading-relaxed">
                {dca.message}
              </p>

              {/* Carita en el impacto */}
              <div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium border"
                style={{
                  color: dca.color,
                  borderColor: dca.color + "50",
                  backgroundColor: dca.color + "10",
                }}
              >
                <span>{dca.impact}</span>
              </div>
            </div>

            {/* CTA AureoBitcoin - Prominente */}
            <a
              href={SPONSOR_CONFIG.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block mt-6 bg-gradient-to-r from-matrix/10 via-bitcoin/5 to-matrix/10 hover:from-matrix/20 hover:to-bitcoin/20 border border-matrix/30 hover:border-matrix/60 rounded-2xl p-6 text-center transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2 text-lg font-bold text-matrix group-hover:text-white">
                {SPONSOR_CONFIG.ctaText}
                <ExternalLink className="h-5 w-5" />
              </div>
              <p className="text-xs text-gray-400 mt-1 font-mono">{SPONSOR_CONFIG.description}</p>
            </a>

            {/* Disclaimer */}
            <p className="text-center text-[10px] text-gray-500 font-mono pt-2">
              Herramienta educativa • No es consejo financiero
            </p>
          </>
        ) : null}
      </div>
    </Card>
  );
}