'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
// ÍCONO TELÉFONO CYBERPUNK - Más claro y elegante
// ─────────────────────────────────────────────────────────────
const MatrixPhoneIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Cuerpo principal del teléfono - más alto y delgado */}
    <rect 
      x="5.5" 
      y="2.5" 
      width="13" 
      height="19" 
      rx="3" 
      stroke="currentColor" 
      strokeWidth="1.6" 
      fill="none"
    />
    
    {/* Pantalla con glow interno sutil */}
    <rect 
      x="7.5" 
      y="5" 
      width="9" 
      height="13.5" 
      rx="1.2" 
      fill="currentColor" 
      opacity="0.12" 
    />

    {/* Cámara */}
    <circle 
      cx="12" 
      cy="7.8" 
      r="1.1" 
      fill="currentColor" 
    />

    {/* Flash / Sensor */}
    <circle 
      cx="15.5" 
      cy="7.8" 
      r="0.45" 
      fill="currentColor" 
      opacity="0.6"
    />

    {/* Altavoz */}
    <rect 
      x="9.2" 
      y="4" 
      width="5.6" 
      height="0.9" 
      rx="0.45" 
      fill="currentColor" 
    />

    {/* Barra inferior (home indicator) */}
    <rect 
      x="9.8" 
      y="17.8" 
      width="4.4" 
      height="1.1" 
      rx="0.55" 
      fill="currentColor" 
    />

    {/* Línea Matrix sutil dentro de la pantalla */}
    <path 
      d="M8.8 10.5 L15.2 13.8" 
      stroke="currentColor" 
      strokeWidth="0.7" 
      opacity="0.45" 
    />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Componente Principal
// ─────────────────────────────────────────────────────────────
export default function MatrixArcadeWhatsApp({
  phoneNumber,
  message = '',
  label = 'CHATEAR POR WHATSAPP',
  size = 'lg',
  enableSound = false,
  onlineStatus = 'online',
  className = '',
  onOpen,
  floating = true,
}: MatrixArcadeWhatsAppProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useMemo(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, 
  []);

  const MATRIX_COLOR = '#00FF41';

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-28 h-28',
  };

  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  // Hook de feedback (mantengo el tuyo simplificado)
  const triggerFullFeedback = useCallback(() => {
    if (prefersReducedMotion) return;
    if ('vibrate' in navigator) navigator.vibrate([10, 20, 8]);
  }, [prefersReducedMotion]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    triggerFullFeedback();
    // ... (mantengo tu lógica de click anterior)
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      e.preventDefault();
      window.location.href = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message || '')}`;
      setTimeout(() => {
        if (document.visibilityState === 'visible') window.open(whatsappUrl, '_blank');
      }, 1600);
    } else {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
    onOpen?.();
  }, [triggerFullFeedback, cleanPhone, message, whatsappUrl, onOpen]);

  return (
    <div className={`${floating ? 'fixed bottom-8 right-8 z-[100]' : 'relative inline-block'} ${className}`}>
      {/* Glow exterior grande (siempre presente) */}
      <div
        className="absolute -inset-12 rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${MATRIX_COLOR}25 10%, transparent 70%)`,
          animation: prefersReducedMotion ? 'none' : 'glowBreath 4s ease-in-out infinite',
        }}
      />

      <a
        href={whatsappUrl}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative flex items-center justify-center ${sizeClasses[size]}
          bg-gradient-to-br from-zinc-950 to-black
          border-[3px] border-[#00FF41]/80
          rounded-3xl overflow-hidden
          transition-all duration-300 hover:scale-110 active:scale-95
          shadow-2xl shadow-black/90
        `}
        style={{ color: MATRIX_COLOR }}
        aria-label={`Abrir WhatsApp - ${label}`}
      >
        {/* Glow interno del botón */}
        <div
          className="absolute inset-0 rounded-3xl transition-all duration-700"
          style={{
            boxShadow: `inset 0 0 40px ${MATRIX_COLOR}30`,
            animation: prefersReducedMotion ? 'none' : 'glowBreath 3.5s ease-in-out infinite',
          }}
        />

        <MatrixPhoneIcon className="w-[58%] h-[58%] transition-transform duration-500" />

        {/* Energy ring interno */}
        <div 
          className={`absolute inset-[6px] border border-[#00FF41]/40 rounded-[22px] transition-all duration-500
            ${isHovered ? 'scale-95 opacity-80' : 'opacity-30'}`} 
        />
      </a>

      {/* Label con VT323 */}
      {label && (
        <div
          className="absolute top-full mt-5 left-1/2 -translate-x-1/2 font-vt323 text-xl tracking-[3px] uppercase text-center whitespace-nowrap transition-all duration-300"
          style={{ 
            color: MATRIX_COLOR, 
            textShadow: `0 0 20px ${MATRIX_COLOR}90, 0 0 40px ${MATRIX_COLOR}40`
          }}
        >
          {label}
        </div>
      )}

      {/* Status Online */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 px-3 py-0.5 rounded-full border border-[#00FF41]/30">
        <div
          className={`w-3 h-3 rounded-full animate-pulse`}
          style={{ 
            backgroundColor: MATRIX_COLOR,
            boxShadow: `0 0 12px ${MATRIX_COLOR}, 0 0 20px ${MATRIX_COLOR}80`
          }}
        />
        <span className="text-[10px] font-mono tracking-[2px] text-matrix">
          ONLINE
        </span>
      </div>
    </div>
  );
}