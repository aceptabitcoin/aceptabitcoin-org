'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface BobSectionHeaderProps {
  /** Título principal (ej: "Aprende") */
  title: string;
  
  /** Subtítulo educativo (ej: "Pregunta a B.O.B. — tu tutor cypherpunk") */
  subtitle?: string;
  
  /** Contexto activo para destacar el chip correspondiente */
  activeContext?: string;
  
  /** Habilitar animación de entrada al hacer scroll */
  animateOnScroll?: boolean;
  
  /** Clase CSS adicional para el contenedor */
  className?: string;
  
  /** ID para anclaje de navegación */
  id?: string;
}

/**
 * 🤖 B.O.B. Section Header - ORANGE VARIANT
 * Separador visual con temática naranja para secciones destacadas.
 * 
 * DS v2.0 Compliance (Orange Theme):
 * - Fondo: #000000 (puro)
 * - Texto: font-serif (títulos), font-mono (subtítulos)
 * - Colores: var(--orange-500) / var(--orange-glow) via CSS vars
 * - Efectos: glow naranja sutil, border-orange/10
 */
export default function BobSectionHeader({
  title,
  subtitle,
  activeContext,
  animateOnScroll = true,
  className = '',
  id,
}: BobSectionHeaderProps) {
  
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!animateOnScroll);

  // Intersection Observer para animación al hacer scroll
  useEffect(() => {
    if (!animateOnScroll || !ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animateOnScroll]);

  // Variables de color naranja (DS v2.0 — definidas en globals.css)
  const orangeMain = 'var(--orange-500)';
  const orangeGlow = 'var(--orange-glow)';
  const orangeLight = 'var(--orange-400)';

  return (
    <div 
      id={id}
      ref={ref}
      className={`relative w-full py-6 sm:py-8 ${className}`}
      role="separator"
      aria-label={`Sección: ${title}`}
    >
      {/* Línea superior sutil con glow naranja */}
      <div 
        className="w-full h-[1px] relative overflow-hidden"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${orangeMain}, transparent)`,
          boxShadow: orangeGlow
        }}
      />

      {/* Contenido central */}
      <motion.div 
        className="relative flex flex-col items-center mt-4 z-10"
        initial={{ opacity: 0, y: 12 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Título principal: font-serif, color naranja, glow sutil */}
        <h2 
          className="font-serif text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ 
            color: orangeMain,
            textShadow: `0 0 12px rgba(249, 115, 22, 0.4)`,
          }}
        >
          {title}
        </h2>

        {/* Subtítulo: font-mono, color secundario, más discreto */}
        {subtitle && (
          <motion.p 
            className="mt-2 text-sm sm:text-base font-mono tracking-wide text-gray-400"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Chip de contexto activo (opcional) */}
        {activeContext && (
          <motion.span 
            className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono 
              bg-[var(--orange-500)]/10 border border-[var(--orange-500)]/30"
            style={{ color: orangeLight }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <span 
              className="w-1.5 h-1.5 rounded-full animate-pulse" 
              style={{ backgroundColor: orangeMain }} 
            />
            Contexto: <span className="font-bold capitalize">{activeContext}</span>
          </motion.span>
        )}
      </motion.div>

      {/* Línea inferior (espejo) */}
      <div 
        className="w-full h-[1px] mt-4 relative overflow-hidden"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${orangeMain}, transparent)`,
          boxShadow: orangeGlow
        }}
      />

      {/* Scanline sutil (solo si el usuario no prefiere movimiento reducido) */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          [data-scanline]::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to right,
              transparent 0%,
              rgba(249, 115, 22, 0.04) 50%,
              transparent 100%
            );
            animation: scanline 4s linear infinite;
            pointer-events: none;
          }
          @keyframes scanline {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        }
      `}</style>
    </div>
  );
}