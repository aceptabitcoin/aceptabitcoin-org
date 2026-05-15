// ============================================================
// HACKATHON FOOTER — Dedicated footer for hackathon section
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { Terminal, ExternalLink, MessageCircle } from "lucide-react";

export default function HackathonFooter({ className }: { className?: string }) {
  return (
    <footer
      className={`hackathon-footer border-t border-white/5 bg-black/90 ${className || ""}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-bitcoin flex items-center justify-center">
                <span className="text-black font-serif font-bold text-sm">₿</span>
              </div>
              <span className="font-serif font-bold text-white tracking-tight">
                Hackathon Bitcoin MX
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Construyendo el futuro de Bitcoin en México, un hackathon a la vez.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-bitcoin transition-colors"
                aria-label="GitHub"
              >
                <Terminal className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-matrix transition-colors"
                aria-label="Discord"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-bitcoin transition-colors"
                aria-label="Website"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links — Quick Access */}
          <div>
            <h4 className="font-serif font-bold text-white mb-3">Hackathon</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-matrix transition-colors">
                  Bases del Concurso
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-matrix transition-colors">
                  Premios
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-matrix transition-colors">
                  Temas y Retos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-matrix transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Links — Resources */}
          <div>
            <h4 className="font-serif font-bold text-white mb-3">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-matrix transition-colors">
                  Documentación
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-matrix transition-colors">
                  APIs y SDKs
                </a>
              </li>
              <li>
                <a href="/app/api/tipjar" className="text-gray-400 hover:text-matrix transition-colors">
                  TipJar API
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-matrix transition-colors">
                  Plantillas
                </a>
              </li>
            </ul>
          </div>

          {/* Links — Community */}
          <div>
            <h4 className="font-serif font-bold text-white mb-3">Comunidad</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/proyectos" className="text-gray-400 hover:text-matrix transition-colors">
                  Proyectos Anteriores
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-matrix transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="/nuestra-historia" className="text-gray-400 hover:text-matrix transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="mailto:hackathon@aceptabitcoin.org" className="text-gray-400 hover:text-matrix transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-gray-600">
            © {new Date().getFullYear()} Acepta Bitcoin México. Todos los proyectos son open source bajo licencia MIT.
          </p>
          <div className="flex gap-4 text-xs text-gray-600 font-mono">
            <a href="/hackathon/docs/Code_of_Conduct.md" className="hover:text-matrix transition-colors">
              Código de Conducta
            </a>
            <a href="/hackathon/docs/index.md" className="hover:text-matrix transition-colors">
              Documentación
            </a>
            <a href="/api/tipjar" className="hover:text-matrix transition-colors">
              TipJar
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}