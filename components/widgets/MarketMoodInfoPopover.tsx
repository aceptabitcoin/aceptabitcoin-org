"use client";

import { useState, useEffect, useRef } from "react";
import { X, HelpCircle, Terminal, AlertTriangle } from "lucide-react";

export default function MarketMoodInfoPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Cargar preferencia
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ab-mx:mood-info-seen");
      if (stored === "true") setHasSeen(true);
    } catch {}
  }, []);

  // ESC + Focus
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleEsc);
    dialogRef.current?.focus();

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const handleClose = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem("ab-mx:mood-info-seen", "true");
      } catch {}
      setHasSeen(true);
    }
    setIsOpen(false);
  };

  if (hasSeen) return null;

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-matrix hover:text-bitcoin transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-matrix/50 rounded-lg"
        aria-label="Información del Oracle"
        title="¿Cómo leer el Market Mood?"
      >
        <HelpCircle size={18} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={handleClose}
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-title"
            className="relative w-full max-w-md bg-black/95 backdrop-blur-xl border border-matrix/40 rounded-xl shadow-[0_0_60px_rgba(0,255,65,0.2)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Scanline */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-matrix to-transparent animate-scanline" />

            {/* Corner Accents */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-matrix/40" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-matrix/40" />

            {/* Header */}
            <div className="p-5 border-b border-matrix/20 flex items-center justify-between bg-black/60">
              <div className="flex items-center gap-3">
                <Terminal className="text-matrix" size={20} />
                <span id="info-title" className="font-vt323 text-2xl text-matrix tracking-wider">
                  ORACLE.GUIDE
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-bitcoin transition-colors"
                aria-label="Cerrar"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 font-mono text-sm text-gray-300 leading-relaxed max-h-[65vh] overflow-y-auto custom-scrollbar">
              
              <div className="space-y-3">
                <h3 className="font-vt323 text-xl text-bitcoin flex items-center gap-2">
                  &gt; FILOSOFÍA
                </h3>
                <p className="text-gray-400">
                  Comprar Bitcoin no es gambling. Es disciplina contra la euforia institucional. 
                  Este indicador te ayuda a no ser <span className="text-bitcoin font-bold">liquidity exit</span>.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-vt323 text-xl text-bitcoin flex items-center gap-2">
                  &gt; CÓMO LEER EL HEATMAP
                </h3>
                <div className="space-y-4 text-xs">
                  <div className="flex gap-4">
                    <div className="text-matrix font-bold text-base">🟢 ≤ 25</div>
                    <div>
                      <strong className="text-matrix">DIP BENDICIÓN</strong><br />
                      Zona histórica de acumulación fuerte
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="text-[#ff2a6d] font-bold text-base">🔴 ≥ 80</div>
                    <div>
                      <strong className="text-[#ff2a6d]">ZONA DE CODICIA</strong><br />
                      Riesgo alto de corrección. Evita FOMO
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="text-bitcoin font-bold text-base">🟠 26-79</div>
                    <div>
                      <strong className="text-bitcoin">RANGO NEUTRAL</strong><br />
                      Mercado lateral. Paciencia y observación
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-l-2 border-matrix/30 pl-4">
                <h3 className="font-vt323 text-lg text-matrix flex items-center gap-2">
                  <AlertTriangle size={16} /> PRO TIP
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Combina <span className="text-matrix">28 estocásticos</span> profesionales.<br />
                  Usa 1H y 4H para entradas tácticas.<br />
                  1D y 1W para visión estratégica.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-matrix/20 bg-black/60 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-gray-500 hover:text-matrix cursor-pointer transition-colors select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="accent-matrix w-4 h-4 bg-transparent border border-matrix/50 rounded-sm"
                />
                No mostrar de nuevo
              </label>

              <button
                onClick={handleClose}
                className="px-6 py-2.5 border border-bitcoin text-bitcoin font-mono text-xs font-bold hover:bg-bitcoin hover:text-black transition-all rounded-sm flex items-center gap-2"
              >
                ENTENDIDO <span className="text-lg leading-none">❯</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}