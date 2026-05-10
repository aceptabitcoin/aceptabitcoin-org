// ============================================================
// PROJECT GRID — Display hackathon projects
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { Terminal, ExternalLink, Zap, Clock, Users, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectGrid({
  edition,
  className,
}: {
  edition: any;
  className?: string;
}) {
  // Placeholder projects for the current edition
  const projects = edition?.results?.topProjects || [];
  const hasProjects = projects.length > 0;

  return (
    <div className={cn("space-y-8", className)}>
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-bitcoin" />
          <span className="font-mono text-sm text-gray-400">
            Mostrando{" "}
            <span className="text-white font-bold">
              {hasProjects ? projects.length : 0}
            </span>{" "}
            proyectos
          </span>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[10px] font-mono text-gray-400 hover:border-matrix/30 hover:text-matrix transition-colors">
            Todos
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-bitcoin/20 bg-bitcoin/10 text-[10px] font-mono text-bitcoin transition-colors">
            Activos
          </button>
        </div>
      </div>

      {/* No Results */}
      {!hasProjects && (
        <div className="text-center py-20 hackathon-card">
          <Rocket className="h-12 w-12 text-gray-700 mx-auto mb-4 animate-bounce" />
          <h3 className="font-serif text-xl font-bold text-white mb-2">
            ¡Proyectos próximamente!
          </h3>
          <p className="font-mono text-sm text-gray-500 max-w-md mx-auto">
            Los proyectos de esta edición aparecerán aquí después del hackathon.
            ¡Mantente atento!
          </p>
        </div>
      )}

      {/* Projects Grid */}
      {hasProjects && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project: any, idx: number) => (
            <ProjectCard key={idx} project={project} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  return (
    <div className="hackathon-project-card p-5 group">
      {/* Top Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center flex-shrink-0">
            <span className="font-vt323 text-lg text-bitcoin font-bold">
              {project.name?.charAt(0) || "?"}
            </span>
          </div>
          <div>
            <h4 className="font-serif text-base font-bold text-white group-hover:text-bitcoin transition-colors">
              {project.name || `Proyecto ${index + 1}`}
            </h4>
            <p className="font-mono text-[10px] text-gray-500">
              {project.theme || "Sin categoría"}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="font-mono text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
        {project.description || "Descripción del proyecto..."}
      </p>

      {/* Stack */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(project.stack || []).slice(0, 4).map((tech: string, i: number) => (
          <span
            key={i}
            className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-mono text-gray-500 uppercase"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {project.team?.length || 1}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            En desarrollo
          </span>
        </div>
        <div className="flex gap-2">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-matrix transition-colors"
            >
              <Terminal className="h-4 w-4" />
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-bitcoin transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
