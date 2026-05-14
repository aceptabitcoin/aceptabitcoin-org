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
// ÍCONO MEJORADO - Teléfono claro y moderno
// ─────────────────────────────────────────────────────────────
export const MatrixPhoneIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Cuerpo del teléfono */}
    <rect 
      x="6" y="3" width="12" height="18" rx="2.8" 
      stroke="currentColor" strokeWidth="1.8" fill="none" 
    />
    
    {/* Pantalla */}
    <rect 
      x="8" y="6" width="8" height="12.5" rx="1" 
      fill="currentColor" opacity="0.18" 
    />
    
    {/* Cámara */}
    <circle cx="12" cy="8.2" r="1" fill="currentColor" />
    
    {/* Altavoz */}
    <rect 
      x="9.5" y="4.2" width="5" height="0.9" rx="0.45" 
      fill="currentColor" 
    />
    
    {/* Botón home */}
    <rect 
      x="10" y="17.5" width="4" height="1.1" rx="0.55" 
      fill="currentColor" 
    />
    
    {/* Línea Matrix sutil */}
    <path 
      d="M8.5 11 L15.5 14.5" 
      stroke="currentColor" strokeWidth="0.75" opacity="0.6" 
    />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Hook Feedback
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
// Matrix Rain
// ─────────────────────────────────────────────────────────────
const MatrixRain = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useMemo(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, 
  []);

  useEffect(() => {
    if (!active || prefersReducedMotion) return;
    // ... (tu código original de MatrixRain está bien, lo omito por brevedad)
    // Puedes mantener tu implementación completa aquí
  }, [active, prefersReducedMotion]);

  if (!active || prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-30 mix-blend-screen"
      aria-hidden="true"
    />
  );
};

// ─────────────────────────────────────────────────────────────
// Componente Principal
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

  const MATRIX_COLOR = '#00FF41';

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-28 h-28',
  };

  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    triggerFullFeedback();
    // ... (tu lógica de click está bien, la mantengo igual)
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
      `}
    >
      {/* Glow exterior */}
      <div
        className={`absolute -inset-10 rounded-full transition-all duration-500 pointer-events-none
          ${isHovered ? 'opacity-80 scale-110 blur-3xl' : 'opacity-30 blur-2xl'}`}
        style={{ background: `radial-gradient(circle, ${MATRIX_COLOR}40 20%, transparent 70%)` }}
      />

      <a
        href={whatsappUrl}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative flex items-center justify-center ${sizeClasses[size]}
          bg-gradient-to-br from-zinc-950 to-black
          border-4 border-[#00FF41]/70
          rounded-3xl overflow-hidden
          transition-all duration-300 hover:scale-110 active:scale-95
          shadow-2xl shadow-black/90 hover:shadow-[0_0_60px_-10px] hover:shadow-[#00FF41]/60
        `}
        style={{ color: MATRIX_COLOR }}
        aria-label={`Abrir WhatsApp - ${label}`}
      >
        <MatrixPhoneIcon className="w-3/5 h-3/5 transition-transform duration-300" />

        {/* Energy ring */}
        <div className={`absolute inset-2 border border-[#00FF41]/30 rounded-2xl transition-all duration-500
          ${isHovered ? 'opacity-90 scale-95' : 'opacity-40'}`} 
        />
      </a>

      {/* Label */}
      {label && (
        <div
          className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 font-mono text-sm tracking-[4px] uppercase text-center transition-all
            ${isHovered ? 'opacity-100' : 'opacity-60'}`}
          style={{ color: MATRIX_COLOR, textShadow: `0 0 12px ${MATRIX_COLOR}80` }}
        >
          {label}
        </div>
      )}

      {/* Status */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        <div
          className={`w-3.5 h-3.5 rounded-full ${onlineStatus === 'online' ? 'animate-pulse' : ''}`}
          style={{ 
            backgroundColor: onlineStatus === 'online' ? MATRIX_COLOR : onlineStatus === 'away' ? '#F7931A' : '#ef4444',
            boxShadow: `0 0 10px ${onlineStatus === 'online' ? MATRIX_COLOR : ''}`
          }}
        />
        <span className="text-[10px] font-mono tracking-widest" style={{ color: MATRIX_COLOR }}>
          {onlineStatus.toUpperCase()}
        </span>
      </div>

      {/* Matrix Rain */}
      {enableMatrixRain && isHovered && !prefersReducedMotion && (
        <div className="absolute -inset-12 rounded-[4rem] overflow-hidden pointer-events-none -z-10">
          <MatrixRain active={isHovered} />
        </div>
      )}
    </div>
  );
}