"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface ArcadeButtonProps {
  href?: string;
  children: React.ReactNode;
  target?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "bitcoin" | "matrix";
  icon?: React.ReactNode;
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
  const sizeClasses = {
    sm: "px-6 py-2 text-xl tracking-widest",
    md: "px-8 py-3 text-2xl tracking-widest",
    lg: "px-12 py-4 text-3xl tracking-[0.2em]",
  };

  const variantStyles = {
    bitcoin: {
      bg: "bg-[#F7931A]",
      text: "text-black",
      rgb: "247, 147, 26",
      borderDepth: "#D97F00",
      borderClass: "border-b-[#D97F00]",
    },
    matrix: {
      bg: "bg-[#00FF41]",
      text: "text-black",
      rgb: "0, 255, 65",
      borderDepth: "#00CC33",
      borderClass: "border-b-[#00CC33]",
    },
  };

  const style = variantStyles[variant];

  // ✅ FIX 1: box-shadow dinámico vía inline style (Tailwind no resuelve var() en clases arbitrarias)
  const dynamicShadow = {
    boxShadow: disabled
      ? "none"
      : `0 0 15px rgba(${style.rgb}, 0.4), 0 0 30px rgba(${style.rgb}, 0.15)`,
  };

  const baseClasses = cn(
    "relative flex items-center justify-center gap-3 font-vt323 font-bold uppercase rounded-sm overflow-hidden group",
    "border-b-8 transition-all duration-150 ease-out",
    "cursor-pointer select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    sizeClasses[size],
    style.bg,
    style.text,
    style.borderClass,
    !disabled && [
      "hover:-translate-y-1 hover:brightness-110",
      "active:translate-y-[5px] active:border-b-[3px]",
    ],
    disabled && "opacity-50 cursor-not-allowed grayscale",
    className
  );

  const content = (
    <>
      {icon && <span className="pointer-events-none drop-shadow-lg">{icon}</span>}
      <span className="pointer-events-none drop-shadow-md relative z-10">{children}</span>

      {/* Brillo plástico superior */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-200 pointer-events-none" />

      {/* ✅ FIX 2: Scanline con keyframes definidos inline */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          style={{
            animation: "arcade-scan 1.8s linear infinite",
          }}
        />
      </div>

      {/* Ring interior sutil */}
      <div className="absolute inset-0 rounded-sm ring-1 ring-inset ring-white/20 opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none" />
    </>
  );

  // Keyframes inyectados una sola vez
  const scanKeyframes = (
    <style jsx>{`
      @keyframes arcade-scan {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(400%); }
      }
    `}</style>
  );

  // Si no usas styled-jsx, usa esta alternativa:
  // Inyecta esto en tu globals.css:
  // @keyframes arcade-scan {
  //   0% { transform: translateX(-150%); }
  //   100% { transform: translateX(400%); }
  // }

  const buttonElement = href ? (
    <Link
      href={href}
      target={target}
      rel="noopener noreferrer"
      className={baseClasses}
      style={dynamicShadow}
    >
      {content}
    </Link>
  ) : (
    <button
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      style={dynamicShadow}
    >
      {content}
    </button>
  );

  return (
    <>
      {scanKeyframes}
      <div className="relative inline-block">{buttonElement}</div>
    </>
  );
}