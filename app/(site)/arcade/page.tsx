import { GameCard } from '@/components/cards/GameCard';
import ArcadeButton from '@/components/ui/ArcadeButton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MatrixRain from '@/components/ui/MatrixRain';

// Tipos TypeScript para juegos.json
type Juego = {
  id: string;
  nombre: string;
  tipo: 'arcade' | 'plataforma' | 'comunidad';
  descripcion: string;
  descripcionCorta: string;
  url: string | null;
  repoUrl: string | null;
  logo: string;
  imagen: string;
  categoria: string;
  dificultad: 'facil' | 'intermedio' | 'avanzado' | 'variable' | 'progresivo';
  duracion: string;
  premio?: string;
  stack?: string[];
  hackathon?: {
    evento: string;
    lugar: 'winner' | 'second' | 'third' | 'participant';
    año: number;
  } | null;
  equipo?: Array<{
    nombre: string;
    rol: string;
    ubicacion: string;
  }>;
  features?: string[];
  metricas?: Array<{ label: string; valor: string }>;
  review?: {
    fortalezas: string[];
    oportunidades: string[];
    impacto: string;
  };
  notas?: {
    nivel: string;
    estetica: string;
    publico_objetivo?: string;
    diferenciador?: string;
    herramienta?: string;
    valor?: string;
    portabilidad?: string;
    estado_contenido?: string;
  };
  estado: 'active' | 'development' | 'abandoned';
  destacado: boolean;
  orden?: number;
  fecha: string;
};

// Cargar datos desde JSON estático (server-side)
async function getJuegos(): Promise<Juego[]> {
  // En producción: leer desde filesystem
  // En desarrollo: fallback a import directo
  try {
    const juegos = await import('@/data/juegos.json');
    return juegos.default as Juego[];
  } catch {
    // Fallback para build time
    return [];
  }
}

// Badge de estética dinámica según notas.estetica
function getEsteticaBadge(estetica?: string) {
  if (!estetica) return null;
  
  const config: Record<string, { label: string; className: string }> = {
    'Matrix Native': { label: '🟢 Matrix', className: 'text-matrix border-matrix/30 bg-matrix/10' },
    'Pixel art': { label: '👾 Pixel', className: 'text-bitcoin border-bitcoin/30 bg-bitcoin/10' },
    'Cine de Oro': { label: '🎬 Cine', className: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
    'Arte popular': { label: '🎴 Folk', className: 'text-rose-400 border-rose-400/30 bg-rose-400/10' },
    'Estilo cómic': { label: '🎨 Cómic', className: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10' },
    'Gaming moderno': { label: '🎮 Gaming', className: 'text-purple-400 border-purple-400/30 bg-purple-400/10' },
  };
  
  const match = Object.entries(config).find(([key]) => estetica.includes(key));
  if (!match) return null;
  
  const [_, { label, className }] = match;
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${className}`}>
      {label}
    </span>
  );
}

export default async function ArcadePage() {
  const juegos = await getJuegos();
  
  // Separar por tipo y ordenar
  const plataformaDestacada = juegos
    .filter(j => j.tipo === 'plataforma' && j.destacado)
    .sort((a, b) => (a.orden || 99) - (b.orden || 99))[0];
  
  const juegosArcade = juegos
    .filter(j => (j.tipo === 'arcade' || j.tipo === 'comunidad') && j.id !== plataformaDestacada?.id)
    .sort((a, b) => (a.orden || 99) - (b.orden || 99));
  
  const activos = juegosArcade.filter(j => j.estado === 'active').length;

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-black overflow-hidden">
        
        {/* Efecto Matrix Rain de fondo (sutil) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <MatrixRain speed={0.5} opacity={0.08} />
        </div>

        {/* Hero Section - Sala Arcade */}
        <section className="relative border-b border-white/10 bg-black/90">
          <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-matrix/30 bg-matrix/10 px-3 py-1 mb-4">
                <span className="animate-pulse text-matrix">●</span>
                <span className="font-mono text-xs text-matrix uppercase tracking-wider">
                  Sistema Operativo: ARCADE v2.0
                </span>
              </div>
              
              <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                🎮 Bitcoin <span className="text-bitcoin">Arcade</span>
              </h1>
              
              <p className="mt-4 font-mono text-sm text-gray-400 md:text-base max-w-2xl mx-auto">
                Aprende soberanía financiera jugando — sin tecnicismos, solo diversión. 
                <span className="text-matrix"> Insert coin to start.</span>
              </p>
              
              {/* Stats rápidas */}
              <div className="mt-6 flex justify-center gap-4 font-mono text-xs">
                <span className="text-gray-500">
                  <span className="text-bitcoin">{activos}</span> juegos activos
                </span>
                <span className="text-gray-700">|</span>
                <span className="text-gray-500">
                  <span className="text-matrix">{juegos.length}</span> proyectos totales
                </span>
              </div>
            </div>
          </div>
          
          {/* Scanline effect */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-matrix/50 to-transparent animate-scanline" />
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          
          {/* Plataforma Educativa Destacada (si existe) */}
          {plataformaDestacada && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-serif text-2xl text-white">
                  🎓 Plataforma Educativa Principal
                </h2>
                <span className="rounded border border-bitcoin/30 bg-bitcoin/10 px-2 py-0.5 text-[10px] font-mono text-bitcoin uppercase">
                  Recomendado
                </span>
              </div>
              
              <article
                className="group relative overflow-hidden rounded-xl border-2 border-bitcoin/50 bg-black/80 backdrop-blur-md p-6 shadow-[0_0_40px_rgba(247,147,26,0.15)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(247,147,26,0.25)]"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Preview visual */}
                  <div className="aspect-video overflow-hidden rounded-lg bg-black/60 border border-white/10">
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-serif text-5xl text-bitcoin">🎓</span>
                    </div>
                  </div>
                  
                  {/* Contenido */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl text-bitcoin">
                        {plataformaDestacada.nombre}
                      </h3>
                      <p className="mt-2 font-mono text-xs text-gray-400">
                        {plataformaDestacada.duracion} • {plataformaDestacada.dificultad}
                      </p>
                      <p className="mt-3 text-sm text-gray-300">
                        {plataformaDestacada.descripcionCorta}
                      </p>
                      
                      {/* Features */}
                      {plataformaDestacada.features && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {plataformaDestacada.features.slice(0, 4).map((f, i) => (
                            <span
                              key={i}
                              className="rounded border border-bitcoin/30 bg-bitcoin/10 px-2 py-0.5 text-[10px] font-mono text-bitcoin"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* CTA */}
                    <div className="mt-6">
                      <ArcadeButton
                        href={plataformaDestacada.url || '#'}
                        variant="matrix"
                        className="w-full md:w-auto"
                      >
                        ENTRAR AL LABORATORIO
                      </ArcadeButton>
                    </div>
                  </div>
                </div>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-xl border-2 border-bitcoin/0 group-hover:border-bitcoin/30 transition-colors duration-500 pointer-events-none" />
              </article>
            </div>
          )}

          {/* Sala Arcade - Juegos */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-white">
                🕹️ Sala Arcade
              </h2>
              <div className="flex items-center gap-2">
                <span className="rounded border border-matrix/30 bg-matrix/10 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-matrix">
                  {activos} disponibles
                </span>
                {juegosArcade.some(j => j.estado === 'development') && (
                  <span className="rounded border border-gray-500/30 bg-gray-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                    β En desarrollo
                  </span>
                )}
              </div>
            </div>
            
            {/* Grid de juegos */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {juegosArcade.map((juego) => (
                <div key={juego.id} className="relative">
                  {/* Badge de estética flotante */}
                  {juego.notas?.estetica && (
                    <div className="absolute -top-2 -right-2 z-10">
                      {getEsteticaBadge(juego.notas.estetica)}
                    </div>
                  )}
                  
                  {/* Badge de estado */}
                  {juego.estado === 'development' && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <span className="rounded border border-gray-500/30 bg-gray-500/10 px-2 py-0.5 text-[10px] font-mono text-gray-400">
                        β
                      </span>
                    </div>
                  )}
                  
                  <GameCard {...juego} tipo={juego.tipo === 'comunidad' ? 'arcade' : juego.tipo} url={juego.url || '#'} dificultad={(juego.dificultad === 'variable' || juego.dificultad === 'progresivo') ? 'intermedio' : juego.dificultad} />
                </div>
              ))}
            </div>
            
            {/* CTA principal */}
            <div className="mt-10 flex justify-center">
              <ArcadeButton
                href={juegosArcade.find(j => j.estado === 'active')?.url || '#'}
                variant="bitcoin"
                className="min-w-[200px]"
              >
                🎮 JUGAR AHORA
              </ArcadeButton>
            </div>
            
            {/* Nota de inclusión */}
            <p className="mt-8 text-center font-mono text-xs text-gray-500">
              🌱 Celebramos proyectos en todas las etapas — desde primeros experimentos hasta plataformas completas. 
              <br className="sm:hidden" />
              <span className="text-matrix">El código es poesía. La soberanía financiera es libertad.</span>
            </p>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}
