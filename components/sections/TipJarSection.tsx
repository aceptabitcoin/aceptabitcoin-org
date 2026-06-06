'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from 'qrcode.react';
import { 
  Zap, Copy, Check, CreditCard, ExternalLink, Coins, 
  Terminal, ShieldCheck, Receipt 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import MatrixRain from "@/components/ui/MatrixRain";

// ============================================================
// CONFIGURACIÓN DE INFRAESTRUCTURA EXTERNA
// ============================================================
const CONFIG = {
  // Blink POS Base URL
  blinkBasePos: "https://pay.blink.sv/aceptabitcoin",
  
  // Lightning Address para copiar manual
  lightningAddress: "aceptabitcoin@blink.sv", 
  
  // Dirección On-Chain (Reemplazar con la tuya actual si cambia)
  onChainAddress: "bc1qg6r7xugjlr4yzrqu5nal526e757pe3hnkp2jlg",
  
  // Mercado Pago Link (Ejemplo genérico, actualizar con el real)
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
  
  // Estado para construir el link dinámico
  const [selectedService, setSelectedService] = useState<ServiceType>('consultoria');
  const [amount, setAmount] = useState<string>("250");
  const [currency, setCurrency] = useState<"USD" | "SATS">("USD");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Construcción dinámica del Link de Blink
  const getBlinkPosLink = () => {
    const memo = `${SERVICE_LABELS[selectedService]}_${amount}${currency}`;
    // Blink soporta amount=0 para que el usuario elija, o un monto fijo
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
      <MatrixRain className="opacity-10" speed={0.5} />
      
      <div className="container relative z-10 px-4 max-w-4xl mx-auto">
        
        {/* Header Matrix */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black border border-matrix/30 rounded-full font-mono text-[10px] text-matrix tracking-widest uppercase mb-4">
            <Terminal className="h-3 w-3" /> Infraestructura de Pago Externa
          </div>
          <h2 className="font-serif text-4xl font-black text-white uppercase tracking-tight">
            Terminal de <span className="text-bitcoin">Liquidación</span>
          </h2>
          <p className="mt-2 font-mono text-xs text-gray-500 uppercase">
            Proceso seguro gestionado por Blink.sv & Mercado Pago
          </p>
        </div>

        <Card className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Tabs de Navegación Estilo Terminal */}
          <div className="flex p-1.5 gap-1 bg-black/50 border-b border-white/10">
            {[
              { id: 'lightning', label: 'LIGHTNING ⚡', icon: <Zap size={14} /> },
              { id: 'onchain', label: 'ON-CHAIN 🟠', icon: <Coins size={14} /> },
              { id: 'fiat', label: 'FIAT / SPEI 💳', icon: <CreditCard size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-lg 
                           font-mono text-xs font-bold transition-all duration-300 uppercase tracking-wider
                           ${activeTab === tab.id 
                             ? 'text-black bg-matrix shadow-[0_0_15px_rgba(0,255,65,0.4)]' 
                             : 'text-gray-500 hover:text-white hover:bg-white/5'
                           }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-8 md:p-12 min-h-[400px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: LIGHTNING NETWORK (Principal) */}
              {activeTab === 'lightning' && (
                <motion.div
                  key="lightning"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full max-w-md flex flex-col items-center"
                >
                  {/* Selector de Servicio y Monto (Para generar el Memo correcto) */}
                  <div className="w-full mb-8 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <select 
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value as ServiceType)}
                        className="bg-black border border-white/20 rounded-lg px-3 py-2 font-mono text-xs text-white focus:border-matrix outline-none"
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
                          className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 font-mono text-xs text-white focus:border-matrix outline-none"
                        />
                        <span className="absolute right-3 top-2 text-[10px] text-gray-500 font-mono">USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Botón Principal: Abrir POS */}
                  <a
                    href={getBlinkPosLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mb-6 py-4 px-6 rounded-xl bg-bitcoin hover:bg-orange-500 text-black font-mono font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(247,147,26,0.3)] transition-all transform hover:-translate-y-1"
                  >
                    <Zap size={16} fill="currentColor" />
                    INICIAR SESIÓN DE PAGO (BLINK)
                    <ExternalLink size={14} />
                  </a>

                  {/* QR Nativo SVG */}
                  <div className="relative p-4 rounded-xl bg-white border-2 border-matrix/50 shadow-[0_0_15px_rgba(0,255,65,0.2)] mb-4">
                    <QRCodeSVG
                      value={getBlinkPosLink()}
                      size={160}
                      level="H"
                      includeMargin={false}
                      fgColor="#000000"
                      bgColor="#FFFFFF"
                    />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-matrix text-black text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                      ESCANEAR PARA PAGAR
                    </div>
                  </div>

                  {/* Copiar Address como respaldo */}
                  <button
                    onClick={() => handleCopy(CONFIG.lightningAddress)}
                    className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-lg 
                              bg-white/5 border border-white/10 hover:border-matrix/50
                              font-mono text-[10px] text-gray-400 hover:text-matrix transition-all group"
                  >
                    <span className="truncate mr-2">{CONFIG.lightningAddress}</span>
                    {copied ? <Check size={12} className="text-matrix" /> : <Copy size={12} className="opacity-50 group-hover:opacity-100" />}
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
                  <div className="mb-6 p-4 rounded-xl bg-black/50 border border-dashed border-bitcoin/30">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-bitcoin font-bold mb-1 flex items-center justify-center gap-2">
                      <ShieldCheck size={12} /> Capa Base Segura
                    </p>
                    <p className="font-mono text-[10px] text-gray-500 leading-relaxed">
                      Para montos mayores o cold storage.
                      <br/>
                      <span className="text-gray-400">Confirmación: ~10-60 min.</span>
                    </p>
                  </div>

                  <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                    Dirección Bitcoin (Bech32):
                  </p>
                  
                  <button
                    onClick={() => handleCopy(CONFIG.onChainAddress)}
                    className={`group relative w-full p-4 rounded-xl border transition-all duration-300 text-left
                               ${copied 
                                 ? 'border-matrix bg-matrix/10' 
                                 : 'border-white/10 bg-black hover:border-bitcoin'
                               }`}
                  >
                    <code className="font-mono text-xs text-bitcoin break-all block pr-8 font-medium">
                      {CONFIG.onChainAddress}
                    </code>
                    
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {copied ? <Check size={14} className="text-matrix" /> : <Copy size={14} className="text-gray-600 group-hover:text-bitcoin" />}
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
                  <div className="mb-6">
                    <h4 className="font-serif text-xl text-white mb-2">
                      Pago Tradicional
                    </h4>
                    <p className="font-mono text-xs text-gray-500">
                      Tarjetas, SPEI o Efectivo vía Mercado Pago.
                    </p>
                  </div>

                  <a
                    href={CONFIG.mercadoPagoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center gap-3 
                               w-full py-3.5 px-6 rounded-xl overflow-hidden
                               bg-[#009EE3] hover:bg-[#008bc9] text-white
                               font-mono font-bold text-sm transition-all duration-300
                               shadow-md hover:shadow-lg"
                  >
                    <span className="relative z-10 flex items-center gap-2 tracking-wide">
                      IR A MERCADO PAGO
                      <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </a>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-4 opacity-30 grayscale">
                    <span className="text-[10px] font-mono font-bold">VISA</span>
                    <span className="text-[10px] font-mono font-bold">MC</span>
                    <span className="text-[10px] font-mono font-bold">SPEI</span>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </Card>

        <div className="text-center mt-6 font-mono text-[10px] text-gray-600 uppercase tracking-widest">
          Transacción procesada externamente • Sin custodia local
        </div>
      </div>
    </section>
  );
}