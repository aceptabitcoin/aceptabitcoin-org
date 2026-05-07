// ============================================================
// PROYECTOS — Types, Utilities & Data Loader
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================
export type TipoProyecto = "interno" | "comunidad";
export type EstadoProyecto = "active" | "development" | "abandoned";
export type HackathonLugar = "winner" | "second" | "third" | "participant";
export type DificultadProyecto = "facil" | "intermedio" | "avanzado" | "variable" | "progresivo";
export interface TeamMember {
  nombre: string;
  rol: string;
  ubicacion: string;
}
export interface HackathonInfo {
  evento: string;
  lugar: HackathonLugar;
  año: number;
}
export interface ReviewInfo {
  fortalezas: string[];
  oportunidades: string[];
  impacto: string;
}
export interface Metrica {
  label: string;
  valor: string;
}
export interface NotasProyecto {
  nivel: string;
  estetica: string;
  publico_objetivo?: string;
  diferenciador?: string;
  herramienta?: string;
  valor?: string;
  portabilidad?: string;
  estado_contenido?: string;
  modelo?: string;
  adaptacion?: string;
  stack_alignment?: string;
  estado_hosting?: string;
}
export interface Proyecto {
  id: string;
  nombre: string;
  tipo: TipoProyecto;
  descripcion: string;
  descripcionCorta: string;
  url: string | null;
  repoUrl: string | null;
  logo: string;
  imagen: string;
  stack: string[];
  estado: EstadoProyecto;
  categoria?: string;
  dificultad?: DificultadProyecto;
  duracion?: string;
  premio?: string;
  hackathon?: HackathonInfo | null;
  equipo?: TeamMember[];
  features?: string[];
  metricas?: Metrica[];
  review?: ReviewInfo;
  notas?: NotasProyecto;
  destacado?: boolean;
  orden?: number;
  fecha: string;
}
// ── Estado Config (Semáforo Visual) ──
export const ESTADO_CONFIG: Record<EstadoProyecto, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  glowColor: string;
}> = {
  active: {
    label: "Activo",
    color: "text-matrix",
    bgColor: "bg-matrix/10",
    borderColor: "border-matrix/30",
    icon: "●",
    glowColor: "shadow-[0_0_20px_rgba(0,255,65,0.15)]",
  },
  development: {
    label: "En Desarrollo",
    color: "text-bitcoin",
    bgColor: "bg-bitcoin/10",
    borderColor: "border-bitcoin/30",
    icon: "◐",
    glowColor: "shadow-[0_0_20px_rgba(247,147,26,0.15)]",
  },
  abandoned: {
    label: "Pausado",
    color: "text-red-400",
    bgColor: "bg-red-500/5",
    borderColor: "border-red-500/20",
    icon: "○",
    glowColor: "",
  },
};
// ── Hackathon Config (Badges) ──
export const HACKATHON_CONFIG: Record<HackathonLugar, {
  icon: string;
  color: string;
  label: string;
}> = {
  winner: { icon: "🏆", color: "text-yellow-400", label: "GANADOR" },
  second: { icon: "🥈", color: "text-gray-300", label: "2DO LUGAR" },
  third: { icon: "🥉", color: "text-amber-600", label: "3ER LUGAR" },
  participant: { icon: "🎖️", color: "text-matrix", label: "PARTICIPANTE" },
};
// ── Tipo Config (Badge de origen) ──
export const TIPO_CONFIG: Record<TipoProyecto, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  interno: {
    label: "Acepta Bitcoin",
    color: "text-bitcoin",
    bgColor: "bg-bitcoin/10",
    borderColor: "border-bitcoin/30",
  },
  comunidad: {
    label: "Comunidad",
    color: "text-matrix",
    bgColor: "bg-matrix/10",
    borderColor: "border-matrix/30",
  },
};
// ── Filter by type ──
export function filterByType(proyectos: Proyecto[], tipo: TipoProyecto | "todos"): Proyecto[] {
  if (tipo === "todos") return proyectos;
  return proyectos.filter((p) => p.tipo === tipo);
}
// ── Filter by status ──
export function filterByStatus(proyectos: Proyecto[], estado: EstadoProyecto | "todos"): Proyecto[] {
  if (estado === "todos") return proyectos;
  return proyectos.filter((p) => p.estado === estado);
}
// ── Filter by destacado ──
export function filterDestacados(proyectos: Proyecto[]): Proyecto[] {
  return proyectos.filter((p) => p.destacado === true);
}
// ── Sort by orden + fecha ──
export function sortProyectos(proyectos: Proyecto[]): Proyecto[] {
  return [...proyectos].sort((a, b) => {
    // Primero por orden explícito (menor = más prioritario)
    const ordenA = a.orden ?? 999;
    const ordenB = b.orden ?? 999;
    if (ordenA !== ordenB) return ordenA - ordenB;
    // Luego por fecha (más reciente primero)
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });
}
// ── Get stats ──
export function getStats(proyectos: Proyecto[]) {
  return {
    total: proyectos.length,
    internos: proyectos.filter((p) => p.tipo === "interno").length,
    comunidad: proyectos.filter((p) => p.tipo === "comunidad").length,
    activos: proyectos.filter((p) => p.estado === "active").length,
    enDesarrollo: proyectos.filter((p) => p.estado === "development").length,
    pausados: proyectos.filter((p) => p.estado === "abandoned").length,
    destacados: proyectos.filter((p) => p.destacado === true).length,
  };
}
// — Data Loader (Server Component compatible) —
export async function getProyectos(): Promise<Proyecto[]> {
  const proyectos = await import("@/data/proyectos.json");
  return proyectos.default as Proyecto[];
}
