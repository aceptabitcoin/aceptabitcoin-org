"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface ArcadeButtonProps {
  href?: string;
  children: React.ReactNode; // Texto principal del botón
  target?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "bitcoin" | "matrix";
  icon?: React.ReactNode; // Icono opcional (ej. el SVG de Bitcoin)
  onClick?: () => void;
  disabled?: boolean;
}

export default function ArcadeButton({
  href,
  children,
  target = "_blank",
  className = "",
  size = "md",
  variant = "bitcoin",
  icon,
  onClick,
  disabled = false,
}: ArcadeButtonProps) {

  // 1. Configuración de Tamaños (Aspecto Terminal)
  const sizeClasses = {
    sm: "px-6 py-2 text-xl tracking-widest", 
    md: "px-8 py-3 text-2xl tracking-widest", 
    lg: "px-12 py-4 text-3xl tracking-[0.2em]", 
  };

  // 2. Definición de Variantes (Colors & Glow)
  // Usamos valores RGB para poder manipular la opacidad en las sombras arbitrarias
  const variantStyles = {
    bitcoin: {
      bg: "bg-bitcoin",
      text: "text-black", 
      // RGB de #F7931A es 247, 147, 26
      shadowColor: "247, 147, 26", 
      borderDepth: "border-orange-700", // Borde inferior oscuro simulado
    },
    matrix: {
      bg: "bg-matrix",
      text: "text-black", 
      // RGB de #00FF41 es 0, 255, 65
      shadowColor: "0, 255, 65", 
      borderDepth: "border-green-800",
    },
  };

  const currentStyle = variantStyles[variant];

  // Clases base comunes para el botón físico
  const buttonBaseClasses = cn(
    // Layout & Tipografía Arcade
    "relative flex items-center justify-center gap-3 font-vt323 font-bold uppercase rounded-sm",
    
    // Tamaño dinámico
    sizeClasses[size],
    
    // Base Colors
    currentStyle.bg,
    currentStyle.text,
    
    // El borde inferior grueso simula la profundidad física del botón mecánico
    "border-b-[6px]",
    currentStyle.borderDepth,

    // Transiciones Mecánicas
    "transition-all duration-100 ease-out",
    
    // Cursor
    "cursor-pointer select-none",

    // Estados Hover/Active
    !disabled && [
      "hover:-translate-y-1 hover:brightness-110",
      // Sombra dinámica usando el RGB definido arriba
      `hover:shadow-[0_0_25px_rgba(${currentStyle.shadowColor},0.6)]`,
      
      // Estado Active: Se "hunde" (reduce el borde inferior y traslada Y)
      "active:translate-y-[4px] active:border-b-[2px] active:shadow-none"
    ],
    
    disabled && "opacity-50 cursor-not-allowed grayscale"
  );

  const content = (
    <>
      {/* Icono opcional */}
      {icon && <span className="pointer-events-none drop-shadow-md">{icon}</span>}
      
      {/* Texto */}
      <span className="pointer-events-none drop-shadow-sm">{children}</span>

      {/* Efecto "Scanline/Brillo" sutil encima para dar toque retro/plástico */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-0 hover:opacity-100 pointer-events-none transition-opacity rounded-sm" />
    </>
  );

  return (
    <div className={cn("relative inline-block", className)}>
      {href ? (
        <Link 
          href={href} 
          target={target} 
          rel="noopener noreferrer"
          className={buttonBaseClasses}
        >
          {content}
        </Link>
      ) : (
        <button 
          onClick={onClick}
          disabled={disabled}
          className={buttonBaseClasses}
        >
          {content}
        </button>
      )}
    </div>
  );
}