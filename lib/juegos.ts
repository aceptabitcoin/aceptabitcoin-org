export type Juego = {
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

// Tipo para juegos con url como string (compatibilidad con GameCard)
export type JuegoCard = Omit<Juego, 'url'> & { url: string };

// Static import of JSON data (no runtime fetch)
import juegosRaw from '@/data/juegos.json';

export const juegos: Juego[] = juegosRaw as Juego[];

// Helper to get games for card display (url as required string)
export function getJuegosCards(): JuegoCard[] {
  return juegos.filter((j): j is JuegoCard => j.url !== null);
}