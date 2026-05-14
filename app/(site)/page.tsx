import Hero from "@/components/layout/Hero";
import PriceConverter from "@/components/sections/PriceConverter";
import TipJarSection from "@/components/sections/TipJarSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Store, LayoutGrid } from "lucide-react";
import ArcadeButton from "@/components/ui/arcade-button";
import dynamic from "next/dynamic";

// 🤖 B.O.B. imports
import BobSectionHeader from "@/components/widgets/bob-chat/BobSectionHeader";

// BobChatWidget: Client-only (sessionStorage + typing interval)
const BobChatWidget = dynamic(
  () => import('@/components/widgets/bob-chat/BobChatWidget'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-black/40 border border-white/10 rounded-2xl animate-pulse" />
    ),
  }
);

// MarketMoodWidget: Client-only con skeleton loading (ya optimizado)
const MarketMoodWidget = dynamic(
  () => import("@/components/widgets/MarketMoodWidget"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-black/60 border border-white/10 rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-white/5 rounded w-24 mb-4" />
        <div className="h-16 bg-white/5 rounded w-16 mx-auto mb-4" />
        <div className="h-6 bg-white/5 rounded w-32 mx-auto" />
      </div>
    ),
  }
);

// MatrixArcadeWhatsApp: Client-only + lazy (Canvas + AudioContext)
const MatrixArcadeWhatsApp = dynamic(
  () => import("@/components/ui/MatrixArcadeWhatsApp"),
  {
    ssr: false,
    loading: () => (
      <div
        className="fixed bottom-6 right-6 z-40 w-24 h-24 rounded-3xl bg-black/40 border border-white/10 animate-pulse"
        aria-label="Cargando contacto..."
        role="status"
      />
    ),
  }
);

import { getNextEdition } from "@/lib/hackathon/editions";

export default async function Home() {
  const nextEdition = await getNextEdition();

  return (
    <>
      <Navbar />
      
      <main className="flex flex-col bg-black text-[#FAFAFA]">
        
        {/* 1️⃣ HERO — Primera impresión */}
        <Hero nextEdition={nextEdition} />

        {/* 2️⃣ "APRENDE" — Header introductorio para B.O.B. */}
        <section id="aprende" className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 bg-black">
          <div className="max-w-4xl mx-auto">
            <BobSectionHeader
              title="Aprende"
              subtitle="Pregunta a B.O.B. — tu tutor cypherpunk"
              activeContext="fundamentos"
              className="scroll-mt-24"
            />
          </div>
        </section>

        {/* 3️⃣ B.O.B. Chat Widget — Núcleo educativo */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12 bg-black">
          <div className="max-w-4xl mx-auto">
            <BobChatWidget 
              mode="hero" 
              defaultContext="fundamentos" 
              lang="es" 
            />
          </div>
        </section>

        {/* 4️⃣ "AHORRA" — Market Mood Widget (DCA indicator) */}
        <section id="ahorra" className="py-12 bg-black border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <MarketMoodWidget />
            </div>
          </div>
        </section>

        {/* 5️⃣ Calculadora — Price Converter */}
        <section className="relative py-16 sm:py-24 bg-black">
          <div className="container px-4">
            <div className="grid lg:grid-cols-[1fr,1.2fr] gap-12 sm:gap-16 items-center">
              <div className="space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-matrix text-xs font-mono uppercase tracking-wider border border-matrix/20">
                  Market Data
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAFAFA]">
                  Bitcoin es el dinero <br />
                  <span className="text-bitcoin">de la libertad.</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-400 font-mono">
                  No importa si el precio sube o baja, la red sigue confirmando bloques cada 10 minutos. 
                  Usa nuestra calculadora para ver el valor actual en pesos mexicanos.
                </p>
              </div>
              <PriceConverter />
            </div>
          </div>
        </section>

        {/* 6️⃣ "ACEPTA" — Cards: Crea tu Tienda + Tianguis */}
        <section id="acepta" className="py-16 sm:py-24 bg-black relative overflow-hidden">
          {/* Fondo grid sutil */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50 pointer-events-none" />
          
          <div className="container relative z-10 px-4">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              
              {/* Card 1: Crea tu Tienda (Bitcoin Orange) */}
              <div className="group relative rounded-xl border border-bitcoin/20 bg-black/40 p-6 sm:p-8 overflow-hidden transition-all duration-300 hover:border-bitcoin/50 hover:shadow-[0_0_30px_rgba(247,147,26,0.15)] hover:-translate-y-0.5">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-bitcoin/5 blur-3xl transition-all group-hover:bg-bitcoin/10" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 mb-4 sm:mb-6 rounded-lg bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center text-bitcoin">
                    <Store className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-[#FAFAFA]">
                    Crea tu tienda en minutos
                  </h3>
                  <p className="font-mono text-sm text-gray-400 mb-6 sm:mb-8 leading-relaxed flex-grow">
                    Infraestructura soberana: BTCPay Server + Point of Sale listo para usar.
                  </p>
                  <Button asChild variant="outline" className="w-full sm:w-auto border-bitcoin/30 text-bitcoin font-bold hover:bg-bitcoin hover:text-black font-serif transition-all rounded-lg sm:rounded">
                    <Link href="/crea-tu-tienda">Solicitar Alta de Negocio</Link>
                  </Button>
                </div>
              </div>

              {/* Card 2: Tianguis Bitcoin (Matrix Green) */}
              <div className="group relative rounded-xl border border-matrix/20 bg-black/40 p-6 sm:p-8 overflow-hidden transition-all duration-300 hover:border-matrix/50 hover:shadow-[0_0_30px_rgba(0,255,65,0.15)] hover:-translate-y-0.5">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-matrix/5 blur-3xl transition-all group-hover:bg-matrix/10" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 mb-4 sm:mb-6 rounded-lg bg-matrix/10 border border-matrix/20 flex items-center justify-center text-matrix">
                    <LayoutGrid className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-[#FAFAFA]">
                    Tianguis Bitcoin Mérida
                  </h3>
                  <p className="font-mono text-sm text-gray-400 mb-6 sm:mb-8 leading-relaxed flex-grow">
                    El primer marketplace descentralizado impulsado por Nostr y Lightning. Compra y vende sin intermediarios.
                  </p>
                  <Button asChild variant="outline" className="w-full sm:w-auto border-matrix/30 text-matrix font-bold hover:bg-matrix hover:text-black font-serif transition-all rounded-lg sm:rounded">
                    <Link href="/tianguis">Explorar el Tianguis</Link>
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>

{/* 7️⃣ TipJar — Donaciones Lightning */}
        <TipJarSection />

        {/* 🟢 Botón flotante de contacto (siempre accesible) */}
        <MatrixArcadeWhatsApp
          phoneNumber="+521234567890"
          message="Hola, quiero aprender sobre Bitcoin 🟢"
          label="Soporte Matrix"
          size="lg"
          enableMatrixRain={true}
          enableSound={false}
          onlineStatus="online"
          className="fixed bottom-6 right-6 z-40"
        />

      </main>

      <Footer />
    </>
  );
}