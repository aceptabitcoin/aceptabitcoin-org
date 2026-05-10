import { Terminal, BookOpen, Key, Shield } from "lucide-react";
import type { TechnicalConcept } from "@/lib/hackathon/editions/types";

interface TechnicalConceptsSectionProps {
  concepts: TechnicalConcept[];
}

export default function TechnicalConceptsSection({ concepts }: TechnicalConceptsSectionProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case "xpub": return <Key className="w-5 h-5 text-bitcoin" />;
      case "descriptors": return <BookOpen className="w-5 h-5 text-cyan-400" />;
      case "miniscript": return <Shield className="w-5 h-5 text-matrix" />;
      default: return <Terminal className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <section className="py-12 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-matrix/10 rounded-lg border border-matrix/30">
          <BookOpen className="w-6 h-6 text-matrix" />
        </div>
        <h2 className="font-serif text-3xl text-white">
          Conceptos Clave <span className="text-matrix text-lg font-mono">// Requisitos</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concepts.map((concept) => (
          <div 
            key={concept.id} 
            className="group relative bg-black border border-white/10 rounded-xl p-6 hover:border-matrix/50 transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.1)]"
          >
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
              {getIcon(concept.id)}
            </div>
            
            <h3 className="font-vt323 text-2xl text-bitcoin mb-3">{concept.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-mono">{concept.description}</p>
            
            {concept.codeExample && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <code className="text-xs text-matrix bg-black/50 px-2 py-1 rounded border border-matrix/20">
                  {concept.codeExample}
                </code>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
