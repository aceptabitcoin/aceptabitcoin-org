'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from 'qrcode.react';
import { 
  Zap, Copy, Check, CreditCard, ExternalLink, Coins, 
  Terminal, ShieldCheck, Banknote 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import MatrixRain from "@/components/ui/MatrixRain";
import ArcadeButton from "@/components/ui/ArcadeButton";

const CONFIG = {
  blinkBasePos: "https://pay.blink.sv/aceptabitcoin",
  lightningAddress: "aceptabitcoin@blink.sv",
  onChainAddress: "bc1qg6r7xugjlr4yzrqu5nal526e757pe3hnkp2jlg",
  mercadoPagoLink: "https://mpago.la/2wXyZz1",
  mercadoPagoAlias: "aceptabitcoin.mp",
};

const SERVICE_LABELS = {
  consultoria: "CONSULTORIA_TECNICA",
  curso: "CURSO_BITCOIN",
  diseno: "DISENO_WEB",
  charla: "CHARLA_EVENTO",
  donacion: "DONACION_SOBERANA",
} as const;

type ServiceType = keyof typeof SERVICE_LABELS;
type TabId = 'lightning' | 'onchain' | 'fiat';

export default function TipJarSection() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('lightning');
  const [copied, setCopied] = useState<string | null>(null); // ← Ahora es string | null para múltiples botones
  const [selectedService, setSelectedService] = useState<ServiceType>('consultoria');
  const [amount, setAmount] = useState<string>("250");
  const [currency, setCurrency] = useState<"USD" | "SATS">("USD");

  useEffect(() => { setIsMounted(true); }, []);

  const getThemeColor = () => {
    switch (activeTab) {
      case 'lightning':
      case 'onchain':
        return {
          hex: "#F7931A",
          shadow: "rgba(247, 147, 26, 0.4)",
          border: "border-orange-500/40",
          text: "text-bitcoin",
          // ✅ FIX 6: Clases de focus completas (Tailwind sí las detecta como strings literales)
          focusBorder: "focus:border-bitcoin",
          focusRing: "focus:ring-bitcoin/50",
        };
      case 'fiat':
        return {
          hex: "#00F0FF",
          shadow: "rgba(0, 240, 255, 0.4)",
          border: "border-cyan-400/40",
          text: "text-cyan-400",
          focusBorder: "focus:border-cyan-400",
          focusRing: "focus:ring-cyan-400/50",
        };
      default:
        return {
          hex: "#00FF41",
          shadow: "rgba(0, 255, 65, 0.35)",
          border: "border-matrix/40",
          text: "text-matrix",
          focusBorder: "focus:border-matrix",
          focusRing: "focus:ring-matrix/50",
        };
    }
  };

  const theme = getThemeColor();

  const getBlinkPosLink = () => {
    const memo = `${SERVICE_LABELS[selectedService]}_${amount}${currency}`;
    return `${CONFIG.blinkBasePos}?amount=${amount}&currency=${currency === 'USD' ? 'USD' : 'BTC'}&memo=${encodeURIComponent(memo)}&display=${currency}`;
  };

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    if (navigator.vibrate) navigator.vibrate(30);
    setTimeout(() => setCopied(null), 1800);
  };

  if (!isMounted) return null;

  // ✅ Inputs con tema reactivo (clases completas, Tailwind las detecta)
  const inputClasses = `bg-black border border-white/20 rounded-2xl px-4 py-3 font-mono text-sm text-white outline-none transition-colors ${theme.focusBorder} ${theme.focusRing} focus:ring-1`;

  // ✅ FIX 4: Componente CopyButton reutilizable
  const CopyButton = ({ text, label, className = "" }: { text: string; label: string; className?: string }) => (
    <button
      onClick={() => handleCopy(text, label)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs border border-white/20 bg-white/5 hover:bg-white/10 transition-all ${className}`}
    >
      {copied === label ? (
        <><Check size={14} className="text-green-400" /> <span className="text-green-400">COPIADO</span></>
      ) : (
        <><Copy size={14} /> <span className="text-gray-400">COPIAR</span></>
      )}
    </button>
  );

  return (
    <section id="pagar-servicios" className="relative py-20 overflow-hidden bg-black scroll-mt-24">
      {/* Matrix Rain */}
      <div className="absolute inset-0">
        {/* ✅ FIX 2: opacity-8 → opacity-[0.08] */}
        <MatrixRain
          className="opacity-[0.08]"
          speed={0.45}
          opacity={0.09}
          color={theme.hex}
        />
      </div>

      <div className="container relative z-10 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 bg-black/80 backdrop-blur-md border ${theme.border} rounded-full font-mono text-xs ${theme.text} tracking-[3px] uppercase mb-6`}
            style={{ boxShadow: `0 0 15px ${theme.shadow}` }}
          >
            {/* ✅ FIX 1: shadow dinámico vía inline style */}
            <Terminal className="h-4 w-4" /> TERMINAL MULTIPASARELA v2.1
          </div>

          <h2 className="font-serif text-5xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            TERMINAL DE <span className={`${theme.text} transition-colors duration-700`}>LIQUIDACIÓN</span>
          </h2>
          <p className="mt-4 font-mono text-sm text-gray-500 tracking-widest">INFRAESTRUCTURA SOBERANA • SIN CUSTODIA</p>
        </div>

        {/* Card Principal */}
        <Card
          className="relative bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          style={{
            boxShadow: `0 0 60px -15px ${theme.shadow}`,
            borderColor: `${theme.hex}33`
          }}
        >
          {/* ✅ FIX 3: animate-scanline (definida en tu tailwind.config.ts) */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.03)_50%)] bg-[length:100%_4px] pointer-events-none animate-scanline" />

          {/* Tabs */}
          <div className="flex p-2 gap-1.5 bg-black/70 border-b border-white/10">
            {[
              { id: 'lightning' as TabId, label: 'LIGHTNING ⚡', icon: <Zap size={15} /> },
              { id: 'onchain' as TabId, label: 'ON-CHAIN 🟠', icon: <Coins size={15} /> },
              { id: 'fiat' as TabId, label: 'FIAT / SPEI 💳', icon: <CreditCard size={15} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-vt323 text-lg font-bold tracking-wider transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-black text-white border border-white/30'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                style={activeTab === tab.id ? { boxShadow: `0 0 25px ${theme.shadow}` } : undefined}
              >
                {/* ✅ FIX 1: shadow dinámico vía inline style */}
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-8 md:p-14 min-h-[460px] flex flex-col items-center justify-center relative">
            <AnimatePresence mode="wait">

              {/* ═══════════ LIGHTNING TAB ═══════════ */}
              {activeTab === 'lightning' && (
                <motion.div key="lightning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md flex flex-col items-center">
                  <div className="w-full mb-8 grid grid-cols-2 gap-3">
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value as ServiceType)}
                      className={inputClasses}
                    >
                      {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={inputClasses}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">USD</span>
                    </div>
                  </div>

                  <ArcadeButton href={getBlinkPosLink()} target="_blank" variant="bitcoin" size="lg" className="w-full mb-8">
                    ABRIR POS BLINK ⚡
                  </ArcadeButton>

                  <div className="relative p-6 bg-white rounded-2xl border-2 border-orange-500/50 mb-8" style={{ boxShadow: `0 0 40px rgba(247,147,26,0.25)` }}>
                    <QRCodeSVG value={getBlinkPosLink()} size={180} level="H" fgColor="#000" bgColor="#fff" />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-bitcoin text-black text-xs font-mono font-bold px-4 py-1 rounded shadow-md">ESCANEAR → WALLET</div>
                  </div>

                  <CopyButton text={CONFIG.lightningAddress} label="lightning" />
                  <p className="mt-2 font-mono text-xs text-gray-500">{CONFIG.lightningAddress}</p>
                </motion.div>
              )}

              {/* ═══════════ ON-CHAIN TAB ═══════════ */}
              {activeTab === 'onchain' && (
                <motion.div key="onchain" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md flex flex-col items-center">
                  <div className="w-full mb-8 grid grid-cols-2 gap-3">
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value as ServiceType)}
                      className={inputClasses}
                    >
                      {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={inputClasses}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">USD</span>
                    </div>
                  </div>

                  <div className="relative p-6 bg-white rounded-2xl border-2 border-orange-500/50 mb-8" style={{ boxShadow: `0 0 40px rgba(247,147,26,0.25)` }}>
                    <QRCodeSVG
                      value={`bitcoin:${CONFIG.onChainAddress}?amount=${amount}&message=${SERVICE_LABELS[selectedService]}`}
                      size={180} level="H" fgColor="#000" bgColor="#fff"
                    />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-bitcoin text-black text-xs font-mono font-bold px-4 py-1 rounded shadow-md">ESCANEAR → WALLET</div>
                  </div>

                  <div className="w-full bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
                    <p className="font-mono text-[10px] text-gray-500 uppercase mb-2">DIRECCIÓN ON-CHAIN (BTC)</p>
                    <p className="font-mono text-xs text-white break-all select-all">{CONFIG.onChainAddress}</p>
                  </div>

                  <CopyButton text={CONFIG.onChainAddress} label="onchain" className="self-center" />

                  <div className="mt-4 flex items-center gap-2 text-amber-500/70 text-xs font-mono">
                    <ShieldCheck size={14} />
                    <span>CONFIRMAR EN 10-60 MIN • FEES DE RED</span>
                  </div>
                </motion.div>
              )}

              {/* ═══════════ FIAT TAB ═══════════ */}
              {activeTab === 'fiat' && (
                <motion.div key="fiat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md flex flex-col items-center">
                  <div className="w-full mb-6 grid grid-cols-2 gap-3">
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value as ServiceType)}
                      className={inputClasses}
                    >
                      {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={inputClasses}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">MXN</span>
                    </div>
                  </div>

                  <ArcadeButton
                    href={CONFIG.mercadoPagoLink}
                    target="_blank"
                    variant="matrix"
                    size="lg"
                    className="w-full mb-8"
                  >
                    PAGAR CON MERCADO PAGO 💳
                  </ArcadeButton>

                  <div className="w-full space-y-3">
                    <div className="bg-white/5 rounded-xl p-4 border border-cyan-400/20">
                      <p className="font-mono text-[10px] text-gray-500 uppercase mb-2">MERCADO PAGO</p>
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-sm text-white">{CONFIG.mercadoPagoAlias}</p>
                        <CopyButton text={CONFIG.mercadoPagoAlias} label="mp-alias" />
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-cyan-400/20">
                      <p className="font-mono text-[10px] text-gray-500 uppercase mb-2">LINK DIRECTO</p>
                      <a href={CONFIG.mercadoPagoLink} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-cyan-400 hover:underline truncate flex items-center gap-1">
                        mpago.la <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-cyan-400/70 text-xs font-mono">
                    <Banknote size={14} />
                    <span>PESO MXN • SIN FEES DE RED • INSTANTANEO</span>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </Card>

        <p className="text-center mt-8 font-mono text-xs text-gray-600 tracking-widest">ORACLE SYSTEM v2.1 • TRANSACCIÓN ENRUTADA EXTERNAMENTE</p>
      </div>
    </section>
  );
}