// ============================================================
// PROVEEDORES — Types, Utilities & Data Loader
// Acepta Bitcoin México | Oracle System v2.0
// 
// 📌 REBRAND NOTE (2026-05-12):
// - Internamente se mantiene "proveedores" por estabilidad de rutas e imports.
// - La capa UI muestra "Comercio Libre" según requerimiento del cliente.
// - Nuevas categorías añadidas: "Restaurantes", "Consultoría"
// ============================================================

export type Categoria = 
  | "exchange"
  | "logistica"
  | "educacion"
  | "comercio"
  | "servicios"
  | "tecnologia"
  | "restaurantes" // ✅ Normalizado a minúsculas
  | "consultoria"; // ✅ Normalizado a minúsculas y sin tilde

export type Tier = "patrocinador" | "partner" | "miembro";

export interface Proveedor {
  id: string;
  nombre: string;
  categoria: Categoria;
  tier: Tier;
  descripcion: string;
  url: string;
  urlReferido?: string;
  logo: string;
  ubicacion: string;
  tags: string[];
  destacado: boolean;
}

export const CATEGORIAS: { value: Categoria; label: string; icon: string }[] = [
  { value: "exchange", label: "Exchanges", icon: "ArrowLeftRight" },
  { value: "logistica", label: "Logística", icon: "Truck" },
  { value: "educacion", label: "Educación", icon: "GraduationCap" },
  { value: "comercio", label: "Comercio", icon: "Store" },
  { value: "servicios", label: "Servicios", icon: "Briefcase" },
  { value: "tecnologia", label: "Tecnología", icon: "Cpu" },
  //  Nuevas categorías para "Comercio Libre" (Values normalizados)
  { value: "restaurantes", label: "Restaurantes", icon: "Utensils" },
  { value: "consultoria", label: "Consultoría", icon: "UserCog" },
];

// ... resto del código (TIER_CONFIG, filterByCategory, getStats) se mantiene igual ...