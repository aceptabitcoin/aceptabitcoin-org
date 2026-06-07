'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from 'qrcode.react';
import { 
  Zap, Copy, Check, CreditCard, ExternalLink, Coins, 
  Terminal, ShieldCheck 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import MatrixRain from "@/components/ui/MatrixRain";

// ============================================================
// CONFIGURACIÓN DE INFRAESTRUCTURA EXTERNA
// ============================================================
const CONFIG = {
  blinkBasePos: "https://pay.blink.sv/aceptabitcoin",
  lightningAddress: "aceptabitcoin@blink.sv", 
  onChainAddress: "bc1qg6r7xugjlr4yzrqu5nal526e757pe3hnkp2jlg",
  mercadoPagoLink: "https://mpago.la/2wXyZz1", 
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
  const [copied, setCopied] = useState(false);
  
  const [selectedService, setSelectedService] = useState<ServiceType>('consultoria');
  const [amount, setAmount] = useState<string>("250");
  const [currency, setCurrency] = useState<"USD" | "SATS">("USD");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Coordenadas dinámicas de color según la red seleccionada
  const getThemeColor = () => {
    switch (activeTab) {
      case 'lightning':
      case 'onchain':
        return {
          hex: "#F7931A", // Bitcoin Orange
          shadow: "rgba(247, 147, 26, 0.25)",
          border: "border-orange-500/30",
          text: "text-bitcoin",
          bg: "bg-orange-500"
        };
      case 'fiat':
        return {
          hex: "#00F0FF", // Cian Cypherpunk / Terminal Blue
          shadow: "rgba(0, 240, 255, 0.25)",
          border: "border-cyan-500/30",
          text: "text-cyan-400",
          bg: "bg-cyan-500"
        };
      default:
        return {
          hex: "#00FF41", // Verde Matrix por defecto
          shadow: "rgba(0, 255, 65, 0.25)",
          border: "border-matrix/30",
          text: "text-matrix",
          bg: "bg-matrix"
        };
    }
  };

  const theme = getThemeColor();

  const getBlinkPosLink = () => {
    const memo = `${SERVICE_LABELS[selectedService]}_${amount}${currency}`;
    return `${CONFIG.blinkBasePos}?amount=${amount}&currency=${currency === 'USD' ? 'USD' : 'BTC'}&memo=${encodeURIComponent(memo)}&display=${currency}`;
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isMounted) return null;

  return (
    <section id="pagar-servicios" className="relative py-20 overflow-hidden bg-black scroll-mt-24">
      {/* Lluvia Matrix Reactiva con Color Dinámico */}
      <div className="absolute inset-0 transition-colors duration-700">
        <MatrixRain className="opacity-10" speed={0.4} color={theme.hex} />
      </div>
      
      <div className="container relative z-10 px-4 max-w-4xl mx-auto">
        
        {/* Header Matrix */}
        <div className="text-center mb-12">
          <div 
            className={`inline-flex items-center gap-2 px-3 py-1 bg-black border ${theme.border} rounded-full font-mono text-[10px] ${theme.text} tracking-widest uppercase mb-4 transition-all duration-500`}
            style={{ boxShadow: `0 0 10px ${theme.shadow}` }}
          >
            <Terminal className="h-3 w-3" /> Terminal Multipasarela v2.1
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-black text-white uppercase tracking-tight drop-shadow-lg">
            Terminal de <span className={`${theme.text} transition-colors duration-500`}>Liquidación</span>
          </h2>
          <p className="mt-3 font-mono text-xs text-gray-500 uppercase tracking-wider">
            Protocolo seguro enrutado externamente • Infraestructura Soberana
          </p>
        </div>

        {/* Contenedor Principal con Bordes e Iluminación Reactiva */}
        <Card 
          className="bg-neutral-900/90 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-700"
          style={{ 
            borderColor: theme.hex + "33",
            boxShadow: `0 0 40px -10px ${theme.shadow}` 
          }}
        >
          
          {/* Tabs de Navegación Estilo Terminal */}
          <div className="flex p-1.5 gap-1 bg-black/50 border-b border-white/5">
            {[
              { id: 'lightning', label: 'LIGHTNING ⚡', icon: <Zap size={14} />, activeBg: 'bg-orange-500 text-black shadow-[0_0_15px_rgba(247,147,26,0.4)]' },
              { id: 'onchain', label: 'ON-CHAIN 🟠', icon: <Coins size={14} />, activeBg: 'bg-orange-500 text-black shadow-[0_0_15px_rgba(247,147,26,0.4)]' },
              { id: 'fiat', label: 'FIAT / SPEI 💳', icon: <CreditCard size={14} />, activeBg: 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-lg 
                           font-mono text-xs font-bold transition-all duration-300 uppercase tracking-wider
                           ${activeTab === tab.id 
                             ? tab.activeBg 
                             : 'text-gray-500 hover:text-white hover:bg-white/5'
                           }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-8 md:p-12 min-h-[420px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: LIGHTNING NETWORK */}
              {activeTab === 'lightning' && (
                <motion.div
                  key="lightning"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full max-w-md flex flex-col items-center"
                >
                  <div className="w-full mb-6 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <select 
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value as ServiceType)}
                        className="bg-black border border-white/20 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:border-orange-500/50 outline-none transition-all appearance-none cursor-pointer"
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
                          className="w-full bg-black border border-white/20 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:border-orange-500/50 outline-none transition-all"
                        />
                        <span className="absolute right-3 top-3 text-[10px] text-gray-500 font-mono pointer-events-none">USD</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={getBlinkPosLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mb-6 py-4 px-6 rounded-xl bg-bitcoin hover:bg-orange-500 text-black font-mono font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(247,147,26,0.35)] transition-all transform hover:-translate-y-1"
                  >
                    <Zap size={16} fill="currentColor" />
                    ABRIR POS EN BLINK
                    <ExternalLink size={14} />
                  </a>

                  <div className="relative p-4 rounded-xl bg-white border-2 border-orange-500/40 shadow-[0_0_20px_rgba(247,147,26,0.15)] mb-6">
                    <QRCodeSVG
                      value={getBlinkPosLink()}
                      size={160}
                      level="H"
                      includeMargin={false}
                      fgColor="#000000"
                      bgColor="#FFFFFF"
                    />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-500 text-black text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                      ESCANEAR CON TU WALLET
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(CONFIG.lightningAddress)}
                    className="inline-flex items-center justify-between w-full px-4 py-3 rounded-lg 
                               bg-white/5 border border-white/10 hover:border-orange-500/40
                               font-mono text-[10px] text-gray-400 hover:text-orange-400 transition-all group"
                  >
                    <span className="truncate mr-2">{CONFIG.lightningAddress}</span>
                    {copied ? <Check size={12} className="text-orange-400" /> : <Copy size={12} className="opacity-50 group-hover:opacity-100" />}
                  </button>
                </motion.div>
              )}

              {/* TAB 2: BITCOIN ON-CHAIN */}
              {activeTab === 'onchain' && (
                <motion.div
                  key="onchain"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full max-w-md text-center"
                >
                  <div className="mb-6 p-4 rounded-xl bg-black/50 border border-dashed border-orange-500/30">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-bitcoin font-bold mb-1 flex items-center justify-center gap-2">
                      <ShieldCheck size={12} /> Liquidación Capa Base
                    </p>
                    <p className="font-mono text-[10px] text-gray-500 leading-relaxed">
                      Recomendado para montos institucionales. 
                      <br/>
                      <span className="text-gray-400">Acreditación: 1 confirmación on-chain.</span>
                    </p>
                  </div>

                  <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-3">
                    Dirección Bitcoin Institucional:
                  </p>
                  
                  <button
                    onClick={() => handleCopy(CONFIG.onChainAddress)}
                    className={`group relative w-full p-4 rounded-xl border transition-all duration-300 text-left
                               ${copied 
                                 ? 'border-orange-500 bg-orange-500/10' 
                                 : 'border-white/10 bg-black hover:border-orange-500/50'
                               }`}
                  >
                    <code className="font-mono text-xs text-bitcoin break-all block pr-8 font-medium">
                      {CONFIG.onChainAddress}
                    </code>
                    
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {copied ? <Check size={14} className="text-orange-400" /> : <Copy size={14} className="text-gray-600 group-hover:text-bitcoin" />}
                    </div>
                  </button>
                </motion.div>
              )}

              {/* TAB 3: FIAT (MERCADO PAGO) */}
              {activeTab === 'fiat' && (
                <motion.div
                  key="fiat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full max-w-sm text-center"
                >
                  <div className="mb-8">
                    <h4 className="font-serif text-xl text-white mb-2">
                      Pasarela Fiat Coadyuvante
                    </h4>
                    <p className="font-mono text-xs text-gray-500 leading-relaxed">
                      Soporte para Tarjetas de Crédito, Débito y transferencias bancarias SPEI vía Mercado Pago.
                    </p>
                  </div>

                  <a
                    href={CONFIG.mercadoPagoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center gap-3 
                               w-full py-4 px-6 rounded-xl overflow-hidden
                               bg-[#009EE3] hover:bg-[#008bc9] text-white
                               font-mono font-bold text-sm transition-all duration-300
                               shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] transform hover:-translate-y-1"
                  >
                    <span className="relative z-10 flex items-center gap-2 tracking-wide">
                      REDIRIGIR A MERCADO PAGO
                      <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </a>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-5 opacity-40 grayscale hover:grayscale-0 transition-all">
                    <span className="text-[10px] font-mono font-bold text-white tracking-widest">VISA</span>
                    <span className="text-[10px] font-mono font-bold text-white tracking-widest">MASTERCARD</span>
                    <span className="text-[10px] font-mono font-bold text-white tracking-widest">SPEI_BANCARIO</span>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </Card>

        <div className="text-center mt-6 font-mono text-[10px] text-gray-600 uppercase tracking-widest">
          Transacción procesada externamente • Sin custodia local • Oracle System v2.1
        </div>
      </div>
    </section>
  );
}