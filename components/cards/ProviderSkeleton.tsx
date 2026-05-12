"use client";

// 📌 DESIGN SYSTEM: "Bitcoin Matrix" v2.0 — Skeleton Loader
// - Contenedor Glass Bunker (`bg-black/80 backdrop-blur-md border-white/10`)
// - Placeholders neutros (`bg-white/5`) para no distraer durante la carga
// - Estructura 1:1 con `ProviderCard`: Header, Desc, Tags, Location, CTA
// - Accesibilidad: `role="status"`, `aria-hidden`, `aria-busy`

interface ProviderSkeletonProps {
  count?: number;
}

export default function ProviderSkeleton({ count = 6 }: ProviderSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          role="status"
          aria-hidden="true"
          className="bg-black/80 backdrop-blur-md border border-white/10 p-6 space-y-4 rounded-lg animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Header: Logo + Nombre + Badge de Tier */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/5" />
              <div className="space-y-2">
                <div className="w-36 h-4 bg-white/5 rounded" />
                <div className="w-24 h-3 bg-white/5 rounded" />
              </div>
            </div>
            <div className="w-20 h-6 bg-white/5 rounded-full" />
          </div>

          {/* Líneas de Descripción */}
          <div className="space-y-1.5">
            <div className="w-full h-3 bg-white/5 rounded" />
            <div className="w-3/4 h-3 bg-white/5 rounded" />
            <div className="w-1/2 h-3 bg-white/5 rounded" />
          </div>

          {/* Tags / Categorías */}
          <div className="flex gap-2">
            <div className="w-20 h-5 bg-white/5 rounded-md" />
            <div className="w-16 h-5 bg-white/5 rounded-md" />
            <div className="w-14 h-5 bg-white/5 rounded-md" />
          </div>

          {/* Ubicación */}
          <div className="w-28 h-3 bg-white/5 rounded" />

          {/* Botón CTA */}
          <div className="w-full h-10 bg-white/5 rounded-lg" />
        </div>
      ))}
    </>
  );
}