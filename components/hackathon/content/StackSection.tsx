import { Terminal, Code2, Box, Layers, ExternalLink } from "lucide-react";

interface StackSectionProps {
  stack: string[]; // Viene directamente de edition.stack
}

export default function StackSection({ stack }: StackSectionProps) {
  return (
    <section className="py-12 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
          <Layers className="w-6 h-6 text-cyan-400" />
        </div>
        <h2 className="font-serif text-3xl text-white">
          Stack Sugerido <span className="text-cyan-400 text-lg font-mono">// Dependencies</span>
        </h2>
      </div>

      {/* Grid de tecnologías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stack.map((tech, idx) => (
          <div 
            key={idx} 
            className="group relative bg-black border border-white/10 rounded-lg p-4 
                       hover:border-cyan-400/50 transition-all duration-300 
                       hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-default"
          >
            {/* Icono de terminal + label */}
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-matrix opacity-70" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                suggested
              </span>
            </div>

            {/* Texto técnico con efecto hover */}
            <p className="font-mono text-sm text-gray-300 group-hover:text-cyan-400 transition-colors leading-relaxed break-words">
              {tech}
            </p>

            {/* Efecto scanline sutil al hover */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b 
                            from-transparent via-cyan-400/5 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Nota al pie (opcional, estilo terminal) */}
      <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs font-mono border-t border-white/5 pt-4">
        <Code2 className="w-4 h-4" />
        <span>
          No obligatorio. Puedes usar cualquier librería que genere descriptores BIP380 válidos.
        </span>
      </div>
    </section>
  );
}
