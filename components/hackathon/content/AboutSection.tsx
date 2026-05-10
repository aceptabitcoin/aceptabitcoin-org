// ============================================================
// ABOUT SECTION — Hackathon mission and history
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { Zap, Target, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-bold text-white mb-2">
          <span className="text-bitcoin">❯</span> Nuestra Historia
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-bitcoin to-matrix mt-2" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Mission */}
        <div className="hackathon-card p-6 text-center space-y-4">
          <Target className="h-8 w-8 text-bitcoin mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">Misión</h3>
          <p className="font-mono text-sm text-gray-400 leading-relaxed">
            Crear un espacio donde desarrolladores Bitcoin de todos los niveles
            puedan colaborar, aprender y construir soluciones reales para la
            adopción financiera en México.
          </p>
        </div>

        {/* Vision */}
        <div className="hackathon-card p-6 text-center space-y-4">
          <Zap className="h-8 w-8 text-matrix mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">Visión</h3>
          <p className="font-mono text-sm text-gray-400 leading-relaxed">
            Ser el evento de desarrollo Bitcoin más importante de LATAM,
            impulsando la soberanía financiera a través de código abierto.
          </p>
        </div>

        {/* Community */}
        <div className="hackathon-card p-6 text-center space-y-4">
          <Users className="h-8 w-8 text-purple-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">Comunidad</h3>
          <p className="font-mono text-sm text-gray-400 leading-relaxed">
            Más de 800 participantes, 52 proyectos y una comunidad activa
            que continúa construyendo después de cada edición.
          </p>
        </div>
      </div>

      {/* Stats timeline */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 hackathon-card p-6">
        <div className="text-center">
          <div className="font-vt323 text-3xl font-bold text-bitcoin">2</div>
          <div className="font-mono text-[10px] text-gray-500 uppercase mt-1">Ediciones</div>
        </div>
        <div className="text-center">
          <div className="font-vt323 text-3xl font-bold text-matrix">850+</div>
          <div className="font-mono text-[10px] text-gray-500 uppercase mt-1">Participantes</div>
        </div>
        <div className="text-center">
          <div className="font-vt323 text-3xl font-bold text-white">52+</div>
          <div className="font-mono text-[10px] text-gray-500 uppercase mt-1">Proyectos</div>
        </div>
        <div className="text-center">
          <div className="font-vt323 text-3xl font-bold text-bitcoin">35</div>
          <div className="font-mono text-[10px] text-gray-500 uppercase mt-1">Medios</div>
        </div>
      </div>
    </section>
  );
}