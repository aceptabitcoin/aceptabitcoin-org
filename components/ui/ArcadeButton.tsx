"use client";

import Link from "next/link";
import React from "react";

interface ArcadeButtonProps {
  href: string;
  children?: React.ReactNode;
  target?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  variant?: "bitcoin" | "matrix"; // ← Nuevo: permite elegir color principal
}

// 🔹 Bitcoin Icon SVG (inline para evitar dependencias)
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
  variant = "bitcoin", // ← Default: bitcoin orange
}: ArcadeButtonProps) {
  // 🔹 Tamaños con tokens del design system
  const sizeClasses = {
    sm: "w-14 h-14 text-lg",
    md: "w-18 h-18 text-xl",
    lg: "w-24 h-24 text-3xl",
    xl: "w-28 h-28 text-4xl",
  };

  // 🔹 Colores según variante (SOLO palette aprobada)
  const variantStyles = {
    bitcoin: {
      border: "border-bitcoin",
      text: "text-bitcoin",
      glow: "shadow-[0_0_30px_rgba(247,147,26,0.5)] hover:shadow-[0_0_50px_rgba(247,147,26,0.7)]",
      hoverBorder: "hover:border-bitcoin/80",
      label: "text-bitcoin",
      icon: "text-bitcoin drop-shadow-[0_0_12px_#F7931A]",
    },
    matrix: {
      border: "border-matrix",
      text: "text-matrix",
      glow: "shadow-[0_0_30px_rgba(0,255,65,0.5)] hover:shadow-[0_0_50px_rgba(0,255,65,0.7)]",
      hoverBorder: "hover:border-matrix/80",
      label: "text-matrix",
      icon: "text-matrix drop-shadow-[0_0_12px_#00FF41]",
    },
  };

  const style = variantStyles[variant];

  return (
    <div className={`relative group ${className}`}>
      {/* 🔹 Glow exterior con token aprobado */}
      <div className={`absolute -inset-3 bg-gradient-to-r from-black via-${variant === "bitcoin" ? "bitcoin" : "matrix"}/20 to-black rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-all duration-300`} />

      <Link
        href={href}
        target={target}
        rel="noopener noreferrer"
        className={`
          relative flex items-center justify-center
          ${sizeClasses[size]}
          font-vt323 font-bold text-white
          bg-black border-[6px] ${style.border}
          rounded-full overflow-hidden
          ${style.hoverBorder} hover:scale-105
          active:scale-95 transition-all duration-200
          ${style.glow}
        `}
      >
        {/* 🔹 Scanline effect usando animación existente */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none animate-scanline" />

        {/* 🔹 Bitcoin Icon con color dinámico */}
        <BitcoinIcon className={`w-11/12 h-11/12 ${style.icon} group-hover:scale-105 transition-transform`} />

        {/* 🔹 Press effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-active:opacity-100 transition-opacity" />
      </Link>

      {/* 🔹 Label con tipografía semántica */}
      {(children || label) && (
        <p className={`text-center mt-3 text-sm font-mono tracking-widest ${style.label} drop-shadow-sm`}>
          {children || label}
        </p>
      )}
    </div>
  );
}
