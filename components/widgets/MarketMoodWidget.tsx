"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Activity, RefreshCw, Bitcoin, TrendingUp, 
  TrendingDown, Minus, ExternalLink, AlertTriangle,
  Info
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
      status: "¡Excelente momento!",
      emoji: "🚀",
      colorClass: "text-matrix",
      borderColor: "border-matrix",
      bgClass: "bg-matrix/10",
      glow: "shadow-[0_0_15px_rgba(0,255,65,0.2)]",
      message: "Bitcoin está en zona de acumulación fuerte. Cada sat que compres hoy vale más.",
      impact: "Esta compra MEJORA tu costo promedio",
      icon: TrendingDown,
    };
  }
  if (value >= 75) {
    return {
      status: "Zona alta - Cautela",
      emoji: "⚠️",
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
    emoji: "😐",
    colorClass: "text-bitcoin",
    borderColor: "border-bitcoin",
    bgClass: "bg-bitcoin/10",
    glow: "shadow-[0_0_20px_rgba(247,147,26,0.4)]",
    message: "Mercado en rango lateral. Sigue tu estrategia de acumulación.",
    impact: "Buen momento para seguir tu plan",
    icon: Minus,
  };
}

export default function MarketMoodWidget() {
  const { result, loading, error, refresh, btcPrice } = useMarketMood(DEFAULT_TIMEFRAME);
  const [showDCAInfo, setShowDCAInfo] = useState(false);

  const dca = useMemo(() => {
    if (!result?.value) return null;
    return getDCAConfig(result.value);
  }, [result]);

  if (error) {
    return (
      <Card className="bg-black/80 backdrop-blur-md border border-red-500/30 p-6 text-center">
        <p className="text-red-500 font-mono text-xs mb-3 uppercase tracking-wider">
          ⚠ Error en la señal
        </p>
        <button 
          onClick={refresh} 
          className="text-matrix font-mono text-xs hover:underline transition-colors"
        >
          Reintentar →
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
        {/* Header - MÁS EDUCATIVO */}
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-matrix/10 border border-matrix/30 flex items-center justify-center">
                <Activity className="h-4 w-4 text-matrix" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-tight">
                  Mejora tu Costo Promedio
                </h3>
                <p className="font-mono text-[10px] text-gray-400">
                  Calidad de compra • Actualizado cada 4h
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

          {/* Tooltip/Explicación DCA */}
          <div className="relative">
            <button
              onClick={() => setShowDCAInfo(!showDCAInfo)}
              className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 hover:text-matrix transition-colors"
            >
              <Info className="h-3 w-3" />
              <span>¿Qué es DCA y por qué importa?</span>
            </button>
            
            {showDCAInfo && (
              <div className="absolute top-full left-0 mt-2 p-3 bg-black/95 border border-matrix/30 rounded-lg z-20 text-xs font-mono text-gray-300 leading-relaxed shadow-[0_0_20px_rgba(0,255,65,0.15)]">
                <p className="mb-2">
                  <strong className="text-matrix">DCA</strong> (Dollar Cost Averaging) es comprar Bitcoin periódicamente sin importar el precio.
                </p>
                <p className="mb-2">
                  Esta herramienta te dice si <strong className="text-bitcoin">este momento</strong> es bueno para comprar y mejorar tu precio promedio.
                </p>
                <p className="text-gray-500">
                  💡 <em>Comprar en verde = mejor costo promedio<br/>Comprar en rojo = rinde menos sats</em>
                </p>
                <button 
                  onClick={() => setShowDCAInfo(false)}
                  className="mt-2 text-[10px] text-matrix hover:underline"
                >
                  Entendido ✓
                </button>
              </div>
            )}
          </div>
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

            {/* Indicador Principal - CON CARITA GRANDE */}
            <div className="text-center space-y-4">
              {/* Emoji GRANDE y visible */}
              <div
                className={`mx-auto w-24 h-24 rounded-2xl flex items-center justify-center border-2 ${dca.borderColor} ${dca.bgClass} ${dca.glow} transition-all duration-500`}
              >
                <span className="text-6xl">{dca.emoji}</span>
              </div>

              <div className="space-y-2">
                <div className={`font-serif text-xl font-bold ${dca.colorClass}`}>
                  {dca.status}
                </div>
                
                {/* Score numérico */}
                <div className="font-mono text-5xl font-bold text-white tabular-nums tracking-tighter">
                  {result.value}
                  <span className="text-xl text-gray-600">/100</span>
                </div>

                {/* Barra de progreso visual */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full transition-all duration-700 ${dca.colorClass.replace('text-', 'bg-')}`}
                    style={{ width: `${result.value}%` }}
                  />
                </div>
              </div>

              {/* Mensaje explicativo */}
              <p className="font-mono text-xs text-gray-300 max-w-sm mx-auto leading-relaxed px-2">
                {dca.message}
              </p>

              {/* Badge de impacto - más visible */}
              <div
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border ${dca.borderColor} ${dca.bgClass} ${dca.colorClass} ${dca.glow}`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                {dca.impact}
              </div>
            </div>

            {/* CTA AureoBitcoin */}
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