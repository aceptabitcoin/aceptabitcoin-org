"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Clock, Hash, Link as LinkIcon, Calendar, Zap, Users } from "lucide-react";

// ============================================================
// BITCOIN TIMECHAIN — Nuestra Historia
// Cada evento es un bloque minado en la cadena de Acepta Bitcoin
// ============================================================

interface TimechainBlock {
  height: number;
  timestamp: string;
  quarter: string;
  title: string;
  desc: string;
  hash: string;
  prevHash: string;
  icon: string;
  category: "genesis" | "infrastructure" | "adoption" | "community";
}

const timechainBlocks: TimechainBlock[] = [
  {
    height: 1,
    timestamp: "2021-10-15T18:00:00Z",
    quarter: "Q4 2021",
    title: "GENESIS BLOCK",
    desc: "Primera reunión cypherpunk en Mérida. Nace la semilla de la soberanía financiera en Yucatán.",
    hash: "0000a7f3b2c1d8e9f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7",
    prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
    icon: "🌱",
    category: "genesis"
  },
  {
    height: 2,
    timestamp: "2022-01-20T12:00:00Z",
    quarter: "Q1 2022",
    title: "NODO LIGHTNING",
    desc: "Primer nodo LN público en Yucatán. Canal establecido con CDMX. La red comienza a fluir.",
    hash: "0000b8e4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6",
    prevHash: "0000a7f3b2c1d8e9f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7",
    icon: "⚡",
    category: "infrastructure"
  },
  {
    height: 3,
    timestamp: "2022-07-10T15:30:00Z",
    quarter: "Q3 2022",
    title: "PRIMER COMERCIO",
    desc: "Pizzería local acepta BTC via BTCPay Server. Primera transacción real en la península.",
    hash: "0000c9f5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7",
    prevHash: "0000b8e4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6",
    icon: "🏪",
    category: "adoption"
  },
  {
    height: 4,
    timestamp: "2023-02-28T09:00:00Z",
    quarter: "Q1 2023",
    title: "TIANGUIS BITCOIN",
    desc: "Marketplace P2P descentralizado. Nostr + Lightning Network. Sin intermediarios, sin KYC.",
    hash: "0000d0a6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8",
    prevHash: "0000c9f5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7",
    icon: "🛒",
    category: "infrastructure"
  },
  {
    height: 5,
    timestamp: "2023-11-15T10:00:00Z",
    quarter: "Q4 2023",
    title: "HACKATHON BTC MÉXICO",
    desc: "48 horas de código. 5 equipos. Nace B.O.B. Hotel. Partnership con Blockchain University.",
    hash: "0000e1b7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9",
    prevHash: "0000d0a6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8",
    icon: "🏆",
    category: "community"
  },
  {
    height: 6,
    timestamp: "2024-04-20T14:00:00Z",
    quarter: "Q2 2024",
    title: "BLINK API INTEGRATION",
    desc: "Migración a Blink. Stablesats USD. TipJar con QR dinámico. Lightning Address activo.",
    hash: "0000f2c8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0",
    prevHash: "0000e1b7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9",
    icon: "💸",
    category: "infrastructure"
  },
  {
    height: 7,
    timestamp: "2024-09-10T11:00:00Z",
    quarter: "Q3 2024",
    title: "ORACLE SYSTEM v2.0",
    desc: "Rebranding Matrix. Design System completo. Market Mood Widget. Price Converter live.",
    hash: "0000a3d9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1",
    prevHash: "0000f2c8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0",
    icon: "🎨",
    category: "infrastructure"
  },
  {
    height: 8,
    timestamp: "2024-12-05T16:00:00Z",
    quarter: "Q4 2024",
    title: "DIRECTORIOS ACTIVOS",
    desc: "8 proveedores confirmados. 4 proyectos showcase. Cal.com integrado. Onboarding automatizado.",
    hash: "0000b4eac9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2",
    prevHash: "0000a3d9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1",
    icon: "📋",
    category: "adoption"
  },
  {
    height: 9,
    timestamp: "2025-03-01T08:00:00Z",
    quarter: "Q1 2025",
    title: "BTC MAP INTEGRATION",
    desc: "Mapa interactivo de merchants. Leaflet + CARTO dark tiles. Marcadores personalizados.",
    hash: "0000c5fbdae9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3",
    prevHash: "0000b4eac9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2",
    icon: "🗺️",
    category: "adoption"
  },
  {
    height: 10,
    timestamp: "2025-05-03T00:00:00Z",
    quarter: "Q2 2025",
    title: "ESTADO ACTUAL",
    desc: "+150 usuarios Tianguis. 8 proveedores activos. 4 proyectos dev. Open-source AGPL-3.0.",
    hash: "0000d60cebf0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4",
    prevHash: "0000c5fbdae9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3",
    icon: "🚀",
    category: "community"
  }
];

export default function NuestraHistoriaPage() {
  const [timeUntilNext, setTimeUntilNext] = useState("10:00");

  // 🔹 Timer de 10 minutos (simulando block time de Bitcoin)
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const nextBlockMinutes = Math.ceil((minutes + 1) / 10) * 10;
      
      const next = new Date(now);
      if (nextBlockMinutes >= 60) {
        next.setHours(now.getHours() + 1);
        next.setMinutes(0);
      } else {
        next.setMinutes(nextBlockMinutes);
      }
      next.setSeconds(0);

      const diff = next.getTime() - now.getTime();
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeUntilNext(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Estilos estrictos: SOLO matrix/bitcoin/gris (design-system.md compliant)
  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case "genesis": return "border-matrix text-matrix bg-matrix/10";
      case "infrastructure": return "border-bitcoin text-bitcoin bg-bitcoin/10";
      case "adoption": return "border-matrix/70 text-gray-300 bg-matrix/5";
      case "community": return "border-bitcoin/70 text-gray-300 bg-bitcoin/5";
      default: return "border-white/20 text-gray-400";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Grid - Ajustado para ser sutil y no distraer */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.08)_1px,transparent_1px)] bg-[length:50px_50px] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black pointer-events-none" />

        <div className="container mx-auto px-4 py-16 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-3 bg-black/80 border border-matrix/30 px-6 py-2.5 rounded-full font-mono text-xs text-matrix tracking-[0.1em]">
              <Hash className="h-4 w-4" /> BITCOIN TIMECHAIN
            </div>
            
            <h1 className="font-serif text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              Nuestra Historia<br />
              <span className="text-matrix drop-shadow-[0_0_25px_rgba(0,255,65,0.5)]">está escrita en bloques</span>
            </h1>
            
            <p className="font-mono text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Cada evento es un bloque. Cada bloque es prueba de trabajo.<br />
              <span className="text-bitcoin">Inmutable. Descentralizado. Soberano.</span>
            </p>
          </div>

          {/* Mining Status */}
          <div className="max-w-2xl mx-auto mb-24">
            <div className="bg-black/80 border border-matrix/30 backdrop-blur-xl rounded-3xl p-10 text-center space-y-4">
              <div className="uppercase tracking-[0.2em] text-xs text-matrix mb-2 flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 animate-pulse" /> Próximo Bloque
              </div>
              <div 
                className="font-vt323 text-8xl md:text-9xl text-matrix tracking-widest drop-shadow-[0_0_30px_#00FF41] tabular-nums"
                aria-live="polite"
                aria-label="Tiempo restante para el próximo bloque"
              >
                {timeUntilNext || "10:00"}
              </div>
              <div className="mt-4 text-xs font-mono text-gray-500">
                Block Height: <span className="text-matrix">#{timechainBlocks.length}</span> • Dificultad: <span className="text-matrix">0000...</span>
              </div>
            </div>
          </div>

          {/* Timechain Blocks */}
          <div className="max-w-4xl mx-auto space-y-12">
            {timechainBlocks.map((block, idx) => (
              <div key={block.height} className="relative">
                {/* Línea conectora vertical - oculta en mobile */}
                {idx < timechainBlocks.length - 1 && (
                  <div className="absolute left-8 md:left-12 top-24 bottom-0 w-px bg-gradient-to-b from-matrix/50 to-transparent hidden md:block" />
                )}

                <div className={`group relative border-2 ${getCategoryStyle(block.category)} bg-black/90 backdrop-blur-md rounded-2xl overflow-hidden hover:border-matrix transition-all duration-500`}>
                  {/* Block Header */}
                  <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-black/50">
                    <div className="flex items-center gap-4">
                      <div className="font-vt323 text-4xl text-white">#{block.height.toString().padStart(3, '0')}</div>
                      <div className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border ${getCategoryStyle(block.category)}`}>
                        {block.category.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-matrix text-2xl" aria-hidden="true">{block.icon}</div>
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6">
                    <div>
                      <div className="text-xs font-mono text-gray-500">{block.quarter}</div>
                      <h3 className="font-serif text-3xl font-bold mt-1 text-white group-hover:text-matrix transition-colors">
                        {block.title}
                      </h3>
                    </div>

                    <p className="font-mono text-gray-300 leading-relaxed">
                      {block.desc}
                    </p>

                    <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="flex items-center gap-2 text-gray-500">
                        <LinkIcon className="h-3.5 w-3.5 flex-shrink-0" />
                        Prev: <span className="text-gray-600 truncate">{block.prevHash.slice(0, 12)}...</span>
                      </div>
                      <div className="flex items-center gap-2 text-matrix">
                        <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                        Hash: <span className="truncate">{block.hash.slice(0, 12)}...</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-gray-600 flex items-center gap-2 pt-2">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      {new Date(block.timestamp).toLocaleDateString("es-MX", { 
                        timeZone: "America/Mexico_City",
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-current opacity-30" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-current opacity-30" />
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="mt-28 text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-bitcoin/10 border border-bitcoin/30 px-6 py-3 rounded-full font-mono text-xs text-bitcoin tracking-[0.1em]">
              <Users className="h-4 w-4" /> MINA EL SIGUIENTE BLOQUE
            </div>
            <a
              href="/tianguis"
              className="inline-flex items-center gap-4 px-10 py-5 bg-bitcoin text-black font-vt323 text-2xl md:text-3xl rounded-2xl transition-all duration-200 hover:bg-bitcoin/90 hover:scale-105 shadow-[0_0_40px_rgba(247,147,26,0.6)] hover:shadow-[0_0_50px_rgba(247,147,26,0.8)]"
            >
              MINAR AHORA <Zap className="h-7 w-7" />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}