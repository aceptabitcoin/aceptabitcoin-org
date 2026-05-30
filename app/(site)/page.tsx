import Hero from "@/components/layout/Hero";
import PriceConverter from "@/components/sections/PriceConverter";
import TipJarSection from "@/components/sections/TipJarSection";
import MarketMoodWidget from "@/components/widgets/MarketMoodWidget";
import { PartnersCarousel } from "@/components/ui/PartnersCarousel";
import ArcadeButton from "@/components/ui/ArcadeButton";
import Link from "next/link";
import { getNextEdition } from "@/lib/hackathon/editions";

// 🆕 RESTAURADOS: Imports para Bob y los Headers de Sección
import BobChatWidget from "@/components/widgets/bob-chat/BobChatWidget";
import AhorraSectionHeader from "@/components/widgets/AhorraSectionHeader";
import AceptaBitcoinSectionHeader from "@/components/widgets/AceptaBitcoinSectionHeader";

export default async function HomePage() {
  const nextEdition = await getNextEdition();

  return (
    <main className="flex flex-col min-h-screen bg-black text-white">
      
      {/* 1. HERO SECTION */}
      <Hero nextEdition={nextEdition} />

      {/* 2. ORACLE / MARKET DATA SECTION */}
      <section className="w-full py-12 sm:py-16 lg:py-20 relative overflow-hidden border-b border-white/5">
        {/* Background Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">
          
          {/* Header de la Sección Oracle */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Oracle System <span className="text-matrix">v2.0</span>
            </h2>
            <p className="font-mono text-sm text-gray-400 max-w-2xl mx-auto">
              Datos en tiempo real para la toma de decisiones soberanas. 
              Analiza el mercado, mejora tu costo promedio y ejecuta.
            </p>
          </div>

          {/* WIDGETS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Columna Izquierda: Market Mood (DCA Indicator) */}
            <div className="w-full">
              <MarketMoodWidget />
            </div>

            {/* Columna Derecha: Price Converter (Existente) */}
            <div className="w-full">
              <PriceConverter />
            </div>
          </div>

          {/* 🆕 NUEVO: Carrusel de Partners (Aliados Soberanos) */}
          <div className="pt-8 border-t border-white/10 mt-8">
             <PartnersCarousel />
          </div>

        </div>
      </section>

      {/* 3. SECCIÓN AHORRA / DCA (Con Header Restaurado) */}
      <section className="w-full py-12 sm:py-16 bg-slate-950/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
{/* 🆕 HEADER RESTAURADO: Título animado de la sección Ahorra */}
           <AhorraSectionHeader title="Ahorra" marketTrend="bullish" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Card: Tianguis */}
            <Link href="/tianguis" className="group block p-8 rounded-2xl bg-black/40 border border-white/10 hover:border-bitcoin/50 transition-all duration-300">
              <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-bitcoin transition-colors">
                Tianguis Bitcoin
              </h3>
              <p className="font-mono text-sm text-gray-400 mb-6">
                El mercado P2P de México. Compra y vende sin intermediarios usando Lightning Network.
              </p>
              <ArcadeButton variant="outline">
                Entrar al Mercado →
              </ArcadeButton>
            </Link>

            {/* Card: Aprende */}
            <Link href="/arcade" className="group block p-8 rounded-2xl bg-black/40 border border-white/10 hover:border-matrix/50 transition-all duration-300">
              <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-matrix transition-colors">
                Arcade Educativo
              </h3>
              <p className="font-mono text-sm text-gray-400 mb-6">
                Laboratorios interactivos. Domina la custodia, nodos y la tecnología detrás del dinero duro.
              </p>
              <ArcadeButton variant="matrix">
                Iniciar Entrenamiento →
              </ArcadeButton>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN ACEPTA BITCOIN (Con Header Restaurado) */}
      <section className="w-full py-12 sm:py-16 relative overflow-hidden border-b border-white/5">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* 🆕 HEADER RESTAURADO: Título animado de la sección Acepta */}
            <AceptaBitcoinSectionHeader />
            
            {/* Nota: Si había contenido específico aquí (como un formulario o mapa), iría aquí. 
                Por ahora dejamos el header para mantener la estructura visual. */}
         </div>
      </section>

{/* 5. BOB THE BITCOIN AGENT (🤖 RESTAURADO) */}
       <section className="w-full py-12 bg-black border-t border-white/5">
         <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <BobChatWidget mode="hero" />
         </div>
       </section>

      {/* 6. TIP JAR SECTION */}
      <TipJarSection />

    </main>
  );
}