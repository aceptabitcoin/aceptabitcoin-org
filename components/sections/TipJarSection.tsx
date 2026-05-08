"use client";

import { useState, useCallback, useEffect } from "react"; // ← Agregado useEffect
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Copy, Check, Bitcoin, DollarSign, QrCode, Wallet, ExternalLink, AlertCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import MatrixRain from "@/components/ui/MatrixRain";
import { formatSats } from "@/lib/blink";

// ============================================================
// TIPJAR SECTION — Bitcoin Matrix Edition v2.2
// Acepta Bitcoin México | Oracle System v2.0
// Compliance: design-system.md, MANTENIMIENTO.md, README_TIPJAR.md
// ============================================================

// 🔹 CONFIGURACIÓN CENTRALIZADA
const BLINK_CONFIG = {
  downloadUrl: "https://blink.sv/download",
  endorsement: "Patrocinado por Blink.sv",
};

const LIGHTNING_ADDRESS = "tu-wallet@blink.sv";

type CurrencyMode = "BTC" | "USD";
type QrMode = "lnaddress" | "bolt11" | "onchain";

const PRESET_AMOUNTS = {
  BTC: ["1000", "5000", "10000", "25000", "50000"],
  USD: ["1", "5", "10", "25", "50"],
};

export default function TipJarSection() {
  const [isMounted, setIsMounted] = useState(false); // ← Estado de montaje para hidratación

  const [state, setState] = useState({
    currency: "BTC" as CurrencyMode,
    qrMode: "lnaddress" as QrMode,
    amount: "5000",
    customAmount: "",
    invoice: null as string | null,
    onChainAddress: null as string | null,
    loading: false,
    copied: false,
    error: null as string | null,
  });

  // ← Efecto para marcar montaje (previene hydration mismatch)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ── Generate invoice via proxy ──
  const generateInvoice = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setTimeout(() => {
      setState((s) => ({ ...s, loading: false, invoice: "lnbc1...", qrMode: "bolt11" }));
    }, 1500);
  }, [state.currency, state.amount, state.customAmount]);

  // ── Get on-chain address ──
  const fetchOnChainAddress = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setTimeout(() => {
      setState((s) => ({ ...s, loading: false, onChainAddress: "bc1q...", qrMode: "onchain" }));
    }, 1200);
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
    if (!isMounted) return "https://aceptabitcoin.mx"; // ← Placeholder seguro durante SSR
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

  const qrValue = getQrValue();
  const isBtc = state.currency === "BTC";

  return (
    <section className="relative py-24 overflow-hidden bg-black">
      <MatrixRain className="opacity-20" speed={0.75} />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.07)_1px,transparent_1px)] bg-[length:60px_60px] pointer-events-none" />

      <div className="container relative z-10 px-4 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-black/70 border border-matrix/30 rounded-full font-mono text-xs text-matrix tracking-[0.2em]">
            <Zap className="h-3.5 w-3.5 animate-pulse" />
            SISTEMA DE DONACIONES LIGHTNING ACTIVO
          </div>

          <h2 className="font-serif text-5xl md:text-6xl font-bold tracking-tighter text-white">
            Apoya la <span className="text-bitcoin drop-shadow-[0_0_25px_rgba(247,147,26,0.5)]">Resistencia</span><br /> 
            Financiera en México
          </h2>

          <p className="max-w-2xl mx-auto text-gray-400 font-mono text-lg leading-relaxed">
            Cada satoshi alimenta educación, adopción y soberanía.<br />
            <span className="text-matrix">Sin bancos. Sin custodia. Solo Bitcoin.</span>
          </p>
        </div>

        {/* Main Card */}
        <Card className="relative bg-black/80 backdrop-blur-2xl border border-white/10 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#00ff4122_0px,#00ff4122_1px,transparent_4px)] opacity-30 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-matrix to-transparent animate-scanline pointer-events-none" />

          <div className="p-8 md:p-12">
            
            {/* Currency Toggle */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex bg-black/60 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => toggleCurrency("BTC")}
                  className={`px-8 py-3 rounded-lg font-mono flex items-center gap-2 transition-all duration-200 ${
                    state.currency === "BTC"
                      ? "bg-bitcoin text-black shadow-[0_0_25px_rgba(247,147,26,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Bitcoin className="h-4 w-4" /> SATS
                </button>
                <button
                  onClick={() => toggleCurrency("USD")}
                  className={`px-8 py-3 rounded-lg font-mono flex items-center gap-2 transition-all duration-200 ${
                    state.currency === "USD"
                      ? "bg-matrix text-black shadow-[0_0_25px_rgba(0,255,65,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <DollarSign className="h-4 w-4" /> USD
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Controls Column */}
              <div className="space-y-8">
                
                {/* Preset Amounts */}
                <div>
                  <p className="font-mono text-xs text-matrix mb-3 tracking-widest">MONTO</p>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_AMOUNTS[state.currency].map((amt) => (
                      <button
                        key={amt}
                        onClick={() =>
                          setState((s) => ({ ...s, amount: amt, customAmount: "", invoice: null, error: null }))
                        }
                        className={`py-4 text-sm font-mono border rounded-xl transition-all duration-200 ${
                          state.amount === amt && !state.customAmount
                            ? isBtc
                              ? "bg-bitcoin text-black border-bitcoin shadow-[0_0_15px_rgba(247,147,26,0.3)]"
                              : "bg-matrix text-black border-matrix shadow-[0_0_15px_rgba(0,255,65,0.3)]"
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
                    className="mt-4 w-full bg-white/5 border border-white/20 rounded-2xl px-5 py-4 text-center font-mono text-lg text-white placeholder-gray-600 focus:border-matrix focus:ring-1 focus:ring-matrix/50 outline-none transition-all"
                  />
                </div>

                <Button
                  onClick={generateInvoice}
                  disabled={state.loading}
                  className={`w-full h-16 text-xl font-vt323 tracking-wider rounded-2xl transition-all duration-300 ${
                    isBtc
                      ? "bg-bitcoin hover:bg-bitcoin/90 text-black shadow-[0_0_25px_rgba(247,147,26,0.4)] hover:shadow-[0_0_35px_rgba(247,147,26,0.6)]"
                      : "bg-matrix hover:bg-matrix/90 text-black shadow-[0_0_25px_rgba(0,255,65,0.4)] hover:shadow-[0_0_35px_rgba(0,255,65,0.6)]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {state.loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">◐</span> GENERANDO...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      GENERAR INVOICE <Zap className="h-5 w-5" />
                    </span>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setState((s) => ({ ...s, qrMode: "lnaddress", invoice: null, error: null }))}
                    className={`rounded-xl transition-all duration-200 ${
                      state.qrMode === "lnaddress"
                        ? "border-matrix text-matrix bg-matrix/10"
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

                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-y-2 text-[10px] font-mono text-gray-500">
                    <div className="flex justify-between">
                      <span>Red:</span>
                      <span className="text-matrix">Lightning ⚡</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Procesador:</span>
                      <span className="text-bitcoin">Blink.sv</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Modo:</span>
                      <span className={isBtc ? "text-bitcoin" : "text-matrix"}>{isBtc ? "BTC Nativo" : "Stablesats"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comisión:</span>
                      <span className="text-gray-400">~0.02%</span>
                    </div>
                  </div>
                </div>

                {state.error && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span suppressHydrationWarning>{state.error}</span> {/* ← Extra safety */}
                  </div>
                )}
              </div>

              {/* QR Column */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <div
                    className={`absolute -inset-6 bg-gradient-to-br ${
                      isBtc ? "from-bitcoin/30 to-transparent" : "from-matrix/30 to-transparent"
                    } blur-3xl rounded-3xl pointer-events-none transition-opacity duration-500`}
                  />
                  <div className="relative bg-white p-5 rounded-3xl border border-white/30 shadow-2xl">
                    {/* ← QRCodeSVG solo se renderiza post-mount para evitar hydration mismatch */}
                    {isMounted ? (
                      <QRCodeSVG
                        value={qrValue}
                        size={260}
                        level="H"
                        bgColor="#ffffff"
                        fgColor="#000000"
                        className="rounded-2xl"
                        suppressHydrationWarning // ← Extra: suprime warnings de atributos dinámicos
                      />
                    ) : (
                      // Placeholder estático para SSR
                      <div className="w-[260px] h-[260px] bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Zap className="h-12 w-12 text-gray-400 animate-pulse" />
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
                    className="w-full max-w-xs flex items-center justify-between bg-white/5 border border-white/10 hover:border-matrix rounded-2xl px-5 py-4 text-sm font-mono text-gray-300 hover:text-matrix transition-all duration-200"
                    aria-live="polite"
                  >
                    <span className="truncate" suppressHydrationWarning>
                      {state.qrMode === "lnaddress"
                        ? LIGHTNING_ADDRESS
                        : state.invoice?.slice(0, 30) + "..."}
                    </span>
                    {state.copied ? (
                      <Check className="h-4 w-4 text-matrix flex-shrink-0" />
                    ) : (
                      <Copy className="h-4 w-4 flex-shrink-0" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center mt-10">
          <a
            href={BLINK_CONFIG.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Descargar Blink Wallet para pagar con Lightning Network"
            className="inline-flex items-center gap-2 text-matrix hover:text-bitcoin transition-colors duration-200 text-sm font-mono group"
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