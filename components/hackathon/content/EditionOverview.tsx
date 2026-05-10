// ============================================================
// EDITION OVERVIEW — Main overview component for a hackathon edition
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { Calendar, MapPin, Users, Clock, Award, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditionOverview({
  edition,
  className,
}: {
  edition: any;
  className?: string;
}) {
  const isCompleted = edition.status === "completed";
  const isCurrent =
    edition.status === "registration-open" || edition.status === "upcoming";

  return (
    <section className={cn("space-y-12", className)}>
      {/* Overview Header */}
      <div>
        <h2 className="font-serif text-3xl font-bold text-white mb-2">
          <span className="text-bitcoin">❯</span> Sobre esta Edición
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-bitcoin to-matrix mt-2" />
      </div>

      {/* Description */}
      <div className="space-y-4 text-lg leading-relaxed">
        <p className="text-gray-300 font-serif">
          {edition.subtitle}
        </p>
        {isCompleted && (
          <p className="text-gray-400 font-mono text-sm border-l-2 border-matrix/30 pl-4">
            Esta edición reunió a{" "}
            <span className="text-bitcoin font-bold">
              {edition.metrics.totalParticipants}
            </span>{" "}
            participantes que construyeron{" "}
            <span className="text-matrix font-bold">
              {edition.metrics.totalProjects}
            </span>{" "}
            proyectos en {edition.location.city}.
          </p>
        )}
        {isCurrent && (
          <p className="text-gray-400 font-mono text-sm border-l-2 border-bitcoin/30 pl-4">
            El hackathon se celebrará el{" "}
            <span className="text-bitcoin font-bold">
              {new Date(edition.date.start).toLocaleDateString("es-MX", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>{" "}
            en {edition.location.venue}.
          </p>
        )}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="hackathon-card p-4 text-center">
          <Award className="h-5 w-5 text-bitcoin mx-auto mb-2" />
          <div className="font-vt323 text-2xl font-bold text-white">
            {edition.metrics.totalProjects}
          </div>
          <div className="font-mono text-[10px] text-gray-500 uppercase">
            Proyectos
          </div>
        </div>
        <div className="hackathon-card p-4 text-center">
          <Users className="h-5 w-5 text-matrix mx-auto mb-2" />
          <div className="font-vt323 text-2xl font-bold text-white">
            {edition.metrics.totalParticipants}
          </div>
          <div className="font-mono text-[10px] text-gray-500 uppercase">
            Participantes
          </div>
        </div>
        <div className="hackathon-card p-4 text-center">
          <TrendingUp className="h-5 w-5 text-bitcoin mx-auto mb-2" />
          <div className="font-vt323 text-2xl font-bold text-white">
            {edition.metrics.totalParticipants}
          </div>
          <div className="font-mono text-[10px] text-gray-500 uppercase">
            Lightning TXs
          </div>
        </div>
        <div className="hackathon-card p-4 text-center">
          <MapPin className="h-5 w-5 text-matrix mx-auto mb-2" />
          <div className="font-vt323 text-2xl font-bold text-white">
            {edition.location.city}
          </div>
          <div className="font-mono text-[10px] text-gray-500 uppercase">
            {edition.location.state}
          </div>
        </div>
      </div>

      {/* Edition-Specific Content */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="hackathon-card p-6">
          <h3 className="font-serif text-xl font-bold text-white mb-4">
            📖 Visión
          </h3>
          <p className="font-mono text-sm text-gray-400 leading-relaxed">
            {isCompleted
              ? `El ${edition.name} reunió a los mejores desarrolladores Bitcoin de México para construir soluciones que impulsen la adopción y soberanía financiera.`
              : `El ${edition.name} busca reunir a la comunidad de desarrolladores Bitcoin más talentosa de México para construir soluciones innovadoras que aceleren la adopción de Bitcoin.`}
          </p>
        </div>
        <div className="hackathon-card p-6">
          <h3 className="font-serif text-xl font-bold text-white mb-4">
            🎯 Tema Central
          </h3>
          <p className="font-mono text-lg text-bitcoin font-bold mb-2">
            "{edition.theme}"
          </p>
          <p className="font-mono text-sm text-gray-400 leading-relaxed">
            {isCompleted
              ? "Los participantes exploraron esta temática para crear soluciones innovadoras con impacto real en la adopción de Bitcoin."
              : "Elige este tema como guía principal para tu proyecto, o adapta tu propuesta a cualquiera de los retos disponibles."}
          </p>
        </div>
      </div>
    </section>
  );
}