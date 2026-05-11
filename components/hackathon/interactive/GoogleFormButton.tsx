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
  /** Variante de estilo: 'primary' (Bitcoin Orange) o 'ghost' (Matrix Green) */
  variant?: "primary" | "ghost";
  /** Clase adicional para personalización */
  className?: string;
  /** Si es true, abre en nueva pestaña (default: true) */
  openInNewTab?: boolean;
}

export default function GoogleFormButton({
  formUrl,
  label = "Registrarse Ahora",
  variant = "primary",
  className,
  openInNewTab = true,
}: GoogleFormButtonProps) {
  // URL por defecto desde env var o fallback hardcodeado
  const DEFAULT_FORM_URL =
    process.env.NEXT_PUBLIC_HACKATHON_REGISTRATION_FORM_URL ||
    "https://docs.google.com/forms/d/e/1FAIpQLScxpASJWpkpUN_2aSweOLiReRVy4ujXmID04XO7V8rR_DYWiA/viewform";

  const href = formUrl || DEFAULT_FORM_URL;
  const isPrimary = variant === "primary";

  return (
    <a
      href={href}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      aria-label={label}
      className={cn(
        // Base styles
        "group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-vt323 text-lg font-bold tracking-wide rounded-xl transition-all duration-300",
        
        // Primary variant (Bitcoin Orange)
        isPrimary && [
          "bg-bitcoin text-black",
          "hover:bg-bitcoin/90",
          "shadow-[0_0_25px_rgba(247,147,26,0.4)]",
          "hover:shadow-[0_0_40px_rgba(247,147,26,0.6)]",
          "active:scale-95",
        ],
        
        // Ghost variant (Matrix Green)
        !isPrimary && [
          "border border-matrix/30 text-matrix",
          "hover:border-matrix hover:bg-matrix/10",
          "shadow-[0_0_15px_rgba(0,255,65,0.1)]",
          "hover:shadow-[0_0_25px_rgba(0,255,65,0.25)]",
        ],
        
        // Custom overrides
        className
      )}
    >
      {/* Label */}
      <span className="relative z-10">{label}</span>
      
      {/* Icon with hover animation */}
      {openInNewTab ? (
        <ExternalLink className="h-5 w-5 opacity-90 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      ) : (
        <ArrowUpRight className="h-5 w-5 opacity-90 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      )}
      
      {/* Subtle glow overlay on hover */}
      <span
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
          isPrimary 
            ? "bg-gradient-to-br from-bitcoin/20 to-transparent" 
            : "bg-gradient-to-br from-matrix/20 to-transparent"
        )}
      />
    </a>
  );
}