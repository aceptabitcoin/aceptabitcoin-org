'use client';

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartnerCard } from "./PartnerCard";
import { PARTNERS } from "@/data/partners";
import { ShieldCheck, ChevronLeft, ChevronRight, Terminal, Radio } from "lucide-react";

export function PartnersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Evitar fallas si la base de datos de partners no se ha cargado o está vacía
  const hasPartners = PARTNERS && PARTNERS.length > 0;

  // Guard de hidratación para Next.js
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Guard de movimiento reducido seguro para SSR
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Rotación automática respetando hover y accesibilidad
  useEffect(() => {
    if (!hasPartners || prefersReducedMotion || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PARTNERS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, isHovered, hasPartners]);

  // Handlers para navegación manual
  const handlePrev = () => {
    if (!hasPartners) return;
    setCurrentIndex((prev) => (prev - 1 + PARTNERS.length) % PARTNERS.length);
  };

  const handleNext = () => {
    if (!hasPartners) return;
    setCurrentIndex((prev) => (prev + 1) % PARTNERS.length);
  };

  // Render vacío o esqueleto estructural antes del montaje en cliente para evitar Hydration Mismatch
  if (!isMounted || !hasPartners) {
    return <section className="w-full py-16 bg-black min-h-[550px]" />;
  }

  return (
    <section className="w-full py-16 bg-black relative overflow-hidden">
      {/* Background Grid - Design System Spec */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.15)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40 pointer-events-none" />
      
      {/* Glow Sutil Centralizado */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(247,147,26,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header del Carrusel - Terminal Style */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-bitcoin/40 bg-bitcoin/10 mb-6 shadow-[0_0_15px_rgba(247,147,26,0.2)]"
          >
            <div className="h-6 w-6 rounded-lg bg-bitcoin/20 border border-bitcoin/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-bitcoin" />
            </div>
            <span className="text-[10px] font-vt323 text-bitcoin uppercase tracking-[3px]">
              Infraestructura Bitcoin Only
            </span>
          </motion.div>
          
          <h2 className="font-serif text-4xl sm:text-5xl font-black text-white uppercase tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Nodos de Intercambio <span className="text-bitcoin drop-shadow-[0_0_15px_rgba(247,147,26,0.5)]">Verificados</span>
          </h2>
          
          <p className="mt-4 font-mono text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Plataformas auditadas por la comunidad que operan <span className="text-bitcoin font-bold">exclusivamente</span> con Bitcoin.
          </p>
          
          {/* Status Badge - Terminal Style */}
          <div className="mt-6 inline-flex items-center gap-3 bg-black/60 border border-matrix/30 rounded-lg px-4 py-2 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-matrix rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
              <span className="text-[10px] font-mono text-matrix uppercase tracking-wider">VERIFIED</span>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <span className="text-[10px] font-mono text-gray-500 uppercase">{PARTNERS.length} Active Nodes</span>
          </div>
        </div>

        {/* Área del Carrusel con Controles Manuales Flanqueando */}
        <div 
          className="relative flex items-center justify-center gap-4 max-w-2xl mx-auto min-h-[320px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Botón Izquierdo Manual - Terminal Style */}
          <button
            onClick={handlePrev}
            className="absolute left-[-20px] sm:left-[-60px] z-20 h-12 w-12 rounded-xl border-2 border-matrix/40 bg-black/80 text-matrix flex items-center justify-center backdrop-blur-md transition-all hover:bg-matrix/10 hover:border-matrix hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] group"
            aria-label="Proveedor anterior"
          >
            <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
          </button>

          {/* Contenedor Animado de Tarjeta */}
          <div className="w-full max-w-md overflow-hidden p-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={PARTNERS[currentIndex].id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
              >
                <PartnerCard partner={PARTNERS[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Botón Derecho Manual - Terminal Style */}
          <button
            onClick={handleNext}
            className="absolute right-[-20px] sm:right-[-60px] z-20 h-12 w-12 rounded-xl border-2 border-matrix/40 bg-black/80 text-matrix flex items-center justify-center backdrop-blur-md transition-all hover:bg-matrix/10 hover:border-matrix hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] group"
            aria-label="Siguiente proveedor"
          >
            <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Indicadores de Posición (Dots) - Terminal Style */}
        <div className="flex justify-center items-center gap-3 mt-10">
          {PARTNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? "bg-bitcoin w-8 shadow-[0_0_12px_rgba(247,147,26,0.6)]" 
                  : "bg-white/20 w-2 hover:bg-white/40 border border-white/10"
              }`}
              aria-label={`Ver nodo ${idx + 1}`}
            >
              {idx === currentIndex && (
                <div className="absolute inset-0 bg-bitcoin rounded-full animate-pulse opacity-50" />
              )}
            </button>
          ))}
        </div>

        {/* Footer Status - Terminal Style */}
        <div className="mt-10 flex items-center justify-center gap-4 text-[10px] font-mono text-gray-500 uppercase">
          <div className="flex items-center gap-2">
            <Terminal className="h-3 w-3 text-matrix/60" />
            <span>Auto-rotate: 6s</span>
          </div>
          <div className="h-3 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <Radio className="h-3 w-3 text-matrix/60" />
            <span>Hover to pause</span>
          </div>
        </div>
      </div>
    </section>
  );
}