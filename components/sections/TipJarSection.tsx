'use client';

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, Copy, Check, Bitcoin, DollarSign, QrCode, Wallet, 
  AlertCircle, Receipt, Sparkles, RefreshCw
} from "lucide-react";
import MatrixRain from "@/components/ui/MatrixRain";

// Carga dinámica del código QR sin SSR para blindar la hidratación de Next.js
// ✅ MANTENIMIENTO.md: QRCodeSVG debe ser client-only para evitar hydration mismatch
const QRCodeSVG = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeSVG),
  { ssr: false, loading: () => <div className="w-60 h-60 bg-black/40 rounded-xl animate-pulse" /> }
);

// ============================================================
// CAJA REGISTRADORA — Acepta Bitcoin México (Oracle System v2.0)
// ============================================================

const LIGHTNING_ADDRESS = "aceptabitcoin@blink.sv";

const SERVICE_LABELS = {
  consultoria: "🔧 Consultoría Técnica",
  curso: "🎓 Curso / Capacitación",
  diseno: "🎨 Diseño Web Bitcoin",
  charla: "🎤 Charla o Evento",
  donacion: "⭐ Donación / Apoyo",
} as const;

type ServiceType = keyof typeof SERVICE_LABELS;
type CurrencyMode = "SATS" | "USD";
type QrMode = "lnaddress" | "bolt11" | "onchain";

const PRESET_AMOUNTS = {
  SATS: ["5000", "10000", "25000", "50000", "100000"],
  USD: ["50", "100", "250", "500", "1000"],
};

// ✅ Design System: Glow tokens exactos por tipo de pago
const GLOW_TOKENS = {
  // USD/Stablesats → Matrix Green (estabilidad, código, liquidación inmediata)
  USD: {
    bg: "bg-matrix",
    text: "text-matrix",
    border: "border-matrix",
    shadow: "shadow-[0_0_15px_rgba(0,255,65,0.2)]",
    shadowStrong: "shadow-[0_0_20px_rgba(0,255,65,0.4)]",
    bgHover: "hover:bg-matrix/90",
    bgActive: "bg-matrix/10",
  },
  // SATS/Bitcoin nativo → Bitcoin Orange (energía, valor, capa base)
  SATS: {
    bg: "bg-bitcoin",
    text: "text-bitcoin",
    border: "border-bitcoin",
    shadow: "shadow-[0_0_20px_rgba(247,147,26,0.4)]",
    shadowStrong: "shadow-[0_0_25px_rgba(247,147,26,0.5)]",
    bgHover: "hover:bg-bitcoin/90",
    bgActive: "bg-bitcoin/10",
  },
} as const;

export default function TipJarSection() {
  const [isMounted, setIsMounted] = useState(false);

  const [state, setState] = useState({
    currency: "USD" as CurrencyMode,
    qrMode: "lnaddress" as QrMode,
    amount: "250",
    customAmount: "",
    service: "consultoria" as ServiceType,
    invoice: null as string | null,
    onChainAddress: null as string | null,
    amountInSats: null as number | null,
    loading: false,
    copied: false,
    error: null as string | null,
    paid: false,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Helper: Obtener tokens de estilo según moneda (Design System compliant)
  const getCurrencyStyles = useCallback((currency: CurrencyMode) => {
    return GLOW_TOKENS[currency];
  }, []);

  const generateInvoice = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null, invoice: null, onChainAddress: null }));

    try {
      const targetAmount = Number(state.customAmount || state.amount);
      if (!targetAmount || targetAmount <= 0) throw new Error("Por favor, ingresa un monto válido.");

      const res = await fetch('/api/tipjar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-invoice',
          amount: targetAmount,
          currency: state.currency,
          memo: `${SERVICE_LABELS[state.service]} - Acepta Bitcoin México`,
          service: state.service,
        }),
      });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Error en el nodo de Blink. Reintenta.");
    }

    setState(s => ({
      ...s,
      loading: false,
      invoice: data.invoice,
      amountInSats: data.amountInSats || (s.currency === "SATS" ? targetAmount : null),
      qrMode: 'bolt11',
      paid: false,
    }));
  } catch (err: any) {
    setState(s => ({
      ...s,
      loading: false,
      error: err.message,
    }));
  }
}, [state.amount, state.customAmount, state.currency, state.service]);

const fetchOnChainAddress = useCallback(async () => {
  setState(s => ({ ...s, loading: true, error: null, invoice: null, onChainAddress: null }));

  try {
    const res = await fetch('/api/tipjar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get-onchain' }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "No se pudo generar dirección on-chain.");

    setState(s => ({
      ...s,
      loading: false,
      onChainAddress: data.address,
      amountInSats: null,
      qrMode: 'onchain',
    }));
  } catch (err: any) {
    setState(s => ({ ...s, loading: true, error: err.message }));
  }
}, []);

const copyToClipboard = useCallback(async (text: string) => {
  if (!text) return;
  await navigator.clipboard.writeText(text);
  setState(s => ({ ...s, copied: true }));
  setTimeout(() => setState(s => ({ ...s, copied: false })), 2000);
}, []);

const getQrValue = () => {
  if (state.qrMode === "bolt11" && state.invoice) return `lightning:${state.invoice}`;
  if (state.qrMode === "onchain" && state.onChainAddress) return `bitcoin:${state.onChainAddress}`;
  // ✅ Retorna la codificación LNURL nativa para la Lightning Address fija
  return `lightning:${LIGHTNING_ADDRESS.toLowerCase()}`;
};

const getCopyableText = () => {
  if (state.qrMode === "bolt11") return state.invoice || "";
  if (state.qrMode === "onchain") return state.onChainAddress || "";
  return LIGHTNING_ADDRESS;
};

const getButtonLabelText = () => {
  if (state.qrMode === "bolt11" && state.invoice) return `${state.invoice.slice(0, 12)}...${state.invoice.slice(-8)}`;
  if (state.qrMode === "onchain" && state.onChainAddress) return `${state.onChainAddress.slice(0, 12)}...${state.onChainAddress.slice(-8)}`;
  return LIGHTNING_ADDRESS;
};

const toggleCurrency = (currency: CurrencyMode) => {
  setState(s => ({
    ...s,
    currency,
    amount: PRESET_AMOUNTS[currency][2],
    customAmount: "",
    invoice: null,
    onChainAddress: null,
    amountInSats: null,
    qrMode: "lnaddress",
    error: null,
  }));
};

const selectService = (service: ServiceType) => {
  setState(s => ({
    ...s,
    service,
    invoice: null,
    onChainAddress: null,
    amountInSats: null,
    qrMode: "lnaddress",
    error: null,
  }));
};

// ✅ MANTENIMIENTO.md: Guard de hidratación para componentes con datos dinámicos
if (!isMounted) return null;

const qrValue = getQrValue();
const styles = getCurrencyStyles(state.currency);

return (
  <section 
    id="pagar-servicios" 
    className="relative py-20 sm:py-28 overflow-hidden bg-black scroll-mt-24"
    suppressHydrationWarning // ✅ MANTENIMIENTO.md: Elementos dinámicos requieren suppressHydrationWarning
  >
    <MatrixRain className="opacity-10" speed={0.6} />
    <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.04)_1px,transparent_1px)] bg-[length:60px_60px]" />

    <div className="container relative z-10 px-4 max-w-6xl mx-auto">
      
      {/* Header al estilo Terminal de Datos */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/70 border border-matrix/30 rounded-full font-mono text-xs text-matrix tracking-widest mb-6 uppercase">
          <Receipt className="h-3.5 w-3.5 text-matrix" /> Sistema de Liquidación v2.0
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-lg">
          PAGA CON <span className={styles.text}>BITCOIN</span>
        </h2>
        <p className="mt-4 font-mono text-xs text-gray-500 max-w-2xl mx-auto uppercase tracking-wider">
          Canal de cobro inmediato para Servicios Profesionales y Soporte Soberano
        </p>
      </div>

      <Card className="bg-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 sm:p-10 lg:p-12">
          
          {/* Control Principal de Divisa */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-black border border-white/10 rounded-xl p-1 font-mono">
              <button
                onClick={() => toggleCurrency("SATS")}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase flex items-center gap-2 transition-all ${
                  state.currency === "SATS" 
                    ? `${GLOW_TOKENS.SATS.bg} text-black ${GLOW_TOKENS.SATS.shadowStrong}` 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Bitcoin className="h-3.5 w-3.5" /> SATOSHIS
              </button>
              <button
                onClick={() => toggleCurrency("USD")}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase flex items-center gap-2 transition-all ${
                  state.currency === "USD" 
                    ? `${GLOW_TOKENS.USD.bg} text-black ${GLOW_TOKENS.USD.shadowStrong}` 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <DollarSign className="h-3.5 w-3.5" /> DÓLARES (USD)
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* Bloque de Configuración / Inputs */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Selector de Servicios */}
              <div>
                <p className="font-mono text-[10px] text-matrix mb-3 tracking-widest uppercase">1. PROPÓSITO DEL PAGO</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => selectService(key as ServiceType)}
                      className={`px-4 py-2 text-xs font-mono rounded-lg border transition-all ${
                        state.service === key 
                          ? `${styles.bgActive} ${styles.border} ${styles.text} ${styles.shadow}` 
                          : "border-white/10 hover:border-white/30 text-gray-400 bg-black/40"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selección y entrada de Montos */}
              <div>
                <p className="font-mono text-[10px] text-matrix mb-3 tracking-widest uppercase">2. SELECCIÓN DE IMPORTE</p>
                <div className="grid grid-cols-5 gap-2 font-mono">
                  {PRESET_AMOUNTS[state.currency].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setState(s => ({ ...s, amount: amt, customAmount: "" }))}
                      className={`py-3 text-xs font-bold rounded-lg border transition-all ${
                        state.amount === amt && !state.customAmount
                          ? `${styles.bg} text-black ${styles.border} font-black` 
                          : "border-white/10 hover:border-white/20 bg-black/40 text-gray-400"
                      }`}
                    >
                      {state.currency === "SATS" ? `${(+amt / 1000)}k` : `$${amt}`}
                    </button>
                  ))}
                </div>

                <div className="relative mt-3">
                  <input
                    type="number"
                    placeholder="Especificar otro monto de forma manual"
                    value={state.customAmount}
                    onChange={(e) => setState(s => ({ ...s, customAmount: e.target.value, amount: "" }))}
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-5 py-3.5 text-left font-mono text-sm text-white focus:border-matrix focus:ring-1 focus:ring-matrix/30 outline-none transition-all placeholder:text-gray-600"
                  />
                  <div className="absolute right-4 top-3.5 font-mono text-xs text-gray-500 uppercase">
                    {state.currency}
                  </div>
                </div>
              </div>

              {/* Mensaje de Error */}
              {state.error && (
                <div className="flex items-center gap-3 bg-red-950/40 border border-red-500/30 rounded-xl p-4 font-mono text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              {/* Ejecución y generación de Factura */}
              <div className="space-y-3">
                <Button
                  onClick={generateInvoice}
                  disabled={state.loading}
                  className={`w-full h-14 font-mono text-xs font-bold uppercase rounded-xl tracking-wider transition-all ${styles.bg} ${styles.bgHover} text-black ${styles.shadow}`}
                >
                  {state.loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <RefreshCw className="h-4 w-4 animate-spin" /> ESTABLECIENDO ENLACE CON BLINK...
                    </span>
                  ) : (
                    `GENERAR FACTURA LIGHTNING (BOLT11) ⚡`
                  )}
                </Button>

                {/* Vías alternativas de pago */}
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <button 
                    onClick={() => setState(s => ({...s, qrMode: "lnaddress", invoice: null, onChainAddress: null, amountInSats: null, error: null}))}
                    className={`h-11 text-[11px] uppercase tracking-wider rounded-lg border transition-all ${
                      state.qrMode === "lnaddress" 
                        ? `${GLOW_TOKENS.USD.bgActive} ${GLOW_TOKENS.USD.border} ${GLOW_TOKENS.USD.text}` 
                        : "border-white/10 hover:bg-white/5 text-gray-400"
                    }`}
                  >
                    Lightning Address
                  </button>
                  <button 
                    onClick={fetchOnChainAddress}
                    disabled={state.loading}
                    className={`h-11 text-[11px] uppercase tracking-wider rounded-lg border transition-all ${
                      state.qrMode === "onchain" 
                        ? `${GLOW_TOKENS.SATS.bgActive} ${GLOW_TOKENS.SATS.border} ${GLOW_TOKENS.SATS.text}` 
                        : "border-white/10 hover:bg-white/5 text-gray-400"
                    }`}
                  >
                    Capa 1 On-Chain BTC
                  </button>
                </div>
              </div>
            </div>

            {/* Bloque de Visualización del QR */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-10">
              <div className="relative">
                {/* ✅ Design System: Glow dinámico basado en CURRENCY */}
                <div className={`absolute -inset-6 blur-2xl rounded-full opacity-40 transition-all duration-500 ${styles.bg}`} />
                
                {/* Contenedor del código QR */}
                <div className="relative bg-white p-4 rounded-xl shadow-2xl">
                  <QRCodeSVG
                    value={qrValue}
                    size={240}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
              </div>

              {/* Información contextual del tipo de QR activo */}
              <div className="mt-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest text-center">
                PROTOCOLO ACTIVO: <span className={styles.text}>{state.qrMode === "lnaddress" ? "Lightning Address" : state.qrMode}</span>
                {state.amountInSats && (
                  <div className="text-white font-bold text-xs mt-1">
                    Monto estimado: {state.amountInSats.toLocaleString()} SATS
                  </div>
                )}
              </div>

              {/* Botón interactivo de Copiado Segurizado */}
              {qrValue && (
                <button
                  onClick={() => copyToClipboard(getCopyableText())}
                  className="mt-6 w-full max-w-xs flex items-center justify-between bg-black border border-white/10 hover:border-matrix/60 rounded-xl px-4 py-3 text-xs font-mono transition-all text-gray-300 group"
                >
                  <span className="truncate pr-4 text-left">
                    {getButtonLabelText()}
                  </span>
                  <div className={`shrink-0 group-hover:scale-110 transition-transform ${state.copied ? styles.text : "text-gray-400"}`}>
                    {state.copied ? <Check className={`h-4 w-4 ${styles.text}`} /> : <Copy className="h-4 w-4" />}
                  </div>
                </button>
              )}
            </div>

          </div>

        </div>
      </Card>

      {/* Footer institucional de Cumplimiento Técnico */}
      <div className="text-center mt-8 font-mono text-[10px] text-gray-600 uppercase tracking-widest">
        Infraestructura Soberana No Custodial provista mediante el API de <span className={GLOW_TOKENS.USD.text}>Blink.sv</span>
      </div>
    </div>
  </section>
);
}