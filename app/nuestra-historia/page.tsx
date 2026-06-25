'use client';

import { useState, useEffect, useMemo, memo, useRef } from "react";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Clock, Hash, Link as LinkIcon, Calendar, Zap, Users,
  Sprout, Store, ShoppingCart, Trophy, Coins, Palette, 
  ClipboardList, MapPin, Rocket, ShieldCheck 
} from "lucide-react";

// Registrar plugin de ScrollTrigger solo en cliente
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================
// BITCOIN TIMECHAIN — Nuestra Historia
// Cada evento es un bloque minado en la cadena de Acepta Bitcoin
// Design System: Bitcoin Matrix v2.0
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

// 🔹 Componente memoizado para íconos de categoría (Lucide React)
const CategoryIcon = ({ category }: { category: string }) => {
  const icons = useMemo(() => ({
    genesis: <Sprout className="h-6 w-6 text-matrix" />,
    infrastructure: <Zap className="h-6 w-6 text-bitcoin" />,
    adoption: <Store className="h-6 w-6 text-matrix/80" />,
    community: <Users className="h-6 w-6 text-bitcoin/80" />
  }), []);
  
  return icons[category as keyof typeof icons] || <Hash className="h-6 w-6 text-gray-400" />;
};

// 🔹 Bloque memoizado con ref para animaciones
const TimechainBlock = memo(({ block, isMounted, index, totalBlocks }: { 
  block: TimechainBlock; 
  isMounted: boolean;
  index: number;
  totalBlocks: number;
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  const categoryStyle = useMemo(() => {
    switch (block.category) {
      case "genesis": return "border-matrix text-matrix bg-matrix/10 shadow-[0_0_15px_rgba(0,255,65,0.2)]";
      case "infrastructure": return "border-bitcoin text-bitcoin bg-bitcoin/10 shadow-[0_0_20px_rgba(247,147,26,0.4)]";
      case "adoption": return "border-matrix/70 text-gray-300 bg-matrix/5";
      case "community": return "border-bitcoin/70 text-gray-300 bg-bitcoin/5";
      default: return "border-white/20 text-gray-400";
    }
  }, [block.category]);

  // Calcular confirmaciones
  const confirmations = totalBlocks - block.height;

  // Animación 3D con seguimiento de mouse
  useGSAP(() => {
    const element = blockRef.current;
    if (!element) return;

    // Efecto de flotación continua
    gsap.to(element, {
      y: -10,
      duration: 2 + (index * 0.2),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: index * 0.15,
    });

    // Efecto de perspectiva con mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      gsap.to(element, {
        rotationY: x * 6,
        rotationX: -y * 6,
        duration: 0.8,
        ease: "power2.out",
        transformPerspective: 800,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        rotationY: 0,
        rotationX: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        transformPerspective: 800,
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Efecto Glitch en título al hover
  const handleTitleHover = () => {
    if (!titleRef.current) return;
    
    gsap.to(titleRef.current, {
      x: '+=3',
      duration: 0.05,
      yoyo: true,
      repeat: 5,
      ease: 'power1.inOut',
      onComplete: () => {
        gsap.set(titleRef.current, { x: 0 });
      }
    });
  };

  return (
    <div 
      ref={blockRef}
      className={`timechain-block group relative border-2 ${categoryStyle} bg-black/90 backdrop-blur-md rounded-2xl overflow-hidden hover:border-matrix/50 transition-all duration-500 will-change-transform`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Block Header */}
      <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-black/50">
        <div className="flex items-center gap-4">
          <div className="font-vt323 text-4xl text-white">#{block.height.toString().padStart(3, '0')}</div>
          <div className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border ${categoryStyle}`}>
            {block.category.toUpperCase()}
          </div>
        </div>
        <div className="text-2xl" aria-hidden="true">
          <CategoryIcon category={block.category} />
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        <div>
          <div className="text-xs font-mono text-gray-500 uppercase">{block.quarter}</div>
          <h3 
            ref={titleRef}
            onMouseEnter={handleTitleHover}
            className="font-serif text-3xl font-bold mt-1 text-white group-hover:text-matrix transition-colors cursor-pointer"
          >
            {block.title}
          </h3>
        </div>

        <p className="font-mono text-gray-300 leading-relaxed">
          {block.desc}
        </p>

        <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-gray-500">
            <LinkIcon className="h-3.5 w-3.5 flex-shrink-0" />
            Prev: <span className="text-gray-600 truncate cursor-help" title={block.prevHash}>{block.prevHash.slice(0, 12)}...</span>
          </div>
          <div className="flex items-center gap-2 text-matrix">
            <Hash className="h-3.5 w-3.5 flex-shrink-0" />
            Hash: <span className="truncate cursor-help" title={block.hash}>{block.hash.slice(0, 12)}...</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-gray-600 uppercase pt-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            {isMounted ? (
              new Date(block.timestamp).toLocaleDateString("es-MX", { 
                timeZone: "America/Mexico_City",
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            ) : (
              "Cargando bloque..."
            )}
          </div>
          <div className="flex items-center gap-2 text-matrix/60">
            <ShieldCheck className="h-3 w-3 flex-shrink-0" />
            {confirmations} {confirmations === 1 ? 'confirmación' : 'confirmaciones'}
          </div>
        </div>
      </div>

      {/* Corner Accents - Design System Spec */}
      <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-current opacity-30" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-current opacity-30" />
    </div>
  );
});

TimechainBlock.displayName = "TimechainBlock";

export default function NuestraHistoriaPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState("10:00");
  const [isMining, setIsMining] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const miningRef = useRef<HTMLDivElement>(null);

  // Guard de montaje para hidratación
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🔹 Timer de 10 minutos (simulando block time de Bitcoin)
  useEffect(() => {
    if (!isMounted) return;

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
      const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      
      setTimeUntilNext(timeStr);
      
      // Detectar cuando llega a 00:00
      if (timeStr === "00:00" && !isMining) {
        setIsMining(true);
        // Efecto de "bloque minado"
        if (miningRef.current) {
          gsap.to(miningRef.current, {
            scale: 1.05,
            boxShadow: '0 0 60px rgba(0,255,65,0.8)',
            duration: 0.3,
            yoyo: true,
            repeat: 2,
            ease: 'power2.inOut',
            onComplete: () => {
              setIsMining(false);
            }
          });
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isMounted, isMining]);

  // 🔹 Animaciones principales con GSAP
  useGSAP(() => {
    if (!containerRef.current) return;

    // 1. Animación de entrada del header
    gsap.from(headerRef.current, {
      opacity: 0,
      y: -50,
      duration: 1.2,
      ease: "power3.out",
    });

    // 2. Animación del mining status (efecto holograma)
    gsap.from(miningRef.current, {
      opacity: 0,
      scale: 0.8,
      rotationX: 15,
      duration: 1,
      delay: 0.3,
      ease: "back.out(1.7)",
      transformPerspective: 600,
    });

    // 3. Animación de entrada de bloques con scroll
    const blocks = document.querySelectorAll('.timechain-block');
    
    blocks.forEach((block, index) => {
      gsap.from(block, {
        opacity: 0,
        y: 100,
        rotationX: 15,
        scale: 0.9,
        duration: 1,
        delay: 0.1 * index,
        ease: "power3.out",
        scrollTrigger: {
          trigger: block,
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
          markers: false,
        },
        transformPerspective: 800,
      });
    });

    // 4. Animación de líneas conectoras
    const connectorLines = document.querySelectorAll('.connector-line');
    connectorLines.forEach((line) => {
      gsap.from(line, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: line,
          start: 'top center',
          toggleActions: 'play none none reverse',
        }
      });
    });

    // 5. Animación del background grid (movimiento infinito)
    gsap.to(".bg-grid", {
      y: "20%",
      duration: 30,
      repeat: -1,
      ease: "linear",
      modifiers: {
        y: (y: string) => {
          const value = parseFloat(y);
          return (value % 50) + "px";
        }
      }
    });

    // 6. Efecto de partículas en el fondo (opcional)
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      gsap.to(particle, {
        x: (index % 2 === 0 ? 50 : -50),
        y: (index % 3 === 0 ? 30 : -30),
        duration: 3 + (index * 0.5),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.2,
      });
    });

    // 7. Animación del CTA final
    gsap.from(".cta-button", {
      opacity: 0,
      scale: 0.5,
      rotationY: 180,
      duration: 1.2,
      delay: 1.5,
      ease: "back.out(1.7)",
      transformPerspective: 800,
      scrollTrigger: {
        trigger: ".cta-button",
        start: "top bottom-=50",
        toggleActions: "play none none reverse",
      }
    });

    // Cleanup de ScrollTrigger
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-[#FAFAFA] relative overflow-hidden">
        {/* Background Grid - con animación */}
        <div 
          className="bg-grid absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.15)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40 pointer-events-none" 
        />
        
        {/* Partículas flotantes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-1 h-1 bg-matrix/20 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black pointer-events-none" />

        <div ref={containerRef} className="container mx-auto px-4 py-16 relative z-10">
          
          {/* Header con ref para animación */}
          <div ref={headerRef} className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-3 bg-black/80 border border-matrix/30 px-6 py-2.5 rounded-full font-mono text-xs text-matrix tracking-[0.1em] uppercase">
              <Hash className="h-4 w-4" /> Bitcoin Timechain
            </div>
            
            <h1 className="font-serif text-6xl md:text-7xl font-bold tracking-tight text-[#FAFAFA] leading-tight drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
              Nuestra Historia<br />
              <span className="text-matrix drop-shadow-[0_0_25px_rgba(0,255,65,0.5)]">está escrita en bloques</span>
            </h1>
            
            <p className="font-mono text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Cada evento es un bloque. Cada bloque es prueba de trabajo.<br />
              <span className="text-bitcoin">Inmutable. Descentralizado. Soberano.</span>
            </p>
          </div>

          {/* Mining Status con ref para animación */}
          <div ref={miningRef} className="max-w-2xl mx-auto mb-24">
            <div className="bg-black/80 border border-matrix/30 backdrop-blur-md rounded-3xl p-10 text-center space-y-4">
              <div className="uppercase tracking-[0.2em] text-xs text-matrix mb-2 flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 animate-pulse" /> Próximo Bloque
              </div>
              <div 
                className="font-vt323 text-8xl md:text-9xl text-matrix tracking-widest tabular-nums"
                aria-live="polite"
                aria-atomic="true"
                aria-label={`Tiempo restante para el próximo bloque: ${timeUntilNext} minutos`}
              >
                {isMounted ? timeUntilNext : "10:00"}
              </div>
              <div className="mt-4 text-xs font-mono text-gray-500 uppercase">
                Block Height: <span className="text-matrix">#{timechainBlocks.length}</span> • Dificultad: <span className="text-matrix">0000...</span>
              </div>
            </div>
          </div>

          {/* Timechain Blocks */}
          <div className="max-w-4xl mx-auto space-y-12">
            {timechainBlocks.map((block, idx) => (
              <div key={block.height} className="relative">
                {/* Línea conectora vertical animada - oculta en mobile */}
                {idx < timechainBlocks.length - 1 && (
                  <div className="connector-line absolute left-8 md:left-12 top-24 bottom-0 w-px bg-gradient-to-b from-matrix/50 to-transparent hidden md:block" />
                )}

                <TimechainBlock 
                  block={block} 
                  isMounted={isMounted} 
                  index={idx}
                  totalBlocks={timechainBlocks.length}
                />
              </div>
            ))}
          </div>

          {/* Final CTA con clase para animación */}
          <div className="cta-button mt-28 text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-bitcoin/10 border border-bitcoin/30 px-6 py-3 rounded-full font-mono text-xs text-bitcoin tracking-[0.1em] uppercase">
              <Users className="h-4 w-4" /> Mina el siguiente bloque
            </div>
            <a
              href="/tianguis"
              className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-bitcoin text-black font-vt323 text-2xl md:text-3xl rounded-2xl transition-all duration-200 hover:bg-bitcoin/90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-matrix focus:ring-offset-2 focus:ring-offset-black shadow-[0_0_20px_rgba(247,147,26,0.4)] hover:shadow-[0_0_25px_rgba(247,147,26,0.6)]"
            >
              Minar Ahora <Zap className="h-7 w-7" />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}