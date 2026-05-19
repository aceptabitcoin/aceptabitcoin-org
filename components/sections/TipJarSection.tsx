'use client';

import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, Copy, Check, Bitcoin, DollarSign, QrCode, Wallet, 
  ExternalLink, AlertCircle, Receipt, Sparkles, ArrowRight 
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import MatrixRain from "@/components/ui/MatrixRain";
import { formatSats } from "@/lib/blink";

// ============================================================
// TIPJAR SECTION — "Caja Registradora" v3.0
// Acepta Bitcoin México | Oracle System v2.0
// 
// 🎯 Propósito: Punto de pago para servicios profesionales
// • Cursos y capacitaciones Bitcoin
// • Consultoría en adopción Lightning
// • Diseño de sitios web Bitcoin-friendly
// • Implementación de sistemas de cobro fiat/BTC
// • Charlas y eventos corporativos
//
// Compliance: design-system.md, MANTENIMIENTO.md
// ============================================================

// 🔹 CONFIGURACIÓN CENTRALIZADA
const BLINK_CONFIG = {
  downloadUrl: "https://blink.sv/download",
  endorsement: "Procesado por Blink.sv",
};

const LIGHTNING_ADDRESS = process.env.NEXT_PUBLIC_LIGHTNING_ADDRESS || "tu-wallet@blink.sv";

type CurrencyMode = "BTC" | "USD";
type QrMode = "lnaddress" | "bolt11" | "onchain";
type ServiceType = "curso" | "consultoria" | "diseno" | "charla" | "donacion";

const PRESET_AMOUNTS = {
  BTC: ["1000", "5000", "10000", "25000", "50000"],
  USD: ["10", "50", "100", "250", "500"], // Ajustado para servicios profesionales
};

const SERVICE_LABELS: Record<ServiceType, string> = {
  curso: "🎓 Curso / Capacitación",
  consultoria: "🔧 Consultoría Técnica",
  diseno: "🎨 Diseño Web Bitcoin",
  charla: "🎤 Charla / Evento",
  donacion: "⭐ Apoyo General"
};

export default function TipJarSection() {
  const [isMounted, setIsMounted] = useState(false);

  const [state, setState] = useState({
    currency: "USD" as CurrencyMode, // Default USD para servicios
    qrMode: "lnaddress" as QrMode,
    amount: "100", // Default $100 USD como punto de entrada
    customAmount: "",
    service: "consultoria" as ServiceType,
    invoice: null as string | null,
    onChainAddress: null as string | null,
    loading: false,
    copied: false,
    error: null as string | null,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ── Generate invoice via proxy ──
  const generateInvoice = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    
    try {
      const amountValue = state.customAmount ? state.customAmount : state.amount;
      const amountNum = Number(amountValue);
      
      if (!amountNum || amountNum <= 0) {
        throw new Error('Monto inválido');
      }

      const response = await fetch('/api/tipjar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-invoice',
          amount: amountNum,
          currency: state.currency,
          memo: `Servicio: ${SERVICE_LABELS[state.service]} - Acepta Bitcoin MX`,
          metadata: { service: state.service }
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al generar invoice');
      }

      setState((s) => ({
        ...s,
        loading: false,
        invoice: data.invoice,
        qrMode: 'bolt11',
      }));
    } catch (err: any) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err.message || 'Error de conexión con Blink',
      }));
    }
  }, [state.currency, state.amount, state.customAmount, state.service]);

  // ── Get on-chain address ──
  const fetchOnChainAddress = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    
    try {
      const response = await fetch('/api/tipjar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-onchain' }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al obtener dirección');
      }

      setState((s) => ({
        ...s,
        loading: false,
        onChainAddress: data.address,
        qrMode: 'onchain',
      }));
    } catch (err: any) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err.message || 'Error de conexión con Blink',
      }));
    }
  }, []);

  // ── Copy to clipboard ──
  const copyToClipboard = useCallback(async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setState((s) => ({ ...s, copied: true }));
    setTimeout(() => setState((s) => ({ ...s, copied: false })), 2000);
  }, []);

  // ── Build QR value ──
  const getQrValue = useCallback(() => {
    if (!isMounted) return "https://aceptabitcoin.mx";
    if (state.qrMode === "lnaddress") return `lightning:${LIGHTNING_ADDRESS}`;
    if (state.qrMode === "bolt11" && state.invoice) return `lightning:${state.invoice}`;
    if (state.qrMode === "onchain" && state.onChainAddress) return `bitcoin:${state.onChainAddress}`;
    return "";
  }, [state.qrMode, state.invoice, state.onChainAddress, isMounted]);

  // ── Toggle currency ──
  const toggleCurrency = (currency: CurrencyMode) => {
    setState((s) => ({
      ...s,
      currency,
      amount: PRESET_AMOUNTS[currency][2],
      customAmount: "",
      invoice: null,
      onChainAddress: null,
      qrMode: "lnaddress",
      error: null,
    }));
  };

  // ── Select service type ──
  const selectService = (service: ServiceType) => {
    setState((s) => ({
      ...s,
      service,
      invoice: null,
      error: null,
      // Sugerir monto según servicio (opcional)
      ...(service === "curso" && { amount: s.currency === "USD" ? "250" : "10000" }),
      ...(service === "consultoria" && { amount: s.currency === "USD" ? "100" : "5000" }),
      ...(service === "diseno" && { amount: s.currency === "USD" ? "500" : "25000" }),
    }));
  };

  const qrValue = getQrValue();
  const isBtc = state.currency === "BTC";

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-black scroll-mt-24" id="pagar-servicios">
      <MatrixRain className="opacity-20" speed={0.75} />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.07)_1px,transparent_1px)] bg-[length:60px_60px] pointer-events-none" />

      <div className="container relative z-10 px-4 max-w-6xl mx-auto">
        
        {/* 🧾 HEADER — "Caja Registradora" */}
        <div className="text-center mb-12 sm:mb-16 space-y-6">
          
          {/* Badge de estado */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/70 border border-orange-500/30 rounded-full font-mono text-xs text-orange-400 tracking-[0.15em]">
            <Receipt className="h-3.5 w-3.5 animate-pulse" />
            CAJA REGISTRadora LIGHTNING ⚡
          </div>

          {/* Título principal */}
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white">
            Paga tus <span className="text-orange-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.5)]">Servicios Bitcoin</span><br /> 
            al Instante
          </h2>

          {/* Subtítulo explicativo */}
          <p className="max-w-3xl mx-auto text-gray-400 font-mono text-base sm:text-lg leading-relaxed">
            Cursos • Consultoría • Diseño Web • Sistemas de Cobro • Charlas<br />
            <span className="text-matrix block mt-2">
              Factura en satoshis. Recibe tu comprobante. Sin intermediarios.
            </span>
          </p>

          {/* Selector de servicio (nuevo) */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((svc) => (
              <button
                key={svc}
                onClick={() => selectService(svc)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 border ${
                  state.service === svc
                    ? "bg-orange-500/20 border-orange-500/50 text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.2)]"
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {SERVICE_LABELS[svc]}
              </button>
            ))}
          </div>
        </div>

        {/* 🪙 MAIN CARD — Glassmorphism + Grid */}
        <Card className="relative bg-black/80 backdrop-blur-2xl border border-white/10 overflow-hidden rounded-3xl">
          {/* Decoración Matrix */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#00ff4122_0px,#00ff4122_1px,transparent_4px)] opacity-20 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-scanline pointer-events-none" />

          <div className="p-6 sm:p-8 md:p-12">
            
            {/* Currency Toggle */}
            <div className="flex justify-center mb-8 sm:mb-10">
              <div className="inline-flex bg-black/60 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => toggleCurrency("BTC")}
                  className={`px-6 sm:px-8 py-3 rounded-lg font-mono flex items-center gap-2 transition-all duration-200 ${
                    state.currency === "BTC"
                      ? "bg-bitcoin text-black shadow-[0_0_25px_rgba(247,147,26,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Bitcoin className="h-4 w-4" /> SATS
                </button>
                <button
                  onClick={() => toggleCurrency("USD")}
                  className={`px-6 sm:px-8 py-3 rounded-lg font-mono flex items-center gap-2 transition-all duration-200 ${
                    state.currency === "USD"
                      ? "bg-orange-500 text-black shadow-[0_0_25px_rgba(249,115,22,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <DollarSign className="h-4 w-4" /> USD
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              
              {/* 🎛️ Controls Column */}
              <div className="space-y-6 sm:space-y-8">
                
                {/* Preset Amounts */}
                <div>
                  <p className="font-mono text-xs text-orange-400 mb-3 tracking-widest flex items-center gap-2">
                    <Sparkles className="h-3 w-3" /> MONTO DEL SERVICIO
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {PRESET_AMOUNTS[state.currency].map((amt) => (
                      <button
                        key={amt}
                        onClick={() =>
                          setState((s) => ({ ...s, amount: amt, customAmount: "", invoice: null, error: null }))
                        }
                        className={`py-3 sm:py-4 text-sm font-mono border rounded-xl transition-all duration-200 ${
                          state.amount === amt && !state.customAmount
                            ? isBtc
                              ? "bg-bitcoin text-black border-bitcoin shadow-[0_0_15px_rgba(247,147,26,0.3)]"
                              : "bg-orange-500 text-black border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                            : "border-white/10 hover:border-white/30 bg-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        {isBtc ? formatSats(+amt) : `$${amt}`}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    min="1"
                    placeholder="Monto personalizado"
                    value={state.customAmount}
                    onChange={(e) =>
                      setState((s) => ({ ...s, customAmount: e.target.value, amount: "", invoice: null, error: null }))
                    }
                    className="mt-4 w-full bg-white/5 border border-white/20 rounded-2xl px-5 py-4 text-center font-mono text-lg text-white placeholder-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all"
                  />
                </div>

                {/* CTA Principal */}
                <Button
                  onClick={generateInvoice}
                  disabled={state.loading}
                  className={`w-full h-14 sm:h-16 text-lg sm:text-xl font-mono tracking-wide rounded-2xl transition-all duration-300 ${
                    isBtc
                      ? "bg-bitcoin hover:bg-bitcoin/90 text-black shadow-[0_0_25px_rgba(247,147,26,0.4)] hover:shadow-[0_0_35px_rgba(247,147,26,0.6)]"
                      : "bg-orange-500 hover:bg-orange-500/90 text-black shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:shadow-[0_0_35px_rgba(249,115,22,0.6)]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {state.loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">◐</span> PROCESANDO...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      PAGAR CON LIGHTNING <Zap className="h-5 w-5" />
                    </span>
                  )}
                </Button>

                {/* Métodos de pago alternativos */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setState((s) => ({ ...s, qrMode: "lnaddress", invoice: null, error: null }))}
                    className={`rounded-xl transition-all duration-200 ${
                      state.qrMode === "lnaddress"
                        ? "border-orange-500 text-orange-400 bg-orange-500/10"
                        : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    <QrCode className="h-4 w-4 mr-2" /> Lightning Address
                  </Button>
                  <Button
                    variant="outline"
                    onClick={fetchOnChainAddress}
                    disabled={state.loading}
                    className={`rounded-xl transition-all duration-200 ${
                      state.qrMode === "onchain"
                        ? "border-bitcoin text-bitcoin bg-bitcoin/10"
                        : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                    } disabled:opacity-50`}
                  >
                    <Bitcoin className="h-4 w-4 mr-2" /> On-Chain
                  </Button>
                </div>

                {/* Info técnica */}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-y-2 text-[10px] font-mono text-gray-500">
                    <div className="flex justify-between">
                      <span>Red:</span>
                      <span className="text-matrix">Lightning ⚡</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Procesador:</span>
                      <span className="text-orange-400">Blink.sv</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comprobante:</span>
                      <span className="text-gray-400">Invoice + Email</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comisión:</span>
                      <span className="text-gray-400">~0.02%</span>
                    </div>
                  </div>
                </div>

                {/* Error state */}
                {state.error && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span suppressHydrationWarning>{state.error}</span>
                  </div>
                )}
              </div>

              {/* 📱 QR Column */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <div
                    className={`absolute -inset-6 bg-gradient-to-br ${
                      isBtc ? "from-bitcoin/30 to-transparent" : "from-orange-500/30 to-transparent"
                    } blur-3xl rounded-3xl pointer-events-none transition-opacity duration-500`}
                  />
                  <div className="relative bg-white p-4 sm:p-5 rounded-3xl border border-white/30 shadow-2xl">
                    {isMounted ? (
                      <QRCodeSVG
                        value={qrValue}
                        size={240}
                        level="H"
                        bgColor="#ffffff"
                        fgColor="#000000"
                        className="rounded-2xl"
                        suppressHydrationWarning
                      />
                    ) : (
                      <div className="w-[240px] h-[240px] bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Zap className="h-10 w-10 text-gray-400 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>

                {qrValue && isMounted && (
                  <button
                    onClick={() =>
                      copyToClipboard(
                        state.qrMode === "lnaddress"
                          ? LIGHTNING_ADDRESS
                          : state.invoice || state.onChainAddress || ""
                      )
                    }
                    className="w-full max-w-xs flex items-center justify-between bg-white/5 border border-white/10 hover:border-orange-500 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm font-mono text-gray-300 hover:text-orange-400 transition-all duration-200"
                    aria-live="polite"
                  >
                    <span className="truncate" suppressHydrationWarning>
                      {state.qrMode === "lnaddress"
                        ? LIGHTNING_ADDRESS
                        : state.invoice?.slice(0, 28) + "..."}
                    </span>
                    {state.copied ? (
                      <Check className="h-4 w-4 text-orange-400 flex-shrink-0" />
                    ) : (
                      <Copy className="h-4 w-4 flex-shrink-0" />
                    )}
                  </button>
                )}

                {/* Badge de confirmación post-pago (visual) */}
                {state.invoice && (
                  <div className="mt-4 flex items-center gap-2 text-xs font-mono text-matrix">
                    <Check className="h-4 w-4" />
                    <span>Invoice generado • Escanea para pagar</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Footer del componente */}
        <div className="text-center mt-8 sm:mt-10 space-y-3">
          <p className="text-gray-500 text-xs font-mono">
            ¿Necesitas una factura formal? <br className="sm:hidden" />
            <a href="mailto:hola@aceptabitcoin.mx" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">
              Contáctanos para coordinación empresarial
            </a>
          </p>
          
          <a
            href={BLINK_CONFIG.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-matrix hover:text-orange-400 transition-colors duration-200 text-sm font-mono group"
          >
            <Wallet className="h-4 w-4 group-hover:scale-110 transition-transform" />
            {BLINK_CONFIG.endorsement} — Descarga Blink Wallet ⚡
            <ExternalLink className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </section>
  );
}