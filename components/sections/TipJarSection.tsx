"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Copy, Check, Bitcoin, DollarSign, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import MatrixRain from "@/components/ui/MatrixRain";
import { formatSats } from "@/lib/blink";

// ============================================================
// TIPJAR SECTION — Bitcoin Matrix Edition
// Acepta Bitcoin México | Oracle System v2.0
// Receives donations via Blink API (Lightning + Stablesats)
// ============================================================

type CurrencyMode = "BTC" | "USD";
type QrMode = "lnaddress" | "bolt11" | "onchain";

interface TipJarState {
  currency: CurrencyMode;
  qrMode: QrMode;
  amount: string;
  customAmount: string;
  invoice: string | null;
  onChainAddress: string | null;
  loading: boolean;
  copied: boolean;
  error: string | null;
}

const PRESET_AMOUNTS = {
  BTC: ["1000", "5000", "10000", "50000", "100000"],
  USD: ["1", "5", "10", "25", "50"],
};

const LIGHTNING_ADDRESS = "tu-wallet@blink.sv"; // ← CAMBIA ESTO por tu dirección real
const BLINK_HANDLE = "tu-wallet"; // ← CAMBIA ESTO por tu handle de Blink

"use client";

import { useState, useCallback } from "react";
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

// 🔹 CONFIGURACIÓN CENTRALIZADA (fácil mantenimiento)
const BLINK_CONFIG = {
  downloadUrl: "https://blink.sv/download",
  endorsement: "Patrocinado por Blink.sv",
};

const LIGHTNING_ADDRESS = "tu-wallet@blink.sv"; // ← Reemplazar con tu dirección real

type CurrencyMode = "BTC" | "USD";
type QrMode = "lnaddress" | "bolt11" | "onchain";

const PRESET_AMOUNTS = {
  BTC: ["1000", "5000", "10000", "25000", "50000"],
  USD: ["1", "5", "10", "25", "50"],
};

export default function TipJarSection() {
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

  // ── Generate invoice via proxy (placeholder) ──
  const generateInvoice = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    // TODO: Implementar llamada a /api/tipjar según README_TIPJAR.md
    setTimeout(() => {
      setState((s) => ({ ...s, loading: false, invoice: "lnbc1...", qrMode: "bolt11" }));
    }, 1500);
  }, [state.currency, state.amount, state.customAmount]);

  // ── Get on-chain address (placeholder) ──
  const fetchOnChainAddress = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    // TODO: Implementar llamada a /api/tipjar según README_TIPJAR.md
    setTimeout(() => {
      setState((s) => ({ ...s, loading: false, onChainAddress: "bc1q...", qrMode: "onchain" }));
    }, 1200);
  }, []);

  // ── Copy to clipboard with feedback ──
  const copyToClipboard = useCallback(async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setState((s) => ({ ...s, copied: true }));
    setTimeout(() => setState((s) => ({ ...s, copied: false })), 2000);
  }, []);

  // ── Build QR value ──
  const getQrValue = useCallback(() => {
    if (state.qrMode === "lnaddress") return `lightning:${LIGHTNING_ADDRESS}`;
    if (state.qrMode === "bolt11" && state.invoice) return `lightning:${state.invoice}`;
    if (state.qrMode === "onchain" && state.onChainAddress) return `bitcoin:${state.onChainAddress}`;
    return "";
  }, [state.qrMode, state.invoice, state.onChainAddress]);

  // ── Toggle currency with reset ──
  const toggleCurrency = (currency: CurrencyMode) => {
    setState((s) => ({
      ...s,
      currency,
      amount: PRESET_AMOUNTS[currency][2], // default medio
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
      {/* Background Layers */}
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
          {/* Visual Effects */}
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

                  {/* Custom Amount Input */}
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

                {/* Generate Button — Tokens Tailwind, NO inline styles */}
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

                {/* Mode Buttons */}
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

                {/* 🔹 Technical Info Panel (Reintegrado - compacto) */}
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

                {/* 🔹 Error State Display (UX crítica) */}
                {state.error && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{state.error}</span>
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
                    <QRCodeSVG
                      value={qrValue || "https://aceptabitcoin.mx"}
                      size={260}
                      level="H"
                      bgColor="#ffffff"
                      fgColor="#000000"
                      className="rounded-2xl"
                    />
                  </div>
                </div>

                {/* Copy Button with Accessibility */}
                {qrValue && (
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
                    <span className="truncate">
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

        {/* 🔹 Blink Endorsement — Seguridad + Accesibilidad */}
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

<environment_details>
Current time: 2026-05-02T01:44:48-06:00
Active file: components\sections\TipJarSection.tsx
Visible files:
  components\sections\TipJarSection.tsx
Open tabs:
  components/sections/TipJarSection.tsx
</environment_details>
  const [state, setState] = useState<TipJarState>({
    currency: "BTC",
    qrMode: "lnaddress",
    amount: "1000",
    customAmount: "",
    invoice: null,
    onChainAddress: null,
    loading: false,
    copied: false,
    error: null,
  });

  // ── Generate invoice via proxy ──
  const generateInvoice = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const isBtc = state.currency === "BTC";
      const amountNum = parseInt(state.customAmount || state.amount, 10);

      if (!amountNum || amountNum <= 0) {
        throw new Error("Monto inválido");
      }

      const operation = isBtc ? "LnInvoiceCreate" : "LnUsdInvoiceCreate";
      const variables = {
        input: {
          amount: isBtc ? amountNum : amountNum * 100, // USD en centavos
          memo: `Donación Acepta Bitcoin México — ${isBtc ? amountNum + " sats" : "$" + amountNum + " USD"}`,
        },
      };

      const res = await fetch("/api/tipjar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation, variables }),
      });

      const data = await res.json();

      if (data.errors || data.data?.[Object.keys(data.data)[0]]?.errors?.length) {
        const apiErrors = data.data?.[Object.keys(data.data)[0]]?.errors;
        throw new Error(apiErrors?.[0]?.message || "Error de API");
      }

      const invoiceKey = isBtc ? "lnInvoiceCreate" : "lnUsdInvoiceCreate";
      const paymentRequest = data.data[invoiceKey].invoice.paymentRequest;

      setState((s) => ({
        ...s,
        invoice: paymentRequest,
        qrMode: "bolt11",
        loading: false,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        error: (err as Error).message,
        loading: false,
      }));
    }
  }, [state.currency, state.amount, state.customAmount]);

  // ── Get on-chain address ──
  const fetchOnChainAddress = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const res = await fetch("/api/tipjar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "OnChainAddressCurrent",
          variables: { input: {} },
        }),
      });

      const data = await res.json();
      const address = data.data?.onChainAddressCurrent?.address;

      if (!address) throw new Error("No se pudo obtener dirección on-chain");

      setState((s) => ({
        ...s,
        onChainAddress: address,
        qrMode: "onchain",
        loading: false,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        error: (err as Error).message,
        loading: false,
      }));
    }
  }, []);

  // ── Copy to clipboard ──
  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setState((s) => ({ ...s, copied: true }));
    setTimeout(() => setState((s) => ({ ...s, copied: false })), 2000);
  }, []);

  // ── Build QR value ──
  const getQrValue = useCallback(() => {
    switch (state.qrMode) {
      case "lnaddress":
        return `lightning:${LIGHTNING_ADDRESS}`;
      case "bolt11":
        return state.invoice ? `lightning:${state.invoice}` : "";
      case "onchain":
        return state.onChainAddress ? `bitcoin:${state.onChainAddress}` : "";
      default:
        return "";
    }
  }, [state.qrMode, state.invoice, state.onChainAddress]);

  // ── Toggle currency ──
  const toggleCurrency = useCallback((currency: CurrencyMode) => {
    setState((s) => ({
      ...s,
      currency,
      amount: PRESET_AMOUNTS[currency][1],
      customAmount: "",
      invoice: null,
      qrMode: "lnaddress",
      error: null,
    }));
  }, []);

  const qrValue = getQrValue();

  return (
    <section className="py-24 relative overflow-hidden bg-black">
      {/* ═══════════════════════════════════════════════════════════
          BACKGROUND LAYERS — Matrix Rain + Grid + Glow
          ═══════════════════════════════════════════════════════════ */}
      
      {/* Matrix Rain Code Falling */}
      <MatrixRain 
        className="opacity-30" 
        speed={0.8} 
        density={25}
        opacity={0.1}
      />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(0, 255, 65, 0.08) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Ambient Glow — Bitcoin Orange */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-bitcoin/5 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Secondary Matrix Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-matrix/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* ═══════════════════════════════════════════════════════
              HEADER — Institutional + Technical
              ═══════════════════════════════════════════════════════ */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 bg-matrix/10 border border-matrix/30 px-4 py-1.5 rounded-full text-matrix text-xs font-bold uppercase tracking-[0.2em] font-mono">
              <Zap className="h-3 w-3 animate-pulse" />
              <span className="animate-blink">_</span> Sistema de Donaciones Activo
            </div>

            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Impulsando la
              <br />
              <span className="text-bitcoin drop-shadow-[0_0_25px_rgba(247,147,26,0.5)]">
                Soberanía Financiera
              </span>
            </h2>

            <p className="font-mono text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Tu contribución alimenta la infraestructura educativa de Bitcoin en México.
              <br />
              <span className="text-matrix">100% sin intermediarios.</span> Lightning Network. Instantáneo.
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════
              MAIN CARD — Bunker Glassmorphism
              ═══════════════════════════════════════════════════════ */}
          <Card className="relative border border-white/10 bg-black/70 backdrop-blur-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]">
            
            {/* Scanline Effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-bitcoin/60 to-transparent opacity-40 animate-scanline pointer-events-none" />
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-matrix/30 pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-matrix/30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-matrix/30 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-matrix/30 pointer-events-none" />

            <div className="p-8 md:p-12">
              
              {/* Currency Toggle */}
              <div className="flex justify-center mb-10">
                <div className="inline-flex bg-white/5 border border-white/10 rounded-lg p-1">
                  <button
                    onClick={() => toggleCurrency("BTC")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-mono font-bold transition-all duration-300 ${
                      state.currency === "BTC"
                        ? "bg-bitcoin text-black shadow-[0_0_20px_rgba(247,147,26,0.4)]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Bitcoin className="h-4 w-4" />
                    BTC (Sats)
                  </button>
                  <button
                    onClick={() => toggleCurrency("USD")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-mono font-bold transition-all duration-300 ${
                      state.currency === "USD"
                        ? "bg-matrix text-black shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <DollarSign className="h-4 w-4" />
                    Stablesats USD
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-start">
                
                {/* ═══════════════════════════════════════════════
                    LEFT COLUMN — Controls & Info
                    ═══════════════════════════════════════════════ */}
                <div className="space-y-8">
                  
                  {/* Amount Selection */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">
                      <span className="text-matrix">❯</span> Selecciona Monto
                      <span className="text-matrix animate-pulse">_</span>
                    </label>
                    
                    <div className="grid grid-cols-5 gap-2">
                      {PRESET_AMOUNTS[state.currency].map((amt) => (
                        <button
                          key={amt}
                          onClick={() =>
                            setState((s) => ({
                              ...s,
                              amount: amt,
                              customAmount: "",
                              invoice: null,
                              qrMode: "lnaddress",
                              error: null,
                            }))
                          }
                          className={`relative py-3 text-xs font-mono font-bold border rounded transition-all duration-200 overflow-hidden ${
                            state.amount === amt && !state.customAmount
                              ? state.currency === "BTC"
                                ? "bg-bitcoin text-black border-bitcoin shadow-[0_0_15px_rgba(247,147,26,0.3)]"
                                : "bg-matrix text-black border-matrix shadow-[0_0_15px_rgba(0,255,65,0.3)]"
                              : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white bg-white/5"
                          }`}
                        >
                          {state.currency === "BTC" ? (
                            <>
                              {formatSats(parseInt(amt))}
                              <span className="block text-[9px] opacity-60 mt-0.5">sats</span>
                            </>
                          ) : (
                            <>
                              ${amt}
                              <span className="block text-[9px] opacity-60 mt-0.5">USD</span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount Input */}
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={`Monto personalizado (${state.currency === "BTC" ? "sats" : "USD"})`}
                        value={state.customAmount}
                        onChange={(e) =>
                          setState((s) => ({
                            ...s,
                            customAmount: e.target.value,
                            amount: "",
                            invoice: null,
                            qrMode: "lnaddress",
                            error: null,
                          }))
                        }
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-sm font-mono text-white placeholder-gray-600 focus:border-matrix focus:ring-1 focus:ring-matrix/50 outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">
                        {state.currency === "BTC" ? "sats" : "USD"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={generateInvoice}
                      disabled={state.loading}
                      className={`w-full h-12 font-vt323 text-lg tracking-wide rounded-lg transition-all duration-300 ${
                        state.currency === "BTC"
                          ? "bg-bitcoin hover:bg-bitcoin/90 text-black shadow-[0_0_25px_rgba(247,147,26,0.3)] hover:shadow-[0_0_35px_rgba(247,147,26,0.5)]"
                          : "bg-matrix hover:bg-matrix/90 text-black shadow-[0_0_25px_rgba(0,255,65,0.3)] hover:shadow-[0_0_35px_rgba(0,255,65,0.5)]"
                      }`}
                    >
                      {state.loading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">◐</span>
                          Generando Invoice...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Generar Invoice Lightning
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setState((s) => ({
                            ...s,
                            qrMode: "lnaddress",
                            invoice: null,
                            error: null,
                          }))
                        }
                        className={`h-10 font-mono text-xs border rounded-lg transition-all ${
                          state.qrMode === "lnaddress"
                            ? "border-matrix text-matrix bg-matrix/10"
                            : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        <QrCode className="h-3 w-3 mr-2" />
                        Lightning Address
                      </Button>
                      <Button
                        variant="outline"
                        onClick={fetchOnChainAddress}
                        disabled={state.loading}
                        className={`h-10 font-mono text-xs border rounded-lg transition-all ${
                          state.qrMode === "onchain"
                            ? "border-bitcoin text-bitcoin bg-bitcoin/10"
                            : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        <Bitcoin className="h-3 w-3 mr-2" />
                        On-Chain
                      </Button>
                    </div>
                  </div>

                  {/* Error Display */}
                  {state.error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs font-mono">
                      <span className="text-red-500">[ERROR]</span> {state.error}
                    </div>
                  )}

                  {/* Info Panel */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-matrix animate-pulse" />
                      Información Técnica
                    </div>
                    <div className="space-y-1 text-xs font-mono text-gray-400">
                      <div className="flex justify-between">
                        <span>Red:</span>
                        <span className="text-matrix">Lightning Network ⚡</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Procesador:</span>
                        <span className="text-bitcoin">Blink.sv</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modo:</span>
                        <span className={state.currency === "BTC" ? "text-bitcoin" : "text-matrix"}>
                          {state.currency === "BTC" ? "Bitcoin Nativo" : "Stablesats USD"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comisión:</span>
                        <span className="text-gray-300">~0.02% routing</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════
                    RIGHT COLUMN — QR Code Display
                    ═══════════════════════════════════════════════ */}
                <div className="flex flex-col items-center justify-center space-y-6">
                  
                  {/* QR Container */}
                  <div className="relative group">
                    {/* Glow Ring */}
                    <div className={`absolute -inset-4 rounded-2xl blur-xl opacity-30 transition-opacity duration-500 group-hover:opacity-50 ${
                      state.currency === "BTC" ? "bg-bitcoin" : "bg-matrix"
                    }`} />
                    
                    {/* QR Card */}
                    <div className="relative bg-white rounded-xl p-6 border-2 border-white/20 shadow-2xl">
                      {qrValue ? (
                        <QRCodeSVG
                          value={qrValue}
                          size={220}
                          level="H"
                          includeMargin={false}
                          className="w-full h-full"
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                        />
                      ) : (
                        <div className="w-[220px] h-[220px] flex items-center justify-center bg-gray-100 rounded-lg">
                          <QrCode className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                      
                      {/* Mode Badge */}
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                        <div className={`px-4 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border whitespace-nowrap ${
                          state.qrMode === "lnaddress"
                            ? "bg-black border-matrix text-matrix"
                            : state.qrMode === "bolt11"
                            ? state.currency === "BTC"
                              ? "bg-black border-bitcoin text-bitcoin"
                              : "bg-black border-matrix text-matrix"
                            : "bg-black border-bitcoin text-bitcoin"
                        }`}>
                          {state.qrMode === "lnaddress" && "⚡ Lightning Address"}
                          {state.qrMode === "bolt11" && "⚡ Invoice BOLT11"}
                          {state.qrMode === "onchain" && "₿ On-Chain"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Copy / Address Display */}
                  <div className="w-full max-w-sm space-y-3">
                    {state.qrMode === "lnaddress" && (
                      <button
                        onClick={() => copyToClipboard(LIGHTNING_ADDRESS)}
                        className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs font-mono text-gray-300 hover:border-matrix/50 hover:text-matrix transition-all group"
                      >
                        <span className="truncate">{LIGHTNING_ADDRESS}</span>
                        {state.copied ? (
                          <Check className="h-4 w-4 text-matrix flex-shrink-0" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-500 group-hover:text-matrix flex-shrink-0 transition-colors" />
                        )}
                      </button>
                    )}

                    {state.qrMode === "bolt11" && state.invoice && (
                      <button
                        onClick={() => copyToClipboard(state.invoice!)}
                        className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs font-mono text-gray-300 hover:border-bitcoin/50 hover:text-bitcoin transition-all group"
                      >
                        <span className="truncate">{state.invoice.slice(0, 24)}...</span>
                        {state.copied ? (
                          <Check className="h-4 w-4 text-bitcoin flex-shrink-0" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-500 group-hover:text-bitcoin flex-shrink-0 transition-colors" />
                        )}
                      </button>
                    )}

                    {state.qrMode === "onchain" && state.onChainAddress && (
                      <button
                        onClick={() => copyToClipboard(state.onChainAddress!)}
                        className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs font-mono text-gray-300 hover:border-bitcoin/50 hover:text-bitcoin transition-all group"
                      >
                        <span className="truncate">{state.onChainAddress}</span>
                        {state.copied ? (
                          <Check className="h-4 w-4 text-bitcoin flex-shrink-0" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-500 group-hover:text-bitcoin flex-shrink-0 transition-colors" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Open in Wallet Button */}
                  {qrValue && (
                    <Button
                      asChild
                      className={`w-full max-w-sm font-vt323 text-lg tracking-wide rounded-lg transition-all ${
                        state.currency === "BTC"
                          ? "bg-bitcoin/10 border border-bitcoin/30 text-bitcoin hover:bg-bitcoin hover:text-black"
                          : "bg-matrix/10 border border-matrix/30 text-matrix hover:bg-matrix hover:text-black"
                      }`}
                    >
                      <a
                        href={qrValue}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3"
                      >
                        <Zap className="h-4 w-4" />
                        Abrir en Wallet
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  {/* Static Address Note */}
                  {state.qrMode === "lnaddress" && (
                    <p className="text-[10px] text-gray-600 font-mono text-center max-w-xs">
                      <span className="text-matrix">❯</span> Esta dirección es estática.
                      <br />
                      Puedes imprimirla o compartirla en redes sociales.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* ═══════════════════════════════════════════════════════
              FOOTER DISCLAIMER
              ═══════════════════════════════════════════════════════ */}
          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">
              <span className="text-matrix">❯</span> Infraestructura gestionada por{" "}
              <span className="text-bitcoin">Blink.sv</span> — El Salvador{" "}
              <span className="text-matrix">❯</span> Sin custodia. Sin KYC para recepción.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}