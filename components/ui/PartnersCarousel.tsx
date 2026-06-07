'use client';

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartnerCard } from "./PartnerCard";
import { PARTNERS } from "@/data/partners";
import { ShieldCheck } from "lucide-react";

export function PartnersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Guard de movimiento reducido para accesibilidad
  const prefersReducedMotion = useMemo(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, 
  []);

  // Rotación automática respetando preferencias del usuario
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PARTNERS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section className="w-full py-16 bg-black relative overflow-hidden">
      {/* Glow Sutil Centralizado */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(247,147,26,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header del Carrusel */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-bitcoin/30 bg-bitcoin/5 mb-4"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-bitcoin" />
            <span className="text-[10px] font-mono text-bitcoin uppercase tracking-[2px] animate-pulse">
              Infraestructura Bitcoin Only
            </span>
          </motion.div>
          
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-white uppercase tracking-tight drop-shadow-lg">
            Nodos de Intercambio Verificados
          </h2>
          
          <p className="mt-3 font-mono text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Plataformas auditadas por la comunidad que operan <span className="text-bitcoin font-bold">exclusivamente</span> con Bitcoin. 
            Sin stablecoins, sin fiat on-ramp, sin compromisos.
          </p>
        </div>

        {/* Área del Carrusel */}
        <div className="min-h-[320px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={PARTNERS[currentIndex].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full max-w-md"
            >
              <PartnerCard partner={PARTNERS[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicadores de Posición (Dots) */}
        <div className="flex justify-center gap-2 mt-8">
          {PARTNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? "bg-bitcoin w-6 shadow-[0_0_8px_rgba(247,147,26,0.5)]" 
                  : "bg-white/15 w-1.5 hover:bg-white/30"
              }`}
              aria-label={`Ver nodo ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}