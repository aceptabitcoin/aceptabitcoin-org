// ============================================================
// HACKATHON EDITION HERO — Featured hero for edition pages
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { Zap, Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Hero({
  className,
}: {
  className?: string;
}) {
  return (
    <section className={cn(
      "relative overflow-hidden bg-gradient-to-b from-black via-black/95 to-transparent",
      className
    )}>
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-bitcoin/5 blur-[100px] rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-matrix/5 blur-[80px] rounded-full" />
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(247,147,26,0.05)_1px,transparent_1px)] bg-[size:80px_80px]"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 space-y-8">
        
        {/* Marquee / Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-bitcoin/30 bg-bitcoin/10 px-4 py-1.5">
          <Zap className="h-3.5 w-3.5 text-bitcoin animate-pulse" />
          <span className="font-mono text-[10px] text-bitcoin uppercase tracking-[0.2em]">
            Hackathon Bitcoin México 2026
          </span>
        </div>

        {/* ═══════════════════════════════════════════════════════
            MAIN TITLE — Updated per brief
            ═══════════════════════════════════════════════════════ */}
        <h1 className="font-serif text-4xl md:text-6xl font-bold leading-[1.15] tracking-tight max-w-5xl mx-auto text-center">
          <span className="text-white">2do Hackathon</span>{" "}
          <span className="text-matrix">Aceptabitcoin.org</span>
          <br />
          <span className="text-white">Bitcoin</span>{" "}
          <span className="text-bitcoin drop-shadow-[0_0_30px_rgba(247,147,26,0.4)]">
            Self Custody UI Challenge
          </span>
          <br />
          <span className="text-white text-3xl md:text-5xl">ArcadiaB Hackathon</span>
        </h1>

        {/* Subtitle */}
        <p className="font-mono text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed text-center">
          La edición más ambiciosa de nuestro hackathon.
          <span className="text-matrix">
            {" "}
            48 horas de innovación Bitcoin en Mérida, Yucatán.
          </span>
        </p>

        {/* Metadata strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-mono text-gray-500 mt-8">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            13–14 Junio, 2026
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            Centro de Convenciones Yucatán
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            Hasta 300 participantes
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Registro abierto
          </span>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScxpASJWpkpUN_2aSweOLiReRVy4ujXmID04XO7V8rR_DYWiA/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-vt323 font-bold text-lg rounded-xl transition-all duration-300
              bg-bitcoin text-black
              hover:shadow-[0_0_30px_rgba(247,147,26,0.5)]
              hover:shadow-[0_0_60px_rgba(247,147,26,0.2)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Registrarse Ahora
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          <a
            href="/hackathon/[edition]/resources"
            className="group inline-flex items-center justify-center px-8 py-4 font-vt323 font-bold text-lg rounded-xl transition-all duration-300
              border border-matrix/30 text-matrix
              hover:border-matrix hover:bg-matrix/10"
          >
            Explorar Recursos
          </a>
        </div>
      </div>
    </section>
  );
}