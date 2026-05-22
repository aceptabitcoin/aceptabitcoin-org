// components/hackathon/interactive/RegistrationButton.tsx
// ============================================================
// REGISTRATION CTA — Hackathon Registration Button (Luma Events)
// Acepta Bitcoin México | Oracle System v2.0
// Compliance: design-system.md, MANTENIMIENTO.md
// Registration Platform: https://luma.com/kzdw3pek
// ============================================================

"use client";

import { ArrowUpRight, ExternalLink, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegistrationButtonProps {
  /** URL de registro en Luma (fallback a env var si no se proporciona) */
  registrationUrl?: string;
  /** Texto del botón (default: "Registrarse Ahora") */
  label?: string;
  /** Variante de estilo: 'primary' (Bitcoin Orange), 'ghost' (Matrix Green) o 'compact' (inline) */
  variant?: "primary" | "ghost" | "compact";
  /** Clase adicional para personalización */
  className?: string;
  /** Si es true, abre en nueva pestaña (default: true) */
  openInNewTab?: boolean;
  /** Si es true, muestra insignia "OFICIAL" + ícono Zap (default: false) */
  showBadge?: boolean;
}

// ✅ URL ÚNICA DE REGISTRO — Luma Events
const DEFAULT_REGISTRATION_URL =
  process.env.NEXT_PUBLIC_HACKATHON_REGISTRATION_URL ||
  "https://luma.com/kzdw3pek";

export default function RegistrationButton({
  registrationUrl,
  label = "Registrarse Ahora",
  variant = "primary",
  className,
  openInNewTab = true,
  showBadge = false,
}: RegistrationButtonProps) {
  const href = registrationUrl || DEFAULT_REGISTRATION_URL;
  const isPrimary = variant === "primary";
  const isCompact = variant === "compact";

  return (
    <a
      href={href}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      aria-label={label}
      className={cn(
        // Base styles — Design System: Bitcoin Matrix v2.0
        "group inline-flex items-center justify-center gap-2 font-vt323 tracking-wide rounded-xl transition-all duration-300",
        
        // Primary variant (Bitcoin Orange) — DS: CTA principal
        isPrimary && [
          "bg-bitcoin text-black px-8 py-4 text-lg font-bold",
          "hover:bg-bitcoin/90",
          "shadow-[0_0_25px_rgba(247,147,26,0.4)]",
          "hover:shadow-[0_0_40px_rgba(247,147,26,0.6)]",
          "active:scale-95",
        ],
        
        // Ghost variant (Matrix Green) — DS: Acción secundaria/técnica
        !isPrimary && !isCompact && [
          "border border-matrix/30 text-matrix px-8 py-4 text-lg",
          "hover:border-matrix hover:bg-matrix/10",
          "shadow-[0_0_15px_rgba(0,255,65,0.1)]",
          "hover:shadow-[0_0_25px_rgba(0,255,65,0.25)]",
        ],
        
        // Compact variant (inline, subtle) — DS: Enlaces técnicos
        isCompact && [
          "text-matrix hover:text-bitcoin text-sm font-mono",
          "underline-offset-4 hover:underline",
          "px-0 py-1",
        ],
        
        // Custom overrides
        className
      )}
    >
      {/* Label + Badge */}
      <span className="relative z-10 flex items-center gap-2">
        {showBadge && (
          <Zap className="h-4 w-4 text-bitcoin animate-pulse flex-shrink-0" aria-hidden="true" />
        )}
        {label}
        {showBadge && (
          <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded border border-white/30">
            OFICIAL
          </span>
        )}
      </span>
      
      {/* Icon (hidden for compact variant) */}
      {!isCompact && openInNewTab ? (
        <ExternalLink 
          className="h-5 w-5 opacity-90 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" 
          aria-hidden="true"
        />
      ) : !isCompact && !openInNewTab ? (
        <ArrowUpRight 
          className="h-5 w-5 opacity-90 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          aria-hidden="true"
        />
      ) : null}
      
      {/* Subtle glow overlay on hover (skip for compact) — DS: Efectos visuales */}
      {!isCompact && (
        <span
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
            isPrimary 
              ? "bg-gradient-to-br from-bitcoin/20 to-transparent" 
              : "bg-gradient-to-br from-matrix/20 to-transparent"
          )}
        />
      )}
    </a>
  );
}