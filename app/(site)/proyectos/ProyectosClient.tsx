"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ExternalLink, Filter, Search, Trophy, Calendar, Users, Code2, Star, GitFork } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Proyecto,
  type TipoProyecto,
  type EstadoProyecto,
  filterByType,
  filterByStatus,
  sortProyectos,
  getStats,
  ESTADO_CONFIG,
  HACKATHON_CONFIG,
  TIPO_CONFIG,
} from "@/lib/proyectos";
import ArcadeButton from "@/components/ui/ArcadeButton";

// ── Hackathon Section Config ──
interface HackathonSection {
  id: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  lugar: string;
  icon: string;
  color: string;
  glowColor: string;
  borderColor: string;
}

const HACKATHON_SECTIONS: Record<string, HackathonSection> = {
  "custody-ui-2026": {
    id: "custody-ui-2026",
    nombre: "Custody UI Hackathon 2026",
    descripcion: "Segunda edición enfocada en interfaces de custodia soberana. Los participantes debían construir wallets Bitcoin auditables, con código abierto y funcionalidad real de self-custody.",
    fecha: "Junio 2026",
    lugar: "Hackathon Bitcoin México",
    icon: "🏆",
    color: "text-yellow-400",
    glowColor: "shadow-[0_0_30px_rgba(250,204,21,0.2)]",
    borderColor: "border-yellow-400/30",
  },
  "hackathon-bitcoin-mexico-2026": {
    id: "hackathon-bitcoin-mexico-2026",
    nombre: "Hackathon Bitcoin México 2026",
    descripcion: "Primera edición del hackathon. Enfoque libre: educación, Lightning Network, remesas, herramientas para desarrolladores y cualquier solución Bitcoin-first para el ecosistema mexicano.",
    fecha: "Mayo 2026",
    lugar: "Hackathon Bitcoin México",
    icon: "⚡",
    color: "text-bitcoin",
    glowColor: "shadow-[0_0_30px_rgba(247,147,26,0.2)]",
    borderColor: "border-bitcoin/30",
  },
};

// ── Helper: Get hackathon section key from proyecto ──
function getHackathonKey(proyecto: Proyecto): string | null {
  if (!proyecto.hackathon) return null;
  if (proyecto.hackathon.año === 2026 && proyecto.hackathon.evento.includes("Custody UI")) {
    return "custody-ui-2026";
  }
  if (proyecto.hackathon.año === 2026 && proyecto.hackathon.evento.includes("Hackathon Bitcoin México")) {
    return "hackathon-bitcoin-mexico-2026";
  }
  return null;
}

// ── Project Card Component ──
function ProjectCard({ proyecto }: { proyecto: Proyecto }) {
  const estadoConfig = ESTADO_CONFIG[proyecto.estado];
  const tipoConfig = TIPO_CONFIG[proyecto.tipo];
  const hackathonConfig = proyecto.hackathon ? HACKATHON_CONFIG[proyecto.hackathon.lugar] : null;

  return (
    <div
      className={cn(
        "group relative bg-black/80 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden",
        "hover:border-matrix/50 transition-all duration-300",
        "hover:shadow-[0_0_30px_rgba(0,255,65,0.15)]",
        proyecto.destacado && "ring-1 ring-matrix/20"
      )}
    >
      {/* Header con imagen/logo */}
      <div className="relative h-48 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-50 group-hover:opacity-100 transition-opacity duration-300">
            {proyecto.nombre.charAt(0)}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {/* Estado */}
          <span
            className={cn(
              "px-2 py-1 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1",
              estadoConfig.bgColor,
              estadoConfig.color,
              estadoConfig.borderColor,
              "border"
            )}
          >
            <span className={cn(proyecto.estado === "active" && "animate-pulse")}>
              {estadoConfig.icon}
            </span>
            {estadoConfig.label}
          </span>

          {/* Tipo */}
          <span
            className={cn(
              "px-2 py-1 rounded text-[10px] font-mono font-bold uppercase",
              tipoConfig.bgColor,
              tipoConfig.color,
              tipoConfig.borderColor,
              "border"
            )}
          >
            {tipoConfig.label}
          </span>
        </div>

        {/* Hackathon Badge */}
        {hackathonConfig && (
          <div className="absolute top-3 right-3">
            <span
              className={cn(
                "px-2 py-1 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1",
                "bg-black/80 border border-white/20",
                hackathonConfig.color
              )}
            >
              {hackathonConfig.icon} {hackathonConfig.label}
            </span>
          </div>
        )}

        {/* Premio */}
        {proyecto.premio && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-black/90 backdrop-blur-sm border border-yellow-400/30 rounded px-3 py-1.5">
              <p className="text-[11px] font-mono text-yellow-400 font-bold text-center">
                {proyecto.premio}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div>
          <h3 className="font-serif text-xl text-white group-hover:text-matrix transition-colors">
            {proyecto.nombre}
          </h3>
          <p className="text-sm text-gray-400 font-mono mt-1 line-clamp-2">
            {proyecto.descripcionCorta}
          </p>
        </div>

        {/* Stack */}
        <div className="flex flex-wrap gap-1.5">
          {proyecto.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[9px] font-mono bg-matrix/5 text-matrix/70 border border-matrix/20 rounded"
            >
              {tech}
            </span>
          ))}
          {proyecto.stack.length > 4 && (
            <span className="px-2 py-0.5 text-[9px] font-mono text-gray-500">
              +{proyecto.stack.length - 4}
            </span>
          )}
        </div>

        {/* Hackathon Info */}
        {proyecto.hackathon && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
            <Trophy className="w-3 h-3" />
            <span>{proyecto.hackathon.evento}</span>
            <span>•</span>
            <span>{proyecto.hackathon.año}</span>
          </div>
        )}

        {/* Equipo */}
        {proyecto.equipo && proyecto.equipo.length > 0 && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
            <Users className="w-3 h-3" />
            <span className="truncate">
              {proyecto.equipo.map((m) => m.nombre).join(", ")}
            </span>
          </div>
        )}

        {/* Features Preview */}
        {proyecto.features && proyecto.features.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-gray-500 uppercase">Features</p>
            <ul className="space-y-0.5">
              {proyecto.features.slice(0, 3).map((feature, i) => (
                <li key={i} className="text-[11px] font-mono text-gray-400 flex items-start gap-1.5">
                  <span className="text-matrix mt-0.5">▸</span>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-white/5">
          {proyecto.url && (
            <Link
              href={proyecto.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-mono font-bold",
                "bg-bitcoin text-black hover:bg-bitcoin/90 transition-colors"
              )}
            >
              <ExternalLink className="w-3 h-3" />
              Demo
            </Link>
          )}
          {proyecto.repoUrl && (
            <Link
              href={proyecto.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-mono",
                "border border-matrix/30 text-matrix hover:bg-matrix/10 transition-colors"
              )}
            >
<GitFork className="w-3 h-3" />
               Código
            </Link>
          )}
          {!proyecto.url && !proyecto.repoUrl && (
            <span className="flex-1 text-center text-[10px] font-mono text-gray-600 py-2">
              Sin enlaces públicos
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Hackathon Section Header ──
function HackathonSectionHeader({ section, count }: { section: HackathonSection; count: number }) {
  return (
    <div className={cn("relative mb-8 p-6 rounded-lg border bg-black/60 backdrop-blur-sm", section.borderColor, section.glowColor)}>
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:30px_30px] rounded-lg" />
      <div className="relative flex items-start gap-4">
        <div className="text-4xl">{section.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className={cn("font-serif text-2xl md:text-3xl", section.color)}>
              {section.nombre}
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-white/5 border border-white/20 rounded text-gray-400">
              {count} {count === 1 ? "proyecto" : "proyectos"}
            </span>
          </div>
          <p className="text-sm font-mono text-gray-400 mb-3">{section.descripcion}</p>
          <div className="flex items-center gap-4 text-[11px] font-mono text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {section.fecha}
            </span>
            <span className="flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              {section.lugar}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Client Component ──
interface ProyectosClientProps {
  proyectos: Proyecto[];
}

export default function ProyectosClient({ proyectos }: ProyectosClientProps) {
  const [tipoFilter, setTipoFilter] = useState<TipoProyecto | "todos">("todos");
  const [statusFilter, setStatusFilter] = useState<EstadoProyecto | "todos">("todos");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Group projects by hackathon ──
  const groupedProjects = useMemo(() => {
    const filtered = sortProyectos(
      filterByStatus(filterByType(proyectos, tipoFilter), statusFilter)
    ).filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.nombre.toLowerCase().includes(q) ||
        p.descripcionCorta.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q))
      );
    });

    const groups: Record<string, Proyecto[]> = {
      "custody-ui-2026": [],
      "hackathon-bitcoin-mexico-2026": [],
      "sin-hackathon": [],
    };

    filtered.forEach((p) => {
      const key = getHackathonKey(p);
      if (key) {
        groups[key].push(p);
      } else {
        groups["sin-hackathon"].push(p);
      }
    });

    return groups;
  }, [proyectos, tipoFilter, statusFilter, searchQuery]);

  // ── Determine display order: Hackathon 2 first (newest), then Hackathon 1, then others ──
  const sectionOrder = [
    "custody-ui-2026",
    "hackathon-bitcoin-mexico-2026",
    "sin-hackathon",
  ];

  return (
    <div className="relative space-y-12">
      {/* ── Filters ── */}
      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 text-matrix">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-mono uppercase tracking-wider">Filtros</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar proyecto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-sm font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-matrix focus:ring-1 focus:ring-matrix transition-colors"
            />
          </div>

          {/* Type Filter */}
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value as TipoProyecto | "todos")}
            className="bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-matrix focus:ring-1 focus:ring-matrix transition-colors"
          >
            <option value="todos" className="bg-black">Todos los tipos</option>
            <option value="interno" className="bg-black">🏛️ Acepta Bitcoin</option>
            <option value="comunidad" className="bg-black">🌐 Comunidad</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EstadoProyecto | "todos")}
            className="bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-matrix focus:ring-1 focus:ring-matrix transition-colors"
          >
            <option value="todos" className="bg-black">Todos los estados</option>
            <option value="active" className="bg-black">● Activo</option>
            <option value="development" className="bg-black">◐ En Desarrollo</option>
            <option value="abandoned" className="bg-black">○ Pausado</option>
          </select>
        </div>
      </div>

      {/* ── Hackathon Sections ── */}
      {sectionOrder.map((sectionKey) => {
        const sectionProjects = groupedProjects[sectionKey];
        if (sectionProjects.length === 0) return null;

        // "Sin hackathon" section
        if (sectionKey === "sin-hackathon") {
          return (
            <div key={sectionKey} className="space-y-6">
              <div className="relative mb-8 p-6 rounded-lg border border-matrix/30 bg-black/60 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:30px_30px] rounded-lg" />
                <div className="relative flex items-start gap-4">
                  <div className="text-4xl">🏗️</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="font-serif text-2xl md:text-3xl text-matrix">
                        Proyectos Independientes
                      </h2>
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-white/5 border border-white/20 rounded text-gray-400">
                        {sectionProjects.length} {sectionProjects.length === 1 ? "proyecto" : "proyectos"}
                      </span>
                    </div>
                    <p className="text-sm font-mono text-gray-400">
                      Proyectos construidos por la comunidad de Acepta Bitcoin fuera del contexto de hackathon.
                      Infraestructura soberana para el ecosistema Bitcoin mexicano.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectionProjects.map((proyecto) => (
                  <ProjectCard key={proyecto.id} proyecto={proyecto} />
                ))}
              </div>
            </div>
          );
        }

        // Hackathon section
        const section = HACKATHON_SECTIONS[sectionKey];
        if (!section) return null;

        return (
          <div key={sectionKey} className="space-y-6">
            <HackathonSectionHeader section={section} count={sectionProjects.length} />

            {/* Podium for Hackathon 2 (top 3) */}
            {sectionKey === "custody-ui-2026" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* 2nd place - left */}
                {sectionProjects
                  .filter((p) => p.hackathon?.lugar === "second")
                  .map((p) => (
                    <div key={p.id} className="md:mt-8">
                      <ProjectCard proyecto={p} />
                    </div>
                  ))}
                {/* 1st place - center, elevated */}
                {sectionProjects
                  .filter((p) => p.hackathon?.lugar === "winner")
                  .map((p) => (
                    <div key={p.id} className="relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <span className="px-3 py-1 bg-yellow-400 text-black text-[10px] font-mono font-bold rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                          🏆 GANADOR
                        </span>
                      </div>
                      <div className="ring-2 ring-yellow-400/50 shadow-[0_0_40px_rgba(250,204,21,0.15)]">
                        <ProjectCard proyecto={p} />
                      </div>
                    </div>
                  ))}
                {/* 3rd place - right */}
                {sectionProjects
                  .filter((p) => p.hackathon?.lugar === "third")
                  .map((p) => (
                    <div key={p.id} className="md:mt-12">
                      <ProjectCard proyecto={p} />
                    </div>
                  ))}
              </div>
            )}

            {/* Rest of projects (participants) */}
            {sectionProjects.filter((p) => p.hackathon?.lugar === "participant").length > 0 && (
              <>
                <h3 className="font-mono text-sm text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Star className="w-3 h-3" />
                  Participantes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sectionProjects
                    .filter((p) => p.hackathon?.lugar === "participant")
                    .map((proyecto) => (
                      <ProjectCard key={proyecto.id} proyecto={proyecto} />
                    ))}
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* ── Empty State ── */}
      {Object.values(groupedProjects).every((g) => g.length === 0) && (
        <div className="text-center py-20 space-y-4">
          <div className="text-6xl opacity-30">🔍</div>
          <p className="font-mono text-gray-500">
            No se encontraron proyectos con los filtros seleccionados.
          </p>
          <button
            onClick={() => {
              setTipoFilter("todos");
              setStatusFilter("todos");
              setSearchQuery("");
            }}
            className="text-matrix font-mono text-sm hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="text-center py-12 border-t border-white/5">
        <p className="font-mono text-sm text-gray-500 mb-4">
          ¿Construiste algo con Bitcoin? Muestra tu proyecto al ecosistema.
        </p>
        <ArcadeButton href="/hackathon/custody-ui-2026" variant="bitcoin">
          Participa en el próximo Hackathon →
        </ArcadeButton>
      </div>
    </div>
  );
}