// ============================================================
// FAQ SECTION — Frequently Asked Questions
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "¿Qué es el Hackathon Bitcoin México?",
    answer:
      "Es una competencia de desarrollo donde programadores, diseñadores y entusiastas construyen aplicaciones y herramientas sobre Bitcoin y Lightning Network en un tiempo limitado (48 horas).",
  },
  {
    question: "¿Quién puede participar?",
    answer:
      "Cualquier persona mayor de 18 años con interés en Bitcoin y desarrollo de software. No se requiere experiencia previa en programación Bitcoin, aunque es una ventaja. Se aceptan equipos de 1 a 4 personas.",
  },
  {
    question: "¿Cuánto cuesta participar?",
    answer:
      "La inscripción es completamente gratuita. Solo necesitas tu tiempo, creatividad y ganas de aprender.",
  },
  {
    question: "¿Necesito saber programar?",
    answer:
      "No necesariamente. Buscamos equipos multidisciplinarios. Si puedes aportar diseño, documentación, estrategia de negocio o testing, eres bienvenido. Sin embargo, al menos un miembro del equipo debería poder escribir código funcional.",
  },
  {
    question: "¿Puedo participar de forma remota?",
    answer:
      "Sí, el hackathon tiene modalidad híbrida. Puedes participar presencialmente en nuestras instalaciones en Mérida o de forma remota.",
  },
  {
    question: "¿Qué tecnologías puedo usar?",
    answer:
      "Cualquier tecnología de código abierto. Recomendamos Next.js, TypeScript, Tailwind CSS y nuestros SDKs de Lightning Network. El proyecto debe ser open source.",
  },
  {
    question: "¿Los proyectos deben ser creados durante el hackathon?",
    answer:
      "Sí. El código debe ser escrito durante las 48 horas del evento. Se permite usar código pre-escrito por los participantes como base, pero la mayor parte del proyecto debe ser nueva.",
  },
  {
    question: "¿Cómo se evaluarán los proyectos?",
    answer:
      "Los proyectos serán evaluados por un panel de jueces expertos en Bitcoin, desarrollo de software y negocios. Los criterios incluyen: innovación, complejidad técnica, relevancia Bitcoin, presentación y completitud.",
  },
  {
    question: "¿Qué premios se ofrecen?",
    answer:
      "El primer lugar recibe 100,000 sats, el segundo 50,000 sats y el tercero 25,000 sats. Además, hay menciones especiales por categoría con 10,000 sats cada una.",
  },
  {
    question: "¿Puedo unirme después de que el hackathon haya comenzado?",
    answer:
      "No. El registro cierra 48 horas antes del inicio del hackathon para garantizar una planificación adecuada.",
  },
  {
    question: "¿Cómo obtengo ayuda durante el hackathon?",
    answer:
      "Contamos con un canal de Discord activo durante todo el evento, mentores disponibles para consultas, y sesiones de Q&A programadas.",
  },
  {
    question: "¿Quién organiza el hackathon?",
    answer:
      "El Hackathon Bitcoin México es organizado por Acepta Bitcoin México, una organización dedicada a la educación y adopción de Bitcoin en el país.",
  },
];

export default function FAQSection({ faqs }: { faqs?: { question: string; answer: string; }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = faqs || FAQ_ITEMS;

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <section className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-bold text-white mb-2">
          <span className="text-bitcoin">❯</span> Preguntas Frecuentes
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-bitcoin to-matrix mt-2" />
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="hackathon-card overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-serif text-base font-medium text-white pr-4">
                  {item.question}
                </span>
                <span
                  className={`flex-shrink-0 text-matrix transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown className="h-5 w-5" />
                </span>
              </button>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 pb-5 font-mono text-sm text-gray-400 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}