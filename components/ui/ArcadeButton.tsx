"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface ArcadeButtonProps {
  href?: string;
  children?: React.ReactNode;
  target?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  variant?: "bitcoin" | "matrix" | "primary" | "outline";
  onClick?: () => void;
}

// 🔹 Bitcoin Icon SVG
const BitcoinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1.5l.3 1.9c-1.3.1-2.6.5-3.8 1.1l-.8-1.7-1.5.7.8 1.7C4.6 6.3 3.3 7.8 2.4 9.5L.5 9l-.3 1.6 1.9.4c-.1.7-.2 1.4-.2 2.1 0 .7.1 1.4.2 2.1l-1.9.4.3 1.6 1.9-.4c.9 1.7 2.2 3.2 3.8 4.3l-.8 1.7 1.5.7.8-1.7c1.2.6 2.5 1 3.8 1.1l-.3 1.9 1.6.3.3-1.9c.7.1 1.4.1 2.1.1.7 0 1.4 0 2.1-.1l.3 1.9 1.6-.3-.3-1.9c1.3-.1 2.6-.5 3.8-1.1l.8 1.7 1.5-.7-.8-1.7c1.6-1.1 2.9-2.6 3.8-4.3l1.9.4.3-1.6-1.9-.4c.1-.7.2-1.4.2-2.1 0-.7-.1-1.4-.2-2.1l1.9-.4-.3-1.6-1.9.4c-.9-1.7-2.2-3.2-3.8-4.3l.8-1.7-1.5-.7-.8 1.7c-1.2-.6-2.5-1-3.8-1.1l.3-1.9-1.6-.3-.3 1.9c-.7-.1-1.4-.1-2.1-.1s-1.4.1-2.1.1L12.8 0l-1.6.3-1.6 1.2zm7.6 10.5c.3 1.8-.8 3.5-2.6 3.8l-5.6.8c-1.8.3-3.5-.8-3.8-2.6l-.8-5.6c-.3-1.8.8-3.5 2.6-3.8l5.6-.8c1.8-.3 3.5.8 3.8 2.6l.8 5.6z" />
  </svg>
);

export default function ArcadeButton({
  href,
  children,
  target = "_blank",
  className = "",
  size = "lg",
  label,
  variant = "bitcoin",
  onClick,
}: ArcadeButtonProps) {
  // Ajustamos tamaños para dar más "aire" al icono
  const sizeClasses = {
    sm: "w-16 h-16 text-xl border-b-[6px]",
    md: "w-20 h-20 text-2xl border-b-[8px]",
    lg: "w-24 h-24 text-3xl border-b-[10px]",
    xl: "w-28 h-28 text-4xl border-b-[12px]",
  };

  const actualVariant = variant === "primary" ? "bitcoin" : variant === "outline" ? "matrix" : variant;

  const variantStyles = {
    bitcoin: {
      border: "border-bitcoin",
      bg: "bg-bitcoin",
      text: "text-black", // Texto negro sobre naranja para contraste arcade
      glow: "shadow-[0_0_20px_rgba(247,147,26,0.4)]",
      hoverGlow: "hover:shadow-[0_0_35px_rgba(247,147,26,0.6)]",
      label: "text-bitcoin",
      icon: "drop-shadow-sm",
    },
    matrix: {
      border: "border-matrix",
      bg: "bg-matrix",
      text: "text-black",
      glow: "shadow-[0_0_20px_rgba(0,255,65,0.4)]",
      hoverGlow: "hover:shadow-[0_0_35px_rgba(0,255,65,0.6)]",
      label: "text-matrix",
      icon: "drop-shadow-sm",
    },
  };

  const style = variantStyles[actualVariant as "bitcoin" | "matrix"] || variantStyles.bitcoin;

  const ButtonContent = ({ isLink = false }: { isLink?: boolean }) => (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full",
        "font-vt323 font-bold",
        sizeClasses[size],
        style.bg,
        style.border,
        "transition-all duration-100 ease-out",
        "hover:brightness-110 hover:-translate-y-1", // Efecto de "levantarse" al hover
        "active:border-b-0 active:translate-y-[10px]", // Efecto de "hundirse" al click
        style.glow,
        style.hoverGlow,
        "group"
      )}
    >
      {/* Reflejo superior (Plástico) */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-t-full pointer-events-none" />
      
      {/* Icono centrado con margen interno */}
      <BitcoinIcon className={cn("w-1/2 h-1/2", style.text, style.icon, "relative z-10")} />
      
      {/* Sombra interna para profundidad */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_-4px_6px_rgba(0,0,0,0.2)] pointer-events-none" />
    </div>
  );

  return (
    <div className={cn("relative inline-block group/root", className)}>
      {href ? (
        <Link href={href} target={target} rel="noopener noreferrer">
          <ButtonContent isLink />
        </Link>
      ) : (
        <button onClick={onClick}>
          <ButtonContent />
        </button>
      )}

      {(children || label) && (
        <p className={cn("text-center mt-4 text-sm font-mono tracking-widest uppercase", style.label, "drop-shadow-md")}>
          {children || label}
        </p>
      )}
    </div>
  );
}