import type { Metadata } from "next";
import { type Proyecto } from "@/lib/proyectos";
import ProyectosClient from "./ProyectosClient";
import MatrixRain from "@/components/ui/MatrixRain";

// Static import of JSON data (no runtime fetch)
import proyectosRaw from '@/data/proyectos.json';

const proyectosList = (proyectosRaw as Proyecto[]).sort(
  (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
);

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    metadataBase: new URL(baseUrl),
    title: 'Proyectos Bitcoin — Ecosistema de Desarrollo',
    description: 'Software sovereign construido por y para la comunidad Bitcoin de México. Proyectos internos de Acepta Bitcoin y proyectos de la comunidad con stack técnico, estado y reviews.',
    openGraph: {
      title: 'Proyectos Bitcoin — Ecosistema de Desarrollo',
      description: 'Descubre los proyectos Bitcoin construidos en México. BOB Hotel, Mesa Aceptabitcoin, Corriente Satoshi y más.',
      images: [{ url: '/og/proyectos.svg', width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Proyectos Bitcoin México',
      description: 'Ecosistema de desarrollo sovereign. Código abierto, sin permiso, sin límites.',
      images: ['/og/proyectos.svg'],
    },
  };
}

export default function ProyectosPage() {
  return (
    <>
      {/* Efecto Matrix Rain de fondo (sutil, solo decorativo) */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none">
        <MatrixRain speed={0.3} opacity={0.08} />
      </div>

      {/* Contenedor principal con fondo negro puro */}
      <main className="relative z-10 min-h-screen bg-black">
        
        {/* Hero Section - Estilo Terminal */}
        <section className="relative border-b border-white/10 bg-black/90">
          {/* Scanline effect */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-matrix/50 to-transparent animate-scanline" />
          
          <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
            <div className="text-center">
              {/* Badge de estado del sistema */}
              <div className="inline-flex items-center gap-2 rounded-full border border-matrix/30 bg-matrix/10 px-3 py-1 mb-4">
                <span className="animate-pulse text-matrix">●</span>
                <span className="font-mono text-xs text-matrix uppercase tracking-wider">
                  Oracle System v2.0 — Proyectos
                </span>
              </div>
              
              {/* Título principal - Serif institucional */}
              <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                Proyectos <span className="text-bitcoin">Bitcoin</span>
              </h1>
              
              {/* Subtítulo - Mono técnico */}
              <p className="mt-4 font-mono text-sm text-gray-400 md:text-base max-w-2xl mx-auto">
                Software sovereign construido por y para la comunidad Bitcoin de México. 
                <span className="text-matrix"> Código abierto, sin permiso, sin límites.</span>
              </p>
              
              {/* Stats rápidas - Mono */}
              <div className="mt-6 flex justify-center gap-4 font-mono text-xs">
                <span className="text-gray-500">
                  <span className="text-bitcoin">{proyectosList.filter(p => p.tipo === 'interno').length}</span> internos
                </span>
                <span className="text-gray-700">|</span>
                <span className="text-gray-500">
                  <span className="text-matrix">{proyectosList.filter(p => p.tipo === 'comunidad').length}</span> comunidad
                </span>
                <span className="text-gray-700">|</span>
                <span className="text-gray-500">
                  <span className="text-matrix">{proyectosList.filter(p => p.estado === 'active').length}</span> activos
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido principal - Grid de proyectos */}
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <ProyectosClient proyectos={proyectosList} />
        </div>

        {/* Footer decorativo - Estilo terminal */}
        <footer className="border-t border-white/10 bg-black/90">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-matrix">❯</span>
                <span>proyectos.json loaded • {proyectosList.length} entries</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="animate-pulse text-matrix">●</span>
                <span>Status: <span className="text-matrix">OPERATIONAL</span></span>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
