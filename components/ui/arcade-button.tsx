'use client';

import Link from "next/link";
import React from "react";

interface ArcadeButtonProps {
  href?: string;
  children: React.ReactNode;
  target?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: "button" | "submit" | "reset";
}

export default function ArcadeButton({
  href,
  children,
  target = "_blank",
  className = "",
  onClick,
  type = "button",
}: ArcadeButtonProps) {
  
  // Estilos CSS compartidos para la tapa interactiva del botón arcade
  const innerContentClasses = `
    relative 
    w-full 
    inline-flex 
    items-center 
    justify-center 
    px-8 md:px-10 
    py-4 
    text-xl md:text-3xl 
    font-bold 
    text-black 
    bg-[#F7931A] 
    font-vt323 
    uppercase 
    tracking-wider
    border-2 
    border-[#FAFAFA] 
    rounded-xl 
    transition-all 
    duration-100
    touch-manipulation
    
    /* Elevación inicial en el eje Y */
    -translate-y-2 
    
    /* Efecto 3D de relieve en los bordes internos */
    shadow-[inset_0_4px_0_rgba(255,255,255,0.4),_inset_0_-4px_0_rgba(0,0,0,0.3)]
    
    /* Hover: Brillo de neón de energía firme */
    group-hover:bg-[#ffaa3b]
    group-hover:shadow-[0_0_20px_rgba(247,147,26,0.6),_inset_0_4px_0_rgba(255,255,255,0.4),_inset_0_-4px_0_rgba(0,0,0,0.3)]
    
    /* Active: El botón baja físicamente y se acopla a la base negra */
    group-active:translate-y-0
    group-active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]
    
    focus:outline-none
    focus-visible:ring-2 focus-visible:ring-matrix focus-visible:ring-offset-2 focus-visible:ring-offset-black
  `;

  // Contenido interno con elementos gráficos de terminal cypherpunk
  const renderInner = () => (
    <>
      {/* Línea de escaneo retro integrada (usa animate-scanline de globals.css) */}
      <span className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-xl">
        <span className="absolute top-0 left-0 w-full h-1 bg-white/30 opacity-40 animate-scanline"></span>
      </span>

      <span className="flex items-center gap-3 select-none">
        {children}
        {/* Icono Power / Play rígido estilo retro */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 md:h-7 md:w-7 text-black fill-current shrink-0" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </>
  );

  // Contenedor base: chasis/hueco oscuro del gabinete arcade
  const containerClasses = `relative group inline-block font-mono active:outline-none ${className}`;

  // Fondo/Chasis: relieve negro sólido que absorbe el movimiento
  const renderChassis = () => (
    <span 
      className="absolute inset-0 w-full h-full bg-black border-2 border-[#F7931A]/40 rounded-xl shadow-[0_4px_0_#000] translate-y-0"
      aria-hidden="true"
    ></span>
  );

  // Renderizado condicional dinámico
  if (href) {
    return (
      <Link 
        href={href} 
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        onClick={onClick}
        className={containerClasses}
      >
        {renderChassis()}
        <span className={innerContentClasses}>
          {renderInner()}
        </span>
      </Link>
    );
  }

  return (
    <button 
      type={type}
      onClick={onClick}
      className={containerClasses}
    >
      {renderChassis()}
      <span className={innerContentClasses}>
        {renderInner()}
      </span>
    </button>
  );
}