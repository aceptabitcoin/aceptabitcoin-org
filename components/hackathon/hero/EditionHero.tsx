// ============================================================
// HACKATHON EDITION HERO — Edition-specific hero
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

"use client";

import type { HackathonEdition } from "@/lib/hackathon/editions/types";
import CountdownTimer from "@/components/hackathon/display/CountdownTimer";
import MatrixHeroBackground from "./MatrixHeroBackground";
import EditionBadge from "./EditionBadge";
import ArcadeButton from "@/components/ui/ArcadeButton";

interface EditionHeroProps {
  edition: HackathonEdition;
}

export default function EditionHero({ edition }: EditionHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      
      {/* MatrixRain Background — con isMounted guard interno */}
      <MatrixHeroBackground enabled={edition.features?.matrixBackground} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        
        {/* Badge de edición */}
        <EditionBadge 
          text={edition.id === "2026-2" ? "2nda Edición" : `${edition.id}`}
          variant={edition.status === "live" ? "pulse" : "static"}
        />

        {/* Título principal */}
        <h1 className="font-serif text-4xl md:text-7xl font-bold text-white mt-6 mb-4 leading-tight">
          <span className="text-bitcoin drop-shadow-[0_0_25px_rgba(247,147,26,0.3)]">
            {edition.title}
          </span>
        </h1>

        {/* Tagline / Subtítulo */}
        <p className="font-mono text-lg md:text-xl text-cyan-400 mb-8 max-w-3xl mx-auto">
          {edition.tagline}
        </p>

        {/* Countdown — Solo si está upcoming o live */}
        {(edition.status === "upcoming" || edition.status === "live") && (
          <CountdownTimer 
            targetDate={edition.dates.start}
            timezone={edition.dates.timezone}
            labels={{ days: "DÍAS", hours: "HS", minutes: "MIN", seconds: "SEG" }}
            className="mb-10"
          />
        )}

        {/* CTAs duales */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          {edition.status === "upcoming" && (
            <ArcadeButton 
              href={`/hackathon/${edition.slug}/register`}
              variant="primary"
              size="lg"
            >
              🌽 INSCRÍBETE AHORA
            </ArcadeButton>
          )}
          
          <ArcadeButton 
            href={edition.repoBase.url}
            target="_blank"
            variant="outline"
            size="lg"
          >
            ⚙️ VER REPO BASE
          </ArcadeButton>
        </div>

        {/* Locations — Si es híbrida/presencial */}
        {edition.format !== "virtual" && edition.locations?.length ? (
          <div className="mt-16 font-mono text-sm text-gray-400">
            <span className="text-matrix">📍</span> Sedes:{" "}
            {edition.locations.map((loc, i, arr) => (
              <span key={loc.city}>
                {loc.city}{i < arr.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        ) : null}

      </div>
    </section>
  );
}