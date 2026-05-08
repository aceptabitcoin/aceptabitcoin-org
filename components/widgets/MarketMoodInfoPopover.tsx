"use client";

import { useState, useEffect, useRef } from "react";
import { X, HelpCircle, Terminal, AlertTriangle, Bitcoin, PiggyBank, TrendingUp, TrendingDown } from "lucide-react";

export default function MarketMoodInfoPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Cargar preferencia desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ab-mx:dca-info-seen");
      if (stored === "true") setHasSeen(true);
    } catch {}
  }, []);

  // Manejo de teclado + focus para accesibilidad
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
        localStorage.setItem("ab-mx:dca-info-seen", "true");
      } catch {}
      setHasSeen(true);
    }
    setIsOpen(false);
  };

  // Si ya lo vio y eligió "no mostrar de nuevo", no renderizar el trigger
  if (hasSeen) return null;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-matrix hover:text-bitcoin transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-matrix/50 rounded-lg"
        aria-label="¿Qué es DCA y cómo usar este indicador?"
        title="Guía educativa DCA"
      >
        <HelpCircle size={18} />
      </button>

      {/* Modal Overlay */}
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
            aria-labelledby="dca-guide-title"
            className="relative w-full max-w-2xl bg-black/95 backdrop-blur-xl border border-matrix/40 rounded-xl shadow-[0_0_60px_rgba(0,255,65,0.2)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Scanline Animation */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-matrix to-transparent animate-scanline" />

            {/* Corner Accents - Matrix Style */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-matrix/40" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-matrix/40" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-matrix/40" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-matrix/40" />

            {/* Header */}
            <div className="p-5 border-b border-matrix/20 flex items-center justify-between bg-black/60">
              <div className="flex items-center gap-3">
                <Terminal className="text-matrix" size={20} />
                <span id="dca-guide-title" className="font-vt323 text-2xl text-matrix tracking-wider">
                  GUÍA DCA • ORACLE.EDU
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-bitcoin transition-colors"
                aria-label="Cerrar guía"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="p-6 space-y-6 font-mono text-sm text-gray-300 leading-relaxed max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* SECCIÓN 1: ¿QUÉ ES DCA? */}
              <div className="space-y-3">
                <h3 className="font-vt323 text-xl text-bitcoin flex items-center gap-2">
                  <PiggyBank className="text-bitcoin" size={18} />
                  &gt; ¿QUÉ ES DCA?
                </h3>
                <p className="text-gray-400">
                  <strong className="text-white">DCA</strong> (Dollar Cost Averaging) es acumular Bitcoin en cantidades fijas, 
                  sin importar el precio. Así evitas el estrés de "adivinar" el momento perfecto.
                </p>
                <div className="bg-white/5 border border-matrix/20 rounded-lg p-4 space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Ejemplo práctico:</p>
                  <ul className="text-xs space-y-1 text-gray-300">
                    <li>• Compras $100 USD de BTC cada lunes</li>
                    <li>• Si el precio baja → recibes <span className="text-matrix">más sats</span></li>
                    <li>• Si el precio sube → recibes <span className="text-bitcoin">menos sats</span></li>
                    <li>• A largo plazo → tu precio promedio se equilibra</li>
                  </ul>
                </div>
              </div>

              {/* SECCIÓN 2: CÓMO USAR ESTE INDICADOR */}
              <div className="space-y-3">
                <h3 className="font-vt323 text-xl text-bitcoin flex items-center gap-2">
                  <Bitcoin className="text-bitcoin" size={18} />
                  &gt; CÓMO LEER TU CALIDAD DCA
                </h3>
                <p className="text-gray-400">
                  Este indicador no te dice <em>cuándo</em> comprar. Te ayuda a entender <em>la calidad</em> de tu entrada 
                  dentro de tu estrategia DCA.
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  {/* Verde - Favorable */}
                  <div className="flex gap-3 p-3 bg-matrix/5 border border-matrix/20 rounded-lg">
                    <div className="text-2xl shrink-0" role="img" aria-label="Favorable">😊</div>
                    <div>
                      <strong className="text-matrix block">FAVORABLE PARA DCA</strong>
                      <span className="text-xs text-gray-400">Valor ≤ 25</span>
                      <p className="text-xs mt-1">
                        Bitcoin está en zona de acumulación. Tu compra rinde <span className="text-matrix font-bold">más sats</span>. 
                        Es un buen momento para tu compra programada.
                      </p>
                    </div>
                  </div>

                  {/* Naranja - Neutral */}
                  <div className="flex gap-3 p-3 bg-bitcoin/5 border border-bitcoin/20 rounded-lg">
                    <div className="text-2xl shrink-0" role="img" aria-label="Neutral">😐</div>
                    <div>
                      <strong className="text-bitcoin block">NEUTRAL</strong>
                      <span className="text-xs text-gray-400">Valor 26-79</span>
                      <p className="text-xs mt-1">
                        Mercado en rango. Tu compra rinde sats normales. 
                        <span className="text-white font-bold"> Sigue tu plan sin estrés.</span>
                      </p>
                    </div>
                  </div>

                  {/* Rojo - Menos favorable */}
                  <div className="flex gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="text-2xl shrink-0" role="img" aria-label="Menos favorable">😔</div>
                    <div>
                      <strong className="text-red-400 block">MENOS FAVORABLE</strong>
                      <span className="text-xs text-gray-400">Valor ≥ 80</span>
                      <p className="text-xs mt-1">
                        Bitcoin está en zona alta. Tu compra rinde <span className="text-red-400 font-bold">menos sats</span>. 
                        Pero recuerda: <span className="text-white">lo importante es no dejar de acumular</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: ¿POR QUÉ SOLO 4H? */}
              <div className="space-y-3 border-l-2 border-matrix/30 pl-4">
                <h3 className="font-vt323 text-lg text-matrix flex items-center gap-2">
                  <AlertTriangle size={16} /> ¿POR QUÉ SOLO 4 HORAS?
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Usamos el timeframe de <strong className="text-matrix">4 horas</strong> porque:
                </p>
                <ul className="text-xs space-y-1 text-gray-300">
                  <li>• Filtra el "ruido" de movimientos muy cortos (1H)</li>
                  <li>• Da una señal más estable para aprender</li>
                  <li>• Evita confusión entre múltiples timeframes</li>
                  <li>• Es ideal para estudiantes en etapa temprana de adopción</li>
                </ul>
                <p className="text-[10px] text-gray-500 italic mt-2">
                  Cuando domines DCA, podrás explorar timeframes adicionales como nivel avanzado.
                </p>
              </div>

              {/* SECCIÓN 4: RECORDATORIO CLAVE */}
              <div className="bg-black/40 border border-bitcoin/30 rounded-lg p-4 space-y-2">
                <h4 className="font-vt323 text-base text-bitcoin flex items-center gap-2">
                  <TrendingUp size={14} /> RECORDATORIO CLAVE
                </h4>
                <p className="text-xs text-gray-300">
                  <span className="text-bitcoin font-bold">El DCA funciona a largo plazo.</span> 
                  Este indicador es una herramienta educativa para entender la calidad de tu entrada, 
                  <span className="text-white"> no una señal para cambiar tu estrategia</span>. 
                  Lo más importante es la disciplina de acumular constantemente.
                </p>
              </div>

              {/* SECCIÓN 5: DISCLAIMER */}
              <div className="text-[10px] text-gray-600 border-t border-white/10 pt-3">
                <p className="flex items-start gap-2">
                  <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                  <span>
                    Esta herramienta es <strong className="text-gray-400">exclusivamente educativa</strong>. 
                    No constituye consejo financiero, recomendación de inversión ni oferta de valores. 
                    Bitcoin es un activo volátil: investiga siempre antes de tomar decisiones financieras.
                  </span>
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
                No mostrar de nuevo en esta sesión
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