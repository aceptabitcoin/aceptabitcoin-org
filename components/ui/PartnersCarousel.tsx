// components/ui/PartnersCarousel.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartnerCard } from "./PartnerCard";
import { PARTNERS } from "@/data/partners";
import { Sparkles } from "lucide-react";

export function PartnersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotación automática cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PARTNERS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-12 bg-black relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(247,147,26,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header del Carrusel */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-3"
          >
            <Sparkles className="w-3 h-3 text-bitcoin" />
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              Aliados Soberanos
            </span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            Exchanges Recomendados
          </h2>
          <p className="text-sm font-mono text-gray-500 mt-2">
            Plataformas verificadas por la comunidad Acepta Bitcoin
          </p>
        </div>

        {/* Área del Carrusel */}
        <div className="min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <PartnerCard 
              key={PARTNERS[currentIndex].id} 
              partner={PARTNERS[currentIndex]} 
            />
          </AnimatePresence>
        </div>

        {/* Indicadores de posición (Dots) */}
        <div className="flex justify-center gap-2 mt-8">
          {PARTNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-bitcoin w-6" : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Ver exchange ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}