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
 * 🤖 B.O.B. Section Header
 * Separador visual para introducir la sección educativa del chatbot.
 * Diseño ligero: no compite con el Hero, pero marca claramente el inicio del flujo "Aprende".
 * 
 * DS v2.0 Compliance:
 * - Fondo: #000000 (puro)
 * - Texto: font-serif (títulos), font-mono (subtítulos)
 * - Colores: var(--matrix) / var(--bitcoin) via CSS vars
 * - Efectos: glow sutil, border-white/10, backdrop-blur opcional
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

  return (
    <div 
      id={id}
      ref={ref}
      className={`relative w-full py-6 sm:py-8 ${className}`}
      role="separator"
      aria-label={`Sección: ${title}`}
    >
      {/* Línea superior sutil con glow Matrix */}
      <div 
        className="w-full h-[1px] relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(90deg, transparent, var(--matrix), transparent)',
          boxShadow: 'var(--matrix-glow, 0 0 15px rgba(0,255,65,0.2))'
        }}
      />

      {/* Contenido central */}
      <motion.div 
        className="relative flex flex-col items-center mt-4 z-10"
        initial={{ opacity: 0, y: 12 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Título principal: font-serif, color matrix, glow sutil */}
        <h2 
          className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--matrix)]"
          style={{ 
            textShadow: '0 0 12px rgba(0,255,65,0.3)',
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
              bg-[var(--matrix)]/10 border border-[var(--matrix)]/30 text-[var(--matrix)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--matrix)] animate-pulse" />
            Contexto: <span className="font-bold capitalize">{activeContext}</span>
          </motion.span>
        )}
      </motion.div>

      {/* Línea inferior (espejo) */}
      <div 
        className="w-full h-[1px] mt-4 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(90deg, transparent, var(--matrix), transparent)',
          boxShadow: 'var(--matrix-glow, 0 0 15px rgba(0,255,65,0.2))'
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
              rgba(255,255,255,0.03) 50%,
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