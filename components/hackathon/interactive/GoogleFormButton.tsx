"use client";

import { ArrowUpRight, Terminal, ShieldCheck } from "lucide-react";
import { useState } from "react";

// Declaración global para Plausible Analytics (opcional)
declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props: Record<string, any> }) => void;
  }
}

interface GoogleFormButtonProps {
  formUrl: string;
  label?: string;
  variant?: "primary" | "secondary" | "compact";
  showBadge?: boolean;
}

export default function GoogleFormButton({
  formUrl,
  label = "INSCRÍBETE AHORA",
  variant = "primary",
  showBadge = true,
}: GoogleFormButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // Analytics hook (opcional)
    if (typeof window !== "undefined" && window.plausible) {
      window.plausible("Hackathon Registration Click", {
        props: { edition: "custody-ui-2026", source: "google-forms" },
      });
    }
    // Abrir en nueva pestaña con foco
    window.open(formUrl, "_blank", "noopener,noreferrer");
  };

  // Variantes de estilo
  const variants = {
    primary: `
      relative group overflow-hidden
      bg-black border-2 border-matrix 
      hover:border-[#00FF41] hover:shadow-[0_0_30px_rgba(0,255,65,0.4)]
      text-matrix font-vt323 text-2xl tracking-widest
      px-8 py-4 rounded-lg
      transition-all duration-300 ease-out
    `,
    secondary: `
      relative group
      bg-transparent border border-cyan-400/40
      hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]
      text-cyan-400 font-mono text-sm uppercase tracking-wide
      px-6 py-3 rounded
      transition-all duration-200
    `,
    compact: `
      inline-flex items-center gap-2
      text-matrix font-mono text-xs
      hover:text-[#00FF41] hover:underline
      transition-colors
    `,
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${variants[variant]} focus:outline-none focus:ring-2 focus:ring-matrix/50`}
      aria-label={label}
    >
      {/* Scanline animation overlay (solo primary) */}
      {variant === "primary" && (
        <div
          className={`absolute inset-0 bg-gradient-to-b 
            from-transparent via-matrix/10 to-transparent 
            translate-y-[-100%] group-hover:translate-y-[100%] 
            transition-transform duration-700 ease-in-out pointer-events-none`}
        />
      )}

      {/* Contenido del botón */}
      <span className="relative z-10 flex items-center gap-3">
        {variant === "primary" && (
          <Terminal
            className={`w-5 h-5 ${isHovered ? "animate-blink" : ""}`}
          />
        )}

        <span>{label}</span>

        <ArrowUpRight
          className={`w-4 h-4 transition-transform duration-200 
            ${isHovered ? "translate-x-1 -translate-y-1" : ""}`}
        />
      </span>

      {/* Badge de seguridad (opcional) */}
      {showBadge && variant !== "compact" && (
        <span className="absolute -top-2 -right-2 flex items-center gap-1 
          bg-black border border-matrix/30 px-2 py-0.5 rounded text-[10px] 
          font-mono text-gray-400">
          <ShieldCheck className="w-3 h-3 text-matrix" />
          Google Forms
        </span>
      )}

      {/* Cursor parpadeante al final (solo primary) */}
      {variant === "primary" && isHovered && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 
          w-2 h-6 bg-matrix animate-blink opacity-70" />
      )}
    </button>
  );
}
