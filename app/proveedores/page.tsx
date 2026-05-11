import type { Metadata } from "next";
import { type Proveedor } from "@/lib/proveedores";
import ProveedoresClient from "./ProveedoresClient";
import proveedoresRaw from '@/data/proveedores.json';

// Ordenamiento estricto: Patrocinador > Partner > Miembro > Alfabético
const proveedoresList = [...proveedoresRaw as Proveedor[]].sort((a, b) => {
  const tierOrder: Record<string, number> = { patrocinador: 0, partner: 1, miembro: 2 };
  const diff = (tierOrder[a.tier] ?? 99) - (tierOrder[b.tier] ?? 99);
  if (diff !== 0) return diff;
  return a.nombre.localeCompare(b.nombre);
});

export const metadata: Metadata = {
  title: 'Directorio de Proveedores Bitcoin — Acepta Bitcoin México',
  description: 'Negocios y servicios en México comprometidos con la adopción de Bitcoin. Exchanges, logística, educación, comercio, servicios y tecnología. Busca por categoría y contacto directo.',
  openGraph: {
    title: 'Directorio Sovereign de Proveedores Bitcoin',
    description: 'Encuentra exchanges, comercios, servicios educativos y tecnología Bitcoin en México. Directorio sovereign sin intermediarios.',
    images: [{ url: '/og/proveedores.svg', width: 1200, height: 630 }],
    type: 'website',
    url: '/proveedores',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Directorio Bitcoin México',
    description: 'Negocios que aceptan Bitcoin y servicios sovereign. Sin permiso, sin censura.',
    images: ['/og/proveedores.svg'],
  },
};

export default function ProveedoresPage() {
  return <ProveedoresClient proveedores={proveedoresList} />;
}