"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { 
  Activity, RefreshCw, Bitcoin, TrendingUp, 
  TrendingDown, Minus, ExternalLink, AlertTriangle 
} from "lucide-react";
import { useMarketMood } from "@/hooks/useMarketMood";
import { formatPrice } from "@/lib/market/binance";

const DEFAULT_TIMEFRAME = "4h" as const;

const SPONSOR_CONFIG = {
  name: "AureoBitcoin",
  url: "https://app.aureobitcoin.com/es/auth/signup?ref=abo",
  ctaText: "Comprar BTC con AureoBitcoin",
  description: "Plataforma mexicana confiable",
};

function getDCAConfig(value: number) {
  if (value <= 25) {
    return {
      status: "Excelente momento para DCA",
      colorClass: "text-matrix",
      borderColor: "border-matrix",
      bgClass: "bg-matrix/10",
      glow: "shadow-[0_0_15px_rgba(0,255,65,0.2)]",
      message: "Bitcoin está en zona de acumulación fuerte. Cada sat que compres hoy vale más.",
      impact: "Esta compra MEJORA significativamente tu DCA",
      icon: TrendingDown,
    };
  }
  if (value >= 75) {
    return {
      status: "Zona alta - Cautela",
      colorClass: "text-red-500",
      borderColor: "border-red-500/50",
      bgClass: "bg-red-500/10",
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
      message: "Precio elevado. Tu compra rinde menos satoshis por dólar.",
      impact: "Esta compra DILUYE tu promedio",
      icon: AlertTriangle,
    };
  }
  return {
    status: "Zona neutral",
    colorClass: "text-bitcoin",
    borderColor: "border-bitcoin",
    bgClass: "bg-bitcoin/10",
    glow: "shadow-[0_0_20px_rgba(247,147,26,0.4)]",
    message: "Mercado en rango lateral. Sigue tu estrategia de acumulación.",
    impact: "Buen momento para seguir tu plan DCA",
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
      <Card className="bg-black/80 backdrop-blur-md border border-red-500/30 p-6 text-center">
        <p className="text-red-500 font-mono text-xs mb-3 uppercase tracking-wider">
          ⚠ Error en señal del Oracle
        </p>
        <button 
          onClick={refresh} 
          className="text-matrix font-mono text-xs hover:underline transition-colors"
        >
          Reintentar conexión →
        </button>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-black/80 backdrop-blur-md border border-white/10">
      {/* Grid texture sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none" />
      
      {/* Scanline animado */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-matrix/40 to-transparent animate-scanline" />

      <div className="p-6 sm:p-7 relative z-10 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-matrix/10 border border-matrix/30 flex items-center justify-center">
              <Activity className="h-4 w-4 text-matrix" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white tracking-tight">DCA Oracle</h3>
              <p className="font-mono text-[10px] text-matrix/70 uppercase tracking-wide">
                Calidad de compra • 4H
              </p>
            </div>
          </div>

          <button
            onClick={refresh}
            disabled={loading}
            className="p-1.5 text-gray-500 hover:text-matrix transition-colors rounded-md hover:bg-white/5"
            aria-label="Actualizar datos"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading && !result ? (
          <div className="py-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-matrix/30 border-t-matrix rounded-full animate-spin" />
            <p className="text-[10px] font-mono text-gray-500 mt-4 uppercase tracking-wider">
              Analizando mercado...
            </p>
          </div>
        ) : dca && result ? (
          <>
            {/* Precio BTC */}
            {btcPrice && (
              <div className="text-center pb-2">
                <div className="flex items-center justify-center gap-2">
                  <Bitcoin className="h-4 w-4 text-bitcoin" />
                  <span className="font-mono text-2xl font-bold text-white tracking-tight">
                    {formatPrice(btcPrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Indicador Principal */}
            <div className="text-center space-y-4">
              {/* Icono dinámico con glow */}
              <div
                className={`mx-auto w-20 h-20 rounded-xl flex items-center justify-center border-2 ${dca.borderColor} ${dca.bgClass} ${dca.glow} transition-all duration-500`}
              >
                <dca.icon className={`h-10 w-10 ${dca.colorClass}`} />
              </div>

              <div className="space-y-1">
                <div className={`font-serif text-lg font-bold uppercase tracking-wider ${dca.colorClass}`}>
                  {dca.status}
                </div>
                <div className="font-mono text-4xl font-bold text-white tabular-nums tracking-tighter">
                  {result.value}
                  <span className="text-lg text-gray-600">/100</span>
                </div>
              </div>

              <p className="font-mono text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                {dca.message}
              </p>

              {/* Badge de impacto */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium border ${dca.borderColor} ${dca.bgClass} ${dca.colorClass}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {dca.impact}
              </div>
            </div>

            {/* CTA AureoBitcoin - Estilo Ghost Matrix */}
            <a
              href={SPONSOR_CONFIG.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block mt-4 border border-matrix/30 text-matrix hover:bg-matrix/10 hover:border-matrix/60 rounded-lg p-4 text-center transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-wide">
                {SPONSOR_CONFIG.ctaText}
                <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5 font-mono">
                {SPONSOR_CONFIG.description}
              </p>
            </a>

            {/* Disclaimer */}
            <p className="text-center text-[9px] text-gray-600 font-mono uppercase tracking-wider pt-1">
              Herramienta educativa • No es consejo financiero
            </p>
          </>
        ) : null}
      </div>
    </Card>
  );
}