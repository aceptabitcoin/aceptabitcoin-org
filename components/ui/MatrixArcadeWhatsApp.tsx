'use client';

import React, { useCallback, useMemo, useState } from 'react';

export interface MatrixArcadeWhatsAppProps {
  phoneNumber: string;
  message?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  enableSound?: boolean;
  onlineStatus?: 'online' | 'away' | 'offline';
  className?: string;
  onOpen?: () => void;
  floating?: boolean;
}

// ─────────────────────────────────────────────────────────────
// ÍCONO TELÉFONO CYBERPUNK - Optimizado para legibilidad en tamaños pequeños
// ─────────────────────────────────────────────────────────────
const MatrixPhoneIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Cuerpo principal: Bordes más gruesos para mantener nitidez en escalas pequeñas */}
    <rect 
      x="5.5" y="2.5" width="13" height="19" rx="3" 
      stroke="currentColor" strokeWidth="1.8" fill="none"
    />
    
    {/* Pantalla: Contraste sutil para sugerir profundidad sin saturar */}
    <rect 
      x="7.5" y="5" width="9" height="13.5" rx="1.2" 
      fill="currentColor" opacity="0.15" 
    />

    {/* Cámara y Sensores: Simplificados para evitar ruido visual */}
    <circle cx="12" cy="7.8" r="1.2" fill="currentColor" />
    <circle cx="15.5" cy="7.8" r="0.5" fill="currentColor" opacity="0.7" />

    {/* Altavoz y Home Indicator: Líneas limpias estilo terminal */}
    <rect x="9.2" y="4" width="5.6" height="0.9" rx="0.45" fill="currentColor" />
    <rect x="9.8" y="17.8" width="4.4" height="1.1" rx="0.55" fill="currentColor" />

    {/* Línea Matrix: Trazo diagonal técnico dentro de la pantalla */}
    <path d="M8.8 10.5 L15.2 13.8" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Componente Principal: MatrixArcadeWhatsApp v2.1
// ─────────────────────────────────────────────────────────────
export default function MatrixArcadeWhatsApp({
  phoneNumber,
  message = '',
  label = 'CHATEAR POR WHATSAPP',
  size = 'lg',
  onlineStatus = 'online',
  className = '',
  onOpen,
  floating = true,
}: MatrixArcadeWhatsAppProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Guard de movimiento reducido para accesibilidad
  const prefersReducedMotion = useMemo(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, 
  []);

  const MATRIX_COLOR = '#00FF41'; // Token exacto del DS v2.0

  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-18 h-18',
    lg: 'w-22 h-22',
    xl: 'w-26 h-26',
  };

  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  const triggerFeedback = useCallback(() => {
    if (prefersReducedMotion) return;
    if ('vibrate' in navigator) navigator.vibrate([8, 15, 6]);
  }, [prefersReducedMotion]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    triggerFeedback();
    
    // Detección nativa de mobile para deep-linking inmediato
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      e.preventDefault();
      window.location.href = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message || '')}`;
      setTimeout(() => {
        if (document.visibilityState === 'visible') window.open(whatsappUrl, '_blank');
      }, 1200);
    } else {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
    onOpen?.();
  }, [triggerFeedback, cleanPhone, message, whatsappUrl, onOpen]);

  return (
    <div 
      className={`${floating ? 'fixed bottom-8 right-6 z-[100]' : 'relative inline-block'} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Glow Exterior: Respiración de energía Matrix */}
      <div
        className="absolute -inset-10 rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${MATRIX_COLOR}20 0%, transparent 70%)`,
          animation: prefersReducedMotion ? 'none' : 'glowBreath 4s ease-in-out infinite',
        }}
      />

      {/* SWITCH MECÁNICO: El cuerpo principal */}
      <a
        href={whatsappUrl}
        onClick={handleClick}
        className={`
          relative flex items-center justify-center ${sizeClasses[size]}
          bg-zinc-950 border-[3px] rounded-[2rem] overflow-hidden
          transition-all duration-300 hover:scale-105 active:scale-95
          shadow-[0_0_30px_rgba(0,0,0,0.8)]
        `}
        style={{ 
          borderColor: `${MATRIX_COLOR}cc`,
          color: MATRIX_COLOR,
          boxShadow: isHovered 
            ? `0 0 25px ${MATRIX_COLOR}40, inset 0 0 20px ${MATRIX_COLOR}20` 
            : `inset 0 0 15px ${MATRIX_COLOR}10`
        }}
        aria-label={label}
      >
        {/* Icono Central con escala dinámica */}
        <MatrixPhoneIcon className="w-[50%] h-[50%] transition-transform duration-500 drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]" />

        {/* Anillo Interno de Sub-frecuencia */}
        <div 
          className="absolute inset-[5px] border rounded-[1.6rem] transition-all duration-500 pointer-events-none"
          style={{ 
            borderColor: `${MATRIX_COLOR}${isHovered ? '60' : '20'}`,
            transform: isHovered ? 'scale(0.92)' : 'scale(1)'
          }} 
        />
      </a>

      {/* LABEL REPARADO: Posicionado DEBAJO del switch para máxima legibilidad */}
      {label && (
        <div className="mt-3 text-center pointer-events-none">
          <span 
            className="font-vt323 text-lg md:text-xl tracking-[3px] uppercase block"
            style={{ 
              color: MATRIX_COLOR,
              textShadow: `0 0 10px ${MATRIX_COLOR}b0, 0 0 20px ${MATRIX_COLOR}50`
            }}
          >
            {label}
          </span>
          
          {/* Status Online integrado en el label para ahorrar espacio vertical */}
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: MATRIX_COLOR, boxShadow: `0 0 6px ${MATRIX_COLOR}` }}
            />
            <span className="text-[8px] font-mono font-bold tracking-widest text-[#00FF41]/80 uppercase">
              {onlineStatus}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}