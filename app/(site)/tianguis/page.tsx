// app/tianguis/page.tsx
// 🚧 MODULE PAUSED (2026-05-21)
// El módulo Tianguis está en pausa temporal. 
// Para reactivar: restaurar contenido desde git o descomentar el return original.

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UnderConstruction from "@/components/ui/UnderConstruction";

export default function TianguisPage() {
  return (
    <>
      <Navbar />
      
      <UnderConstruction
        title="TIANGUIS EN CONSTRUCCIÓN"
        description="El marketplace P2P con Nostr + Lightning está en fase de auditoría de infraestructura. 
                     Estamos optimizando el relay strfry y la integración NWC para garantizar soberanía y resistencia a la censura."
        eta="Q4 2026"
        statusColor="matrix"
        backHref="/"
        backLabel="VOLVER AL ORACLE"
      />
      
      <Footer />
    </>
  );
}

// Metadata mínima para SEO (siguiendo map.md)
export const metadata = {
  title: "Tianguis Bitcoin | Acepta Bitcoin",
  description: "Marketplace P2P para Mérida. Sin intermediarios, sin censura. Módulo en desarrollo.",
};