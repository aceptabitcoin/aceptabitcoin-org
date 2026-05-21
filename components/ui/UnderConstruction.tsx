"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Construction, ArrowLeft, Terminal, Clock } from "lucide-react";
import MatrixRain from "@/components/ui/MatrixRain";
import Link from "next/link";

interface UnderConstructionProps {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  eta?: string; // Ej: "Q3 2026", "v2.1"
  statusColor?: "matrix" | "bitcoin";
}

export default function UnderConstruction({
  title = "MÓDULO EN CONSTRUCCIÓN",
  description = "Estamos desplegando la infraestructura soberana para esta sección. Vuelve pronto.",
  backHref = "/",
  backLabel = "VOLVER AL ORACLE",
  eta,
  statusColor = "matrix",
}: UnderConstructionProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  // 🛡️ Guard de hidratación (MANTENIMIENTO.md)
  if (!isMounted) return null;

  const accent = statusColor === "bitcoin" ? "text-bitcoin" : "text-matrix";
  const accentBorder = statusColor === "bitcoin" ? "border-bitcoin/30" : "border-matrix/30";
  const accentBg = statusColor === "bitcoin" ? "bg-bitcoin/10" : "bg-matrix/10";
  const accentGlow = statusColor === "bitcoin" 
    ? "shadow-[0_0_15px_rgba(247,147,26,0.3)]" 
    : "shadow-[0_0_15px_rgba(0,255,65,0.2)]";

  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-4">
      {/* 🌧️ Background Rain */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <MatrixRain opacity={0.05} speed={0.8} />
      </div>

      {/* 📺 Scanline Overlay (sutil) */}
      <div 
        className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(transparent_98%,rgba(0,255,65,0.04)_100%)] animate-scanline" 
        suppressHydrationWarning 
      />

      {/* 📦 Main Card (Glassmorphism Bunker) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center space-y-6"
      >
        {/* 🟢 Status Indicator */}
        <div className="flex justify-center">
          <div className="relative">
            <div className={`absolute inset-0 ${accentBg} blur-xl rounded-full animate-pulse`} />
            <div className={`relative w-16 h-16 rounded-xl bg-black border ${accentBorder} flex items-center justify-center ${accentGlow}`}>
              <Construction className={`w-8 h-8 ${accent}`} />
            </div>
          </div>
        </div>

        {/* 📝 Text Content */}
        <div className="space-y-3">
          <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {title}
          </h1>
          <p className="font-mono text-sm text-gray-300 leading-relaxed max-w-sm mx-auto">
            {description}
          </p>

          {eta && (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border ${accentBorder} ${accentBg}`}>
              <Clock className="w-3.5 h-3.5" />
              <span className={`font-vt323 text-lg ${accent} tracking-wide`}>
                ETA: {eta}
              </span>
            </div>
          )}
        </div>

        {/* 🔙 CTA */}
        <Link
          href={backHref}
          className={`group inline-flex items-center gap-2 font-mono text-sm ${accent} border ${accentBorder} hover:border-matrix/60 hover:bg-matrix/10 px-6 py-3 rounded-lg transition-all duration-200`}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {backLabel}
        </Link>

        {/* 🔒 Footer / System Tag */}
        <p className="font-mono text-[10px] text-gray-600 uppercase tracking-wider pt-4 border-t border-white/10">
          Sistema operativo v2.0 • Infraestructura soberana
        </p>
      </motion.div>
    </main>
  );
}
