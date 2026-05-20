'use client';

import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, Copy, Check, Bitcoin, DollarSign, QrCode, Wallet, 
  AlertCircle, Receipt, Sparkles 
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import MatrixRain from "@/components/ui/MatrixRain";
import { formatSats } from "@/lib/utils"; // ← Recomiendo mover aquí si no está

// ============================================================
// CAJA REGISTRADORA — Acepta Bitcoin México
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

export default function TipJarSection() {
  const [isMounted, setIsMounted] = useState(false);

  const [state, setState] = useState({
    currency: "USD" as CurrencyMode,
    qrMode: "lnaddress" as QrMode,
    amount: "100",
    customAmount: "",
    service: "consultoria" as ServiceType,
    invoice: null as string | null,
    onChainAddress: null as string | null,
    loading: false,
    copied: false,
    error: null as string | null,
    paid: false,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const generateInvoice = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const amount = Number(state.customAmount || state.amount);
      if (!amount || amount <= 0) throw new Error("Monto inválido");

      const res = await fetch('/api/tipjar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-invoice',
          amount,
          currency: state.currency,
          memo: `${SERVICE_LABELS[state.service]} - Acepta Bitcoin México`,
          service: state.service,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al generar invoice");
      }

      setState(s => ({
        ...s,
        loading: false,
        invoice: data.invoice,
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
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const res = await fetch('/api/tipjar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-onchain' }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Error al obtener dirección");

      setState(s => ({
        ...s,
        loading: false,
        onChainAddress: data.address,
        qrMode: 'onchain',
      }));
    } catch (err: any) {
      setState(s => ({ ...s, loading: false, error: err.message }));
    }
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setState(s => ({ ...s, copied: true }));
    setTimeout(() => setState(s => ({ ...s, copied: false })), 2000);
  }, []);

  const getQrValue = () => {
    if (state.qrMode === "bolt11" && state.invoice) return `lightning:${state.invoice}`;
    if (state.qrMode === "onchain" && state.onChainAddress) return `bitcoin:${state.onChainAddress}`;
    return `lightning:${LIGHTNING_ADDRESS}`;
  };

  const toggleCurrency = (currency: CurrencyMode) => {
    setState(s => ({
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

  const selectService = (service: ServiceType) => {
    setState(s => ({
      ...s,
      service,
      invoice: null,
      error: null,
    }));
  };

  const qrValue = getQrValue();
  const isSats = state.currency === "SATS";

  return (
    <section id="pagar-servicios" className="relative py-20 sm:py-28 overflow-hidden bg-black scroll-mt-24">
      <MatrixRain className="opacity-10" speed={0.6} />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.06)_1px,transparent_1px)] bg-[length:60px_60px]" />

      <div className="container relative z-10 px-4 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/70 border border-matrix/30 rounded-full font-mono text-xs text-matrix tracking-widest mb-6">
            <Receipt className="h-4 w-4" /> CAJA REGISTRADORA
          </div>

          <h2 className="font-serif text-5xl sm:text-6xl font-bold tracking-tighter">
            Paga con <span className="text-matrix">Bitcoin</span>
          </h2>
          <p className="mt-4 text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Cursos • Consultoría • Diseño • Implementaciones • Charlas
          </p>
        </div>

        <Card className="bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Currency Toggle */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex bg-black border border-white/10 rounded-2xl p-1">
                <button
                  onClick={() => toggleCurrency("SATS")}
                  className={`px-8 py-3.5 rounded-xl font-mono flex items-center gap-2 transition-all ${
                    isSats 
                      ? "bg-matrix text-black shadow-[0_0_25px_rgba(0,255,65,0.5)]" 
                      : "text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <Zap className="h-4 w-4" /> SATS
                </button>
                <button
                  onClick={() => toggleCurrency("USD")}
                  className={`px-8 py-3.5 rounded-xl font-mono flex items-center gap-2 transition-all ${
                    !isSats 
                      ? "bg-bitcoin text-black shadow-[0_0_25px_rgba(247,147,26,0.5)]" 
                      : "text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <DollarSign className="h-4 w-4" /> USD
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Controles */}
              <div className="space-y-8">
                {/* Servicios */}
                <div>
                  <p className="font-mono text-xs text-matrix mb-3 tracking-widest">SERVICIO</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => selectService(key as ServiceType)}
                        className={`px-4 py-2 text-sm rounded-full border transition-all ${
                          state.service === key 
                            ? "bg-matrix/10 border-matrix text-matrix" 
                            : "border-white/10 hover:border-white/30 text-gray-400"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Montos */}
                <div>
                  <p className="font-mono text-xs text-matrix mb-3 tracking-widest">MONTO</p>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_AMOUNTS[state.currency].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setState(s => ({ ...s, amount: amt, customAmount: "" }))}
                        className={`py-3 text-sm font-mono rounded-2xl border transition-all ${
                          state.amount === amt && !state.customAmount
                            ? isSats ? "bg-matrix text-black border-matrix" : "bg-bitcoin text-black border-bitcoin"
                            : "border-white/10 hover:border-white/30 bg-white/5"
                        }`}
                      >
                        {isSats ? formatSats(+amt) : `$${amt}`}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    placeholder="Otro monto"
                    value={state.customAmount}
                    onChange={(e) => setState(s => ({ ...s, customAmount: e.target.value, amount: "" }))}
                    className="mt-4 w-full bg-black/50 border border-white/20 rounded-2xl px-6 py-4 text-center font-mono text-lg focus:border-matrix focus:ring-matrix/30 outline-none"
                  />
                </div>

                {/* Botón Pagar */}
                <Button
                  onClick={generateInvoice}
                  disabled={state.loading}
                  className={`w-full h-16 text-lg font-bold rounded-2xl transition-all ${
                    isSats 
                      ? "bg-matrix hover:bg-matrix/90 text-black" 
                      : "bg-bitcoin hover:bg-bitcoin/90 text-black"
                  }`}
                >
                  {state.loading ? "GENERANDO INVOICE..." : "PAGAR CON LIGHTNING ⚡"}
                </Button>

                {/* Opciones alternativas */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => setState(s => ({...s, qrMode: "lnaddress", invoice: null}))}>
                    Lightning Address
                  </Button>
                  <Button variant="outline" onClick={fetchOnChainAddress}>
                    On-Chain BTC
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <div className={`absolute -inset-8 blur-3xl rounded-3xl transition-all ${
                    isSats ? "bg-matrix/30" : "bg-bitcoin/30"
                  }`} />
                  
                  <div className="relative bg-white p-5 rounded-3xl shadow-2xl">
                    <QRCodeSVG
                      value={qrValue}
                      size={260}
                      level="H"
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </div>

                {qrValue && (
                  <button
                    onClick={() => copyToClipboard(
                      state.qrMode === "lnaddress" ? LIGHTNING_ADDRESS : 
                      state.invoice || state.onChainAddress || ""
                    )}
                    className="mt-6 w-full max-w-xs flex items-center justify-between bg-white/5 border border-white/10 hover:border-matrix rounded-2xl px-5 py-4 text-sm font-mono"
                  >
                    <span className="truncate">
                      {state.qrMode === "lnaddress" ? LIGHTNING_ADDRESS : state.invoice?.slice(0, 30) + "..."}
                    </span>
                    {state.copied ? <Check className="text-matrix" /> : <Copy />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Footer info */}
        <div className="text-center mt-8 text-xs font-mono text-gray-500">
          Procesado de forma soberana vía <span className="text-matrix">Blink.sv</span>
        </div>
      </div>
    </section>
  );
}