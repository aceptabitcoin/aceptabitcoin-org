"use client";

import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

import { HackathonEdition } from "@/lib/hackathon/editions/types";

export default function Hero({ nextEdition }: { nextEdition: HackathonEdition | null }) {
  const hackathonTitle = nextEdition?.title.split("Challenge")[0].trim() || "Bitcoin Self-Custody UI";
  const hackathonId = nextEdition?.id === "2026-2" ? "#2 — 2026" : (nextEdition?.id || "#2 — 2026");
  const hackathonSlug = nextEdition?.slug || "custody-ui-2026";

  return (
    <section className="min-h-screen pt-20 flex items-center relative overflow-hidden bg-black">
      {/* 
        FONDO MATRIX 
        Cambio de Cyan (222) a Verde Matrix (120)
      */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.15)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20 pointer-events-none" />
      
      {/* Ruido de fondo sutil - ahora con tinte verdoso si se desea mantener la textura, 
          o dejar transparente para pureza negra. Aquí ajusté el color del ruido a verde muy tenue. */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiAvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDAsMjU1LDY1LCAwLjEpIiAvPgo8L3N2Zz4=')] opacity-30 pointer-events-none" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
        
        {/* Header Terminal estilo Matrix */}
        <div className="inline-flex items-center gap-2 border border-matrix/30 bg-matrix/10 px-4 py-2 rounded text-xs font-mono text-matrix mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,65,0.2)]">
          <Terminal className="w-3 h-3" />
          <span className="opacity-80">root@aceptabitcoin:~# ./init_sequence.sh</span>
        </div>

        {/* Título Principal CON CURSOR VERDE PARPADEANTE */}
        <h1 className="font-serif text-5xl md:text-8xl font-bold tracking-tight mb-6 text-white leading-[1.1]">
          Impulsando la Educación <br />
          <span className="text-bitcoin drop-shadow-[0_0_25px_rgba(247,147,26,0.6)]">
            de Bitcoin en México
          </span>
          {/* --- CURSOR MATRIX --- */}
          <span className="inline-block w-2 md:w-4 h-12 md:h-20 bg-matrix align-middle ml-2 animate-blink shadow-[0_0_10px_rgba(0,255,65,1)]"></span>
        </h1>

        {/* Subtítulo */}
        <p className="font-mono text-lg md:text-2xl text-gray-300 mb-12 tracking-wide max-w-3xl mx-auto border-l-2 border-matrix/50 pl-4 text-left md:text-center md:border-l-0 md:pl-0">
          <span className="text-matrix">➜</span> Aprende. Ahorra. Acepta Bitcoin.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          
          {/* Botón 1: Hackathon — Dinámico (PRIMARIO - Verde Matrix) */}
          <Link 
            href={`/hackathon/${hackathonSlug}`} 
            className="relative group w-full sm:w-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-cyan-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200 animate-pulse"></div>
            <div className="relative flex items-center justify-center gap-3 px-8 py-4 bg-black border border-matrix rounded-lg hover:bg-matrix/10 transition-all">
              <Terminal className="text-matrix h-5 w-5 animate-blink" />
              <div className="flex flex-col items-start">
                <span className="font-vt323 text-xl text-matrix tracking-widest leading-none">
                  HACKATÓN {hackathonId}
                </span>
                <span className="font-mono text-xs text-cyan-400 tracking-wide">
                  {hackathonTitle}
                </span>
              </div>
              <ArrowRight className="text-matrix h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          
          {/* Botón 2: Eventos (SECUNDARIO - Bitcoin Orange) */}
          <Link 
            href="https://luma.com/lunesdebitcoinMID"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-bitcoin/40 text-bitcoin font-serif font-bold rounded hover:border-bitcoin hover:bg-bitcoin/10 hover:shadow-[0_0_20px_rgba(247,147,26,0.3)] transition-all flex items-center justify-center gap-2 group"
          >
            <ArrowRight className="w-4 h-4 text-bitcoin/60 group-hover:text-bitcoin transition-colors" />
            EVENTOS
          </Link>
          
        </div>

        {/* Footer del Hero (Datos técnicos) */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-left max-w-4xl mx-auto">
          <div>
            <div className="text-[10px] text-gray-500 font-mono mb-1 uppercase tracking-widest">System Status</div>
            <div className="flex items-center gap-2">
              {/* Status Green ahora es más brillante estilo terminal */}
              <div className="h-2 w-2 rounded-full bg-matrix animate-pulse shadow-[0_0_8px_rgba(0,255,65,0.8)]"></div>
              <div className="font-mono text-sm text-matrix">ONLINE</div>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-mono mb-1 uppercase tracking-widest">Node Location</div>
            <div className="font-mono text-sm text-gray-300">MÉRIDA, MX</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-mono mb-1 uppercase tracking-widest">Encryption</div>
            {/* Encryption ahora brilla en verde Matrix */}
            <div className="font-mono text-matrix drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]">AES-256</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-mono mb-1 uppercase tracking-widest">Protocol</div>
            <div className="font-mono text-sm text-bitcoin drop-shadow-[0_0_5px_rgba(247,147,26,0.8)]">LIGHTNING</div>
          </div>
        </div>

      </div>
    </section>
  );
}