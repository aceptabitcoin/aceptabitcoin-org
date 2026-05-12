import type { Metadata } from "next";
import { type Proveedor } from "@/lib/proveedores";
import ProveedoresClient from "./ProveedoresClient";
import proveedoresRaw from '@/data/proveedores.json';

// 📌 REBRAND NOTE (2026-05-12):
// - UI visible: "Comercio Libre" (nuevo nombre para usuarios)
// - Estructura interna: se mantiene "proveedores" en rutas, imports y archivos
// - Nuevas categorías visibles: "Restaurantes", "Consultoría"

// Ordenamiento estricto: Patrocinador > Partner > Miembro > Alfabético
const proveedoresList = [...proveedoresRaw as Proveedor[]].sort((a, b) => {
  const tierOrder: Record<string, number> = { patrocinador: 0, partner: 1, miembro: 2 };
  const diff = (tierOrder[a.tier] ?? 99) - (tierOrder[b.tier] ?? 99);
  if (diff !== 0) return diff;
  return a.nombre.localeCompare(b.nombre);
});

export const metadata: Metadata = {
  // 🔄 Título actualizado para el rebrand visible
  title: 'Comercio Libre | Directorio Bitcoin México — Acepta Bitcoin',
  // 🔄 Descripción ampliada con las nuevas categorías
  description: 'Encuentra restaurantes, consultores, exchanges y comercios que operan con Bitcoin en México. Directorio sovereign sin intermediarios: Restaurantes, Consultoría, Tecnología y más.',
  openGraph: {
    // 🔄 OG Title alineado con el rebrand
    title: 'Comercio Libre — Directorio Sovereign Bitcoin México',
    // 🔄 OG Description con enfoque en nuevas categorías
    description: 'Descubre comercios, restaurantes y asesores que aceptan Bitcoin. Exchanges, logística, educación y consultoría especializada. Sin permiso, sin censura.',
    images: [{ url: '/og/proveedores.svg', width: 1200, height: 630 }],
    type: 'website',
    url: '/proveedores',
  },
  twitter: {
    card: 'summary_large_image',
    // 🔄 Twitter title actualizado
    title: 'Comercio Libre | Bitcoin México',
    // 🔄 Twitter description con nuevas categorías
    description: 'Restaurantes, consultores y comercios que operan con Bitcoin. Directorio sovereign de adopción en México.',
    images: ['/og/proveedores.svg'],
  },
};

export default function ProveedoresPage() {
  return <ProveedoresClient proveedores={proveedoresList} />;
}