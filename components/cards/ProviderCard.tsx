"use client";
import { useState } from "react";
import { ArrowUpRight, MapPin, ExternalLink, Zap } from "lucide-react";
import TierBadge from "@/components/badges/TierBadge";
import { TIER_CONFIG, type Proveedor } from "@/lib/proveedores";

interface ProviderCardProps {
  proveedor: Proveedor;
  index: number;
}

export default function ProviderCard({ proveedor, index }: ProviderCardProps) {
  const [imageError, setImageError] = useState(false);
  const tierConfig = TIER_CONFIG[proveedor.tier];
  const hasReferido = !!proveedor.urlReferido;
  const animationDelay = `${index * 50}ms`;

  return (
    <div
      className={`group relative overflow-hidden bg-black/60 backdrop-blur-md border border-white/10 hover:border-matrix/50 transition-all duration-300 rounded-lg hover:shadow-[0_0_20px_rgba(0,255,65,0.15)]`}
      style={{ animationDelay }}
    >
      {/* Corner Accents (Terminal Vibe) */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-matrix/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-matrix/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-matrix/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-matrix/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-br-lg" />

      <div className="p-5 space-y-4">
        {/* Header: Logo + Tier */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo Container */}
            <div className={`relative w-12 h-12 shrink-0 rounded-lg border ${tierConfig.borderColor || 'border-white/10'} ${tierConfig.bgColor || 'bg-white/5'} flex items-center justify-center overflow-hidden`}>
              {!imageError ? (
                <img
                  src={proveedor.logo}
                  alt={proveedor.nombre}
                  // 🕶️ DS Rule: Evita color natural → grayscale + hover reveal
                  className="w-full h-full object-contain p-1 grayscale group-hover:grayscale-0 transition-all duration-300"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                <span className="font-vt323 text-xl text-bitcoin">
                  {proveedor.nombre.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-bold text-white group-hover:text-bitcoin transition-colors truncate">
                {proveedor.nombre}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <TierBadge tier={proveedor.tier} />
              </div>
            </div>
          </div>

          {/* Destacado Badge */}
          {proveedor.destacado && (
            <div className="flex items-center gap-1 bg-bitcoin/10 border border-bitcoin/30 px-2 py-0.5 rounded-full shrink-0">
              <Zap className="h-3 w-3 text-bitcoin" />
              <span className="text-[9px] font-mono text-bitcoin uppercase tracking-wider">Destacado</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="font-mono text-xs text-gray-400 leading-relaxed line-clamp-3">
          {proveedor.descripcion}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {proveedor.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-gray-400 uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{proveedor.ubicacion}</span>
        </div>

        {/* CTA Buttons (DS Native: sin shadcn overrides) */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <a
            href={hasReferido ? proveedor.urlReferido : proveedor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 h-9 font-mono text-xs font-bold rounded-lg bg-bitcoin text-black hover:bg-bitcoin/90 hover:shadow-[0_0_15px_rgba(247,147,26,0.3)] transition-all active:scale-95"
          >
            {hasReferido ? "Con Referido" : "Visitar Sitio"}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          {hasReferido && (
            <a
              href={proveedor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 h-9 px-3 font-mono text-[10px] border border-matrix/30 text-matrix rounded-lg hover:bg-matrix/10 hover:shadow-[0_0_10px_rgba(0,255,65,0.15)] transition-all shrink-0"
            >
              <ExternalLink className="h-3 w-3" />
              Directo
            </a>
          )}
        </div>

        {/* Referido Note */}
        {hasReferido && (
          <p className="text-[9px] text-gray-600 font-mono text-center pt-1">
            <span className="text-bitcoin">❯ </span> Link con referido — apoyas al proyecto
          </p>
        )}
      </div>
    </div>
  );
}