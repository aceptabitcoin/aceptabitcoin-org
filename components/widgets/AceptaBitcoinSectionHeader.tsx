'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface AceptaBitcoinHeaderProps {
  /** Título principal (default: "Acepta Bitcoin") */
  title?: string;
  
  /** Subtítulo explicativo de la calculadora */
  subtitle?: string;
  
  /** Moneda fiat de referencia para conversión (ej: 'USD', 'MXN', 'SV') */
  fiatCurrency?: string;
  
  /** Tipo de cálculo: 'payment' | 'conversion' | 'savings' */
  calculationMode?: 'payment' | 'conversion' | 'savings';
  
  /** Habilitar animación de entrada al hacer scroll */
  animateOnScroll?: boolean;
  
  /** Clase CSS adicional para el contenedor */
  className?: string;
  
  /** ID para anclaje de navegación */
  id?: string;
}

const modeLabels = {
  payment: '💳 Pago con BTC',
  conversion: '🔄 Conversión Instantánea',
  savings: '📈 Ahorro Programado'
} as const;

/**
 * ₿ Acepta Bitcoin Section Header
 * Header especializado para introducir la calculadora de pagos/conversión en Bitcoin.
 * Diseño funcional: enfocado en claridad para flujos financieros.
 * 
 * DS v2.0 Compliance:
 * - Fondo: #000000 (puro)
 * - Texto: font-serif (títulos), font-mono (valores/datos)
 * - Colores: var(--orange-500) primario + acentos semánticos
 * - Efectos: glow naranja sutil, border-orange/10, micro-interacciones
 */
export default function AceptaBitcoinSectionHeader({
  title = 'Acepta Bitcoin',
  subtitle = 'Calcula pagos, conversiones y ahorros en tiempo real',
  fiatCurrency = 'USD',
  calculationMode = 'payment',
  animateOnScroll = true,
  className = '',
  id,
}: AceptaBitcoinHeaderProps) {
  
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!animateOnScroll);

  const orangeMain = 'var(--orange-500, #f97316)';
  const orangeLight = 'var(--orange-400, #fb923c)';
  const orangeGlow = 'var(--orange-glow, 0 0 15px rgba(249, 115, 22, 0.3))';

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
      role="region"
      aria-label={`Sección: ${title}`}
    >
      <div 
        className="w-full h-[1px] relative overflow-hidden"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${orangeMain}, transparent)`,
          boxShadow: orangeGlow
        }}
      >
        <span 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
            text-[8px] font-mono text-orange-500/30 select-none"
          aria-hidden="true"
        >
          ₿
        </span>
      </div>

      <motion.div 
        className="relative flex flex-col items-center mt-4 z-10"
        initial={{ opacity: 0, y: 12 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h2 
          className="font-serif text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2"
          style={{ 
            color: orangeMain,
            textShadow: `0 0 12px rgba(249, 115, 22, 0.4)`,
          }}
        >
          <span className="text-orange-400 text-xl" aria-hidden="true">₿</span>
          {title}
        </h2>

        {subtitle && (
          <motion.p 
            className="mt-2 text-sm sm:text-base font-mono tracking-wide text-gray-400 text-center max-w-md"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div 
          className="mt-4 flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono 
              bg-orange-500/10 border border-orange-500/30 text-orange-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            {modeLabels[calculationMode]}
          </span>

          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono 
              bg-white/5 border border-white/10 text-gray-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Base: <span className="font-bold">{fiatCurrency}</span>
          </span>
        </motion.div>

        <motion.div
          className="mt-3 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.35, duration: 0.3 }}
        >
          <div className="flex -space-x-1">
            {[0, 1, 2].map((i) => (
              <span 
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-orange-500/80"
                style={{ 
                  animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
                  opacity: 0.6 + (i * 0.2)
                }}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
            Precisión en tiempo real
          </span>
        </motion.div>
      </motion.div>

      <div 
        className="w-full h-[1px] mt-4 relative overflow-hidden"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${orangeMain}, transparent)`,
          boxShadow: orangeGlow
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}