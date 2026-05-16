'use client';

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';

export interface MatrixArcadeWhatsAppProps {
  phoneNumber: string;
  message?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  enableMatrixRain?: boolean;
  enableSound?: boolean;
  onlineStatus?: 'online' | 'away' | 'offline';
  lastSeen?: string;
  className?: string;
  onOpen?: () => void;
  floating?: boolean;
}

// ─────────────────────────────────────────────────────────────
// ÍCONO CYBER-WHATSAPP (Diálogo + Teléfono)
// Reemplaza el look de "Switch" por la icónica burbuja de chat
// ─────────────────────────────────────────────────────────────
export const CyberWhatsAppIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Burbuja de chat estilo WhatsApp con estética vector terminal */}
    <path
      d="M12 3C6.477 3 2 7.477 2 13c0 1.886.524 3.65 1.435 5.16L2.05 21.95a.5.5 0 00.612.612l3.79-1.385A9.948 9.948 0 0012 23c5.523 0 10-4.477 10-10S17.523 3 12 3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.05"
    />
    {/* Auricular telefónico interno */}
    <path
      d="M16.5 14.25c-.322-.16-1.9-.937-2.193-1.043-.294-.107-.508-.16-.722.16-.214.32-.828 1.043-1.015 1.256-.187.213-.375.24-.697.08a8.775 8.775 0 01-2.59-1.6c-.804-.716-1.347-1.6-1.507-1.872-.16-.32-.017-.493.143-.652.144-.144.32-.373.481-.56.16-.187.214-.32.321-.534.107-.213.054-.4-.026-.56-.08-.16-.722-1.734-.99-2.38-.26-.623-.526-.54-.722-.55-.187-.008-.401-.01-.615-.01a1.183 1.183 0 00-.856.4c-.294.32-1.123 1.1-1.123 2.68 0 1.581 1.15 3.11 1.31 3.324.16.214 2.264 3.458 5.485 4.85 1.417.613 2.164.725 2.936.613.73-.107 2.193-.896 2.5-1.763.306-.867.306-1.609.214-1.763-.092-.154-.34-.246-.662-.406z"
      fill="currentColor"
    />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Hook Feedback (Se mantiene idéntico)
// ─────────────────────────────────────────────────────────────
const useArcadeFeedback = (enableSound: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const prefersReducedMotion = useMemo(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, 
  []);

  const triggerFullFeedback = useCallback(() => {
    if (prefersReducedMotion) return;
    if ('vibrate' in navigator) navigator.vibrate([8, 18, 6]);
    if (!enableSound) return;

    try {
      const ctx = audioContextRef.current || 
        new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;

      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'square';
      osc.frequency.setValueAtTime(920, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.09);

      filter.type = 'lowpass';
      filter.frequency.value = 1400;

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);

      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {}
  }, [enableSound, prefersReducedMotion]);

  return { triggerFullFeedback };
};

// ─────────────────────────────────────────────────────────────
// Matrix Rain (Omitido por brevedad, mantén tu lógica original)
// ─────────────────────────────────────────────────────────────
const MatrixRain = ({ active }: { active: boolean }) => {
  return <div className="absolute inset-0 bg-matrix/5 animate-pulse" />; 
};

// ─────────────────────────────────────────────────────────────
// Componente Principal Modificado
// ─────────────────────────────────────────────────────────────
export default function MatrixArcadeWhatsApp({
  phoneNumber,
  message = '',
  label = 'CHATEAR POR WHATSAPP',
  size = 'lg',
  enableMatrixRain = true,
  enableSound = false,
  onlineStatus = 'online',
  lastSeen,
  className = '',
  onOpen,
  floating = true,
}: MatrixArcadeWhatsAppProps) {
  const { triggerFullFeedback } = useArcadeFeedback(enableSound);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useMemo(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, 
  []);

  // Vinculado a tus variables globales de CSS según el Design System
  const MATRIX_COLOR = '#00FF41'; 

  // Tamaños estandarizados para un botón circular balanceado
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    triggerFullFeedback();
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
    <div
      className={`
        ${floating ? 'fixed bottom-8 right-8 z-[100]' : 'relative inline-block'} 
        ${className}
        select-none
      `}
    >
      {/* Glow exterior de bunker/matriz sutil */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none
          ${isHovered ? 'opacity-70 scale-120 blur-2xl' : 'opacity-20 blur-xl'}`}
        style={{ background: `radial-gradient(circle, ${MATRIX_COLOR}80 10%, transparent 70%)` }}
      />

      {/* Botón de Acción Principal (Ahora 100% esférico) */}
      <a
        href={whatsappUrl}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative flex items-center justify-center ${sizeClasses[size]}
          bg-black border-2 border-[#00FF41]
          rounded-full overflow-hidden
          transition-all duration-300 hover:scale-110 active:scale-95
          shadow-[0_0_15px_rgba(0,255,65,0.2)] hover:shadow-[0_0_25px_rgba(0,255,65,0.6)]
        `}
        style={{ color: MATRIX_COLOR }}
        aria-label={`Abrir WhatsApp - ${label}`}
      >
        {/* Nuevo Icono de WhatsApp Cyber */}
        <CyberWhatsAppIcon className="w-7/12 h-7/12 transition-transform duration-300 relative z-10" />

        {/* Punto de Estatus Integrado nativamente en el borde del botón */}
        <span className="absolute top-1 right-1 z-20 flex h-3 w-3">
          {onlineStatus === 'online' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
          )}
          <span 
            className="relative inline-flex rounded-full h-3 w-3 border border-black"
            style={{ 
              backgroundColor: onlineStatus === 'online' ? '#00FF41' : onlineStatus === 'away' ? '#F7931A' : '#ef4444' 
            }}
          />
        </span>

        {/* Anillo de energía interno del sistema */}
        <div className={`absolute inset-1 border border-[#00FF41]/20 rounded-full transition-all duration-500 pointer-events-none
          ${isHovered ? 'opacity-80 scale-105' : 'opacity-20'}`} 
        />
      </a>

      {/* Label Inferior Estilo Terminal */}
      {label && (
        <div
          className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[2px] uppercase text-center whitespace-nowrap transition-all duration-300 pointer-events-none
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-40 -translate-y-1'}`}
          style={{ color: MATRIX_COLOR, textShadow: `0 0 8px ${MATRIX_COLOR}60` }}
        >
          {label}
        </div>
      )}

      {/* Lluvia de código en Hover */}
      {enableMatrixRain && isHovered && !prefersReducedMotion && (
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none -z-10">
          <MatrixRain active={isHovered} />
        </div>
      )}
    </div>
  );
}