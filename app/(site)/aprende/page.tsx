import { GameCard } from '@/components/cards/GameCard';
import ArcadeButton from '@/components/ui/ArcadeButton';

// Tipos importados desde el schema JSON
type Juego = {
  id: string;
  nombre: string;
  tipo: 'arcade' | 'plataforma';
  descripcionCorta: string;
  url: string;
  repoUrl?: string | null;
  logo: string;
  imagen: string;
  categoria: string;
  dificultad: 'facil' | 'intermedio' | 'avanzado';
  duracion: string;
  premio?: string;
  stack?: string[];
  hackathon?: {
    evento: string;
    lugar: string;
    año: number;
  } | null;
  equipo?: Array<{
    nombre: string;
    rol: string;
    ubicacion: string;
  }>;
  features?: string[];
  estado: 'active' | 'development' | 'abandoned';
  destacado: boolean;
  orden?: number;
  fecha: string;
};

// Datos cargados desde data/juegos.json (placeholder para build)
const juegos: Juego[] = [
  {
    id: 'mariachi-vs-inflation',
    nombre: 'Mariachi vs Inflation',
    tipo: 'arcade',
    descripcionCorta: '¡Corta la inflación, guarda Bitcoin! Aprende soberanía financiera jugando.',
    url: 'https://mariachi-vs-inflation.vercel.app',
    repoUrl: 'https://github.com/valentecreativo/mariachi-vs-inflation',
    logo: '/juegos/mariachi.svg',
    imagen: '/juegos/mariachi-preview.jpg',
    categoria: 'economia',
    dificultad: 'facil',
    duracion: '5-10 mins',
    premio: '🌮 100 sats de conocimiento',
    stack: ['Kaplay', 'Vite', 'Vanilla JS', 'Vercel'],
    hackathon: {
      evento: 'Hackathon Bitcoin México',
      lugar: 'participant',
      año: 2024,
    },
    equipo: [{ nombre: 'ValeCreativo & Pantera', rol: 'Developers', ubicacion: 'México' }],
    features: [
      'Mecánica Fruit Ninja mobile-first',
      'Mensajes de consciencia cada ~15s',
      'Powerups educativos: ⚡ Lightning, 🟧 Bloque, 🌱 Ahorro, 🔷 Nodo',
    ],
    estado: 'active',
    destacado: true,
    orden: 1,
    fecha: '2024-04-20',
  },
  {
    id: 'bitcoin-visionary-academy',
    nombre: 'Bitcoin Visionary Academy',
    tipo: 'plataforma',
    descripcionCorta: 'Domina Bitcoin con educación estructurada y práctica.',
    url: 'https://bitcoin.visionaryai.lat',
    repoUrl: null,
    logo: '/juegos/visionary.svg',
    imagen: '/juegos/visionary-preview.jpg',
    categoria: 'educacion',
    dificultad: 'avanzado',
    duracion: 'Ilimitado',
    premio: '🎓 Certificación de conocimiento',
    stack: ['Next.js', 'TypeScript', 'Bitcoin Core'],
    hackathon: null,
    equipo: [{ nombre: 'Acepta Bitcoin Dev Team', rol: 'Core Team', ubicacion: 'México' }],
    features: [
      'Rutas de aprendizaje progresivas',
      'Laboratorios interactivos',
      'Simuladores de Lightning Network',
      'Seguimiento de progreso',
    ],
    estado: 'active',
    destacado: true,
    orden: 0,
    fecha: '2026-05-03',
  },
];

export default async function AprendePage() {
  // Separar plataforma destacada del resto (orden 0 = prioridad)
  const plataformasDestacadas = juegos
    .filter((j) => j.tipo === 'plataforma' && j.destacado)
    .sort((a, b) => (a.orden || 99) - (b.orden || 99));

  const juegosArcade = juegos
    .filter((j) => j.tipo === 'arcade')
    .sort((a, b) => (a.orden || 99) - (b.orden || 99));

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black/90">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Aprende Jugando
            </h1>
            <p className="mt-4 font-mono text-sm text-gray-400 md:text-base">
              Domina Bitcoin a través de la experiencia lúdica y la práctica directa
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Grid principal */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Plataforma Educativa Destacada */}
          <div className="lg:col-span-3">
            <h2 className="font-serif text-2xl text-white mb-6">
              Plataforma Educativa Principal
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plataformasDestacadas.map((plataforma) => (
                <article
                  key={plataforma.id}
                  className="group relative overflow-hidden rounded-xl border-2 border-bitcoin/50 bg-black/80 backdrop-blur-md p-6 shadow-[0_0_40px_rgba(247,147,26,0.15)] transition-all duration-500 hover:scale-[1.02]"
                >
                  <div className="aspect-video overflow-hidden rounded-lg bg-black/60">
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-serif text-4xl text-bitcoin">🎓</span>
                    </div>
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-bitcoin">{plataforma.nombre}</h3>
                  <p className="mt-2 font-mono text-sm text-gray-400">{plataforma.duracion}</p>
                  <p className="mt-2 text-xs text-gray-500">{plataforma.descripcionCorta}</p>
                  {plataforma.features && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {plataforma.features.slice(0, 3).map((f, i) => (
                        <span
                          key={i}
                          className="rounded bg-bitcoin/10 px-2 py-0.5 text-[10px] font-mono text-bitcoin border border-bitcoin/30"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* ArcadeButton - variante matrix para información/técnico */}
                  <div className="mt-4 flex justify-center">
                    <ArcadeButton
                      href={plataforma.url}
                      label="ENTRAR AL LABORATORIO"
                      variant="matrix"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Juegos Arcade */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-white">Juegos Arcade</h2>
              <span className="rounded bg-matrix/10 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-matrix border border-matrix/30">
                {juegosArcade.length} disponibles
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {juegosArcade.map((juego) => (
                <GameCard key={juego.id} {...juego} />
              ))}
            </div>
            {/* ArcadeButton - variante bitcoin para acción principal */}
            <div className="mt-8 flex justify-center">
              <ArcadeButton
                href="https://mariachi-vs-inflation.vercel.app"
                label="JUGAR AHORA"
                variant="bitcoin"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
