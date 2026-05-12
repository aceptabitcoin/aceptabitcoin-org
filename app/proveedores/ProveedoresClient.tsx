"use client";
import { useState, useEffect, useMemo } from "react";
import { Globe, Users, Crown, Handshake, User, Search, MapPin, Utensils, UserCog } from "lucide-react";
import ProviderCard from "@/components/cards/ProviderCard";
import ProviderSkeleton from "@/components/cards/ProviderSkeleton";
import CategoryFilter from "@/components/filters/CategoryFilter";
import MatrixRain from "@/components/ui/MatrixRain";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { type Proveedor, type Categoria, getStats } from "@/lib/proveedores";

// 📌 REBRAND NOTE (2026-05-12):
// - UI visible: "Comercio Libre" (nuevo nombre para usuarios)
// - Estructura interna: se mantiene "proveedores" en rutas, imports y archivos
// - Nuevas categorías visibles: "Restaurantes" (Utensils), "Consultoría" (UserCog)

interface ProveedoresClientProps {
  proveedores: Proveedor[];
}

export default function ProveedoresClient({ proveedores }: ProveedoresClientProps) {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Categoria | "todos">("todos");
  const [searchQuery, setSearchQuery] = useState("");

  // Mínimo 600ms para transición suave de skeletons (DS: smooth transitions)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Filtros combinados
  const filtered = useMemo(() => {
    let result = proveedores;
    if (activeCategory !== "todos") {
      result = result.filter((p) => p.categoria === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.ubicacion.toLowerCase().includes(q)
      );
    }
    return result;
  }, [proveedores, activeCategory, searchQuery]);

  const stats = useMemo(() => getStats(proveedores), [proveedores]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    proveedores.forEach((p) => { counts[p.categoria] = (counts[p.categoria] || 0) + 1; });
    return counts;
  }, [proveedores]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Effects (DS Aligned) */}
        <MatrixRain className="opacity-20" speed={0.5} density={15} />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(0,255,65,0.06)_1px,transparent_1px)] bg-[size:50px_50px]" />
        {/* DS: Bitcoin Orange glow blur - adjusted opacity for subtlety */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-bitcoin/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
          
          {/* ═══════════════════════════════════════════════════════
              HEADER (font-serif títulos, font-mono datos) — REBRAND
              ═══════════════════════════════════════════════════════ */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 bg-matrix/10 border border-matrix/30 px-4 py-1.5 rounded-full text-matrix text-[10px] font-bold uppercase tracking-[0.2em] font-mono">
              <Globe className="h-3 w-3" /> Comercio Libre
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight">
              Comercio{" "}
              <span className="text-bitcoin drop-shadow-[0_0_25px_rgba(247,147,26,0.5)]">Libre</span>
            </h1>
            <p className="font-mono text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Restaurantes, consultores, exchanges y comercios que operan con Bitcoin en México.
              <br />
              <span className="text-matrix">Sin intermediarios. Sin permiso. Sin censura.</span>
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════
              STATS BAR (glass bunker + font-vt323 métricas)
              ═══════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Total", value: stats.total, icon: Users, color: "text-matrix", border: "border-matrix/20", glow: "hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]" },
              { label: "Patrocinadores", value: stats.patrocinadores, icon: Crown, color: "text-bitcoin", border: "border-bitcoin/30", glow: "hover:shadow-[0_0_20px_rgba(247,147,26,0.3)]" },
              { label: "Partners", value: stats.partners, icon: Handshake, color: "text-matrix", border: "border-matrix/20", glow: "hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]" },
              { label: "Miembros", value: stats.miembros, icon: User, color: "text-gray-300", border: "border-white/10", glow: "hover:border-white/20" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`bg-black/80 backdrop-blur-md border ${stat.border} p-4 text-center rounded-lg transition-all duration-300 ${stat.glow} group`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-vt323 text-2xl text-white">{stat.value}</span>
                </div>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ═══════════════════════════════════════════════════════
              FILTERS & SEARCH (DS input rules + new categories)
              ═══════════════════════════════════════════════════════ */}
          <div className="space-y-6 mb-12">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar restaurantes, consultores, servicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-full pl-11 pr-4 py-3 text-sm font-mono text-white placeholder-gray-600 focus:border-matrix focus:ring-1 focus:ring-matrix/50 outline-none transition-all"
              />
            </div>
            <div className="flex justify-center">
              <CategoryFilter active={activeCategory} onChange={setActiveCategory} counts={categoryCounts} />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              RESULTS COUNT (font-mono terminal style) — REBRAND
              ═══════════════════════════════════════════════════════ */}
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <p className="font-mono text-xs text-gray-500">
              <span className="text-matrix">❯</span> Mostrando{" "}
              <span className="text-white font-bold">{filtered.length}</span> de{" "}
              <span className="text-white">{proveedores.length}</span> comercios
              {searchQuery && (
                <span className="text-bitcoin"> | Filtro: "{searchQuery}"</span>
              )}
            </p>
            {activeCategory !== "todos" && (
              <button
                onClick={() => setActiveCategory("todos")}
                className="text-[10px] font-mono text-gray-500 hover:text-matrix transition-colors uppercase tracking-wider"
              >
                Limpiar filtro ✕
              </button>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════
              GRID (ProviderCard / Skeleton / Empty) — REBRAND
              ═══════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <ProviderSkeleton count={6} />
            ) : filtered.length > 0 ? (
              filtered.map((proveedor, index) => (
                <ProviderCard key={proveedor.id} proveedor={proveedor} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-black/40 border border-white/10 rounded-lg backdrop-blur-sm">
                <MapPin className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                <p className="font-mono text-sm text-gray-500 mb-2">
                  No se encontraron comercios{searchQuery && <span className="text-bitcoin"> para "{searchQuery}"</span>}
                </p>
                <button
                  onClick={() => { setActiveCategory("todos"); setSearchQuery(""); }}
                  className="mt-4 text-xs font-mono text-matrix hover:text-bitcoin transition-colors border border-matrix/30 px-3 py-1.5 rounded hover:bg-matrix/10"
                >
                  Resetear búsqueda →
                </button>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════
              FOOTER CTA (font-vt323 + Bitcoin Orange glow) — REBRAND
              ═══════════════════════════════════════════════════════ */}
          <div className="mt-20 text-center space-y-4 border-t border-white/10 pt-12">
            <div className="inline-flex items-center gap-2 bg-bitcoin/10 border border-bitcoin/30 px-4 py-2 rounded-full">
              <Crown className="h-4 w-4 text-bitcoin" />
              <span className="font-mono text-xs text-bitcoin font-bold uppercase tracking-wider">
                ¿Tu negocio acepta Bitcoin?
              </span>
            </div>
            <p className="font-mono text-sm text-gray-400 max-w-lg mx-auto">
              Únete al directorio de restaurantes, consultores y comercios sovereign.
              <br className="hidden md:block" />
              Sin costo para miembros • Beneficios exclusivos para patrocinadores
            </p>
            <a
              href="/crea-tu-tienda"
              className="inline-flex items-center gap-2 px-6 py-3 bg-bitcoin text-black font-vt323 text-lg tracking-wide rounded-lg hover:bg-bitcoin/90 hover:shadow-[0_0_25px_rgba(247,147,26,0.4)] transition-all active:scale-95"
            >
              Unirme al Directorio →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}