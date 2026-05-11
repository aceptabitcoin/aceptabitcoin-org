// components/hackathon/interactive/GoogleFormButton.tsx
// ============================================================
// GOOGLE FORM CTA — Hackathon Registration Button
// Acepta Bitcoin México | Oracle System v2.0
// Compliance: design-system.md, MANTENIMIENTO.md
// ============================================================

"use client";

import { ArrowUpRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoogleFormButtonProps {
  /** URL del Google Form (fallback a env var si no se proporciona) */
  formUrl?: string;
  /** Texto del botón (default: "Registrarse Ahora") */
  label?: string;
  /** Variante de estilo: 'primary' (Bitcoin Orange), 'ghost' (Matrix Green) o 'compact' (inline) */
  variant?: "primary" | "ghost" | "compact";
  /** Clase adicional para personalización */
  className?: string;
  /** Si es true, abre en nueva pestaña (default: true) */
  openInNewTab?: boolean;
  /** Si es true, muestra una insignia/icono de registro oficial (default: false) */
  showBadge?: boolean;
}

export default function GoogleFormButton({
  formUrl,
  label = "Registrarse Ahora",
  variant = "primary",
  className,
  openInNewTab = true,
  showBadge = false,
}: GoogleFormButtonProps) {
  // URL por defecto desde env var o fallback hardcodeado
  const DEFAULT_FORM_URL =
    process.env.NEXT_PUBLIC_HACKATHON_REGISTRATION_FORM_URL ||
    "https://docs.google.com/forms/d/e/1FAIpQLScxpASJWpkpUN_2aSweOLiReRVy4ujXmID04XO7V8rR_DYWiA/viewform";

  const href = formUrl || DEFAULT_FORM_URL;
  const isPrimary = variant === "primary";
  const isCompact = variant === "compact";

  return (
    <a
      href={href}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      aria-label={label}
      className={cn(
        // Base styles
        "group inline-flex items-center justify-center gap-2 font-vt323 tracking-wide rounded-xl transition-all duration-300",
        
        // Primary variant (Bitcoin Orange)
        isPrimary && [
          "bg-bitcoin text-black px-8 py-4 text-lg font-bold",
          "hover:bg-bitcoin/90",
          "shadow-[0_0_25px_rgba(247,147,26,0.4)]",
          "hover:shadow-[0_0_40px_rgba(247,147,26,0.6)]",
          "active:scale-95",
        ],
        
        // Ghost variant (Matrix Green)
        !isPrimary && !isCompact && [
          "border border-matrix/30 text-matrix px-8 py-4 text-lg",
          "hover:border-matrix hover:bg-matrix/10",
          "shadow-[0_0_15px_rgba(0,255,65,0.1)]",
          "hover:shadow-[0_0_25px_rgba(0,255,65,0.25)]",
        ],
        
        // Compact variant (inline, subtle)
        isCompact && [
          "text-matrix hover:text-bitcoin text-sm font-mono",
          "underline-offset-4 hover:underline",
          "px-0 py-1",
        ],
        
        // Custom overrides
        className
      )}
    >
      {/* Label */}
      <span className="relative z-10 flex items-center gap-2">
        {label}
        {showBadge && (
          <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded border border-white/30">
            OFICIAL
          </span>
        )}
      </span>
      
      {/* Icon (hidden for compact variant) */}
      {!isCompact && openInNewTab ? (
        <ExternalLink className="h-5 w-5 opacity-90 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      ) : !isCompact && !openInNewTab ? (
        <ArrowUpRight className="h-5 w-5 opacity-90 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      ) : null}
      
      {/* Subtle glow overlay on hover (skip for compact) */}
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