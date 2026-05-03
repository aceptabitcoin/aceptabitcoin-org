import React, { type FC } from 'react';
import { ExternalLink, Zap, Shield, Leaf, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Powerup {
  icon: string;
  label: string;
  color: string;
}

export interface GameCardProps {
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
}

const tipoConfig = {
  arcade: { label: 'Arcade', icon: Zap, color: 'matrix', bg: 'bg-matrix/10', border: 'border-matrix/30', text: 'text-matrix' },
  plataforma: { label: 'Plataforma', icon: Layers, color: 'bitcoin', bg: 'bg-bitcoin/10', border: 'border-bitcoin/30', text: 'text-bitcoin' },
} as const;

const dificultadConfig = {
  facil: { label: 'Facil', color: 'matrix' },
  intermedio: { label: 'Medio', color: 'bitcoin' },
  avanzado: { label: 'Avanzado', color: 'bitcoin' },
} as const;

const estadoConfig = {
  active: { label: 'Activo', color: 'matrix', bg: 'bg-matrix/10', text: 'text-matrix', border: 'border-matrix/30' },
  development: { label: 'En Dev', color: 'bitcoin', bg: 'bg-bitcoin/10', text: 'text-bitcoin', border: 'border-bitcoin/30' },
  abandoned: { label: 'Pausado', color: 'red-500', bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' },
} as const;

export const GameCard: FC<GameCardProps> = ({
  nombre,
  tipo,
  url,
  repoUrl,
  descripcionCorta,
  categoria,
  dificultad,
  duracion,
  premio,
  features,
  estado,
  destacado,
}) => {
  const tipoInfo = tipoConfig[tipo];
  const TipoIcon = tipoInfo.icon;
  const estadoInfo = estadoConfig[estado];
  const dificultadInfo = dificultadConfig[dificultad];

  const extractPowerup = (feature?: string) => {
    if (!feature) return null;
    const match = feature.match(/([⚡🟧🌱🔷])/);
    return match ? { icon: match[1], label: feature } : null;
  };

  const powerups = features?.map(f => extractPowerup(f)).filter(Boolean) || [];

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-xl border-2 transition-all duration-500 ',
        'bg-black/80 backdrop-blur-md',
        'border-white/10 hover:border-matrix/50 hover:shadow-[0_0_30px_rgba(0,255,65,0.15)]',
        destacado && 'border-bitcoin/50 shadow-[0_0_40px_rgba(247,147,26,0.15)]',
        estado === 'abandoned' && 'opacity-60 grayscale'
      )}
    >
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        <span
          className={cn(
            'rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-wider',
            estadoInfo.bg, estadoInfo.text, estadoInfo.border, 'border'
          )}
        >
          {estadoInfo.label}
        </span>
        {destacado && (
          <span className="rounded-full bg-bitcoin/20 px-3 py-1 text-[10px] font-mono text-bitcoin border border-bitcoin/30">
            Top
          </span>
        )}
      </div>

      <div className="relative aspect-[4/3] overflow-hidden bg-black/60 border-b border-white/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-xl bg-matrix/5 border border-matrix/20 flex items-center justify-center">
            <span className="font-serif text-matrix text-lg">{nombre[0]}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-2">
            <TipoIcon className={cn('h-4 w-4', tipoInfo.text)} />
            <span className={cn('font-mono text-xs', tipoInfo.text)}>{tipoInfo.label}</span>
            <span className="text-white/30">•</span>
            <span className="font-mono text-[10px] text-gray-500 uppercase">{categoria}</span>
          </div>
          <h3 className="mt-1 font-serif text-lg font-bold text-white">{nombre}</h3>
        </div>
      </div>

      <div className="p-4">
        <p className="font-mono text-xs text-gray-400 leading-relaxed mb-3">
          {descripcionCorta}
        </p>

        {powerups.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {powerups.slice(0, 3).map((p, i) => {
              const powerup = p as Powerup;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono border border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                >
                  {powerup.icon} {powerup.label}
                </span>
              );
            })}
            {powerups.length > 3 && (
              <span className="text-[10px] font-mono text-gray-600">+{powerups.length - 3}</span>
            )}
          </div>
        )}

        <div className="mb-3 flex flex-wrap gap-1.5">
          <span
            className={cn(
              'rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide ',
              dificultadInfo.color === 'matrix' && 'bg-matrix/10 text-matrix border border-matrix/30',
              dificultadInfo.color === 'bitcoin' && 'bg-bitcoin/10 text-bitcoin border border-bitcoin/30'
            )}
          >
            {dificultadInfo.label}
          </span>
          <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono text-gray-400 border border-white/10">
            {duracion}
          </span>
          {premio && (
            <span className="rounded bg-bitcoin/10 px-2 py-0.5 text-[10px] font-mono text-bitcoin border border-bitcoin/30">
              {premio}
            </span>
          )}
        </div>

        {features && features.length > 0 && (
          <div className="mb-3">
            <p className="text-[9px] font-mono text-gray-600 uppercase mb-1.5">Features</p>
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 2).map((f, i) => (
                <span
                  key={i}
                  className="rounded bg-white/5 px-2 py-0.5 text-[9px] font-mono text-gray-400 border border-white/10 truncate max-w-[120px]"
                  title={f}
                >
                  {f}
                </span>
              ))}
              {features.length > 2 && (
                <span className="text-[9px] font-mono text-gray-600">+{features.length - 2}</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/5 p-4 flex items-center justify-between gap-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex-1 rounded-lg px-3 py-2 text-center text-sm font-mono transition-all',
            'bg-bitcoin text-black hover:bg-bitcoin/90 active:scale-95'
          )}
        >
          Jugar / Entrar
          <ExternalLink className="ml-1.5 inline-block h-3 w-3" />
        </a>
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/20 px-3 py-2 text-sm font-mono text-gray-400 hover:border-white/40 hover:text-white transition-all"
            aria-label="Ver codigo fuente"
          >
            <Shield className="h-4 w-4" />
          </a>
        )}
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
        aria-label={`Acceder a ${nombre} - Se abre en ventana nueva`}
      />
    </article>
  );
};
