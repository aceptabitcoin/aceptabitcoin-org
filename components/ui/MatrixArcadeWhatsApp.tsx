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
// Icono Matrix Phone (SVG custom, DS v2.0)
// ─────────────────────────────────────────────────────────────
export const MatrixPhoneIcon = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <rect x="7" y="4" width="10" height="14" rx="1.5" fill="currentColor" opacity="0.25" />
    <rect x="9" y="3" width="6" height="1.2" rx="0.6" fill="currentColor" />
    <circle cx="12" cy="19.5" r="1.1" fill="currentColor" />
    <path d="M8 11 Q12 7 16 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    <path d="M6.5 13 Q12 8 17.5 13" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Hook: Feedback Háptico + Audio (con prefers-reduced-motion)
// ─────────────────────────────────────────────────────────────
const useArcadeFeedback = (enableSound: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const triggerFullFeedback = useCallback(() => {
    if (prefersReducedMotion) return;

    // Haptic
    if ('vibrate' in navigator) navigator.vibrate([8, 18, 6]);

    // Audio (solo si está habilitado)
    if (!enableSound) return;
    try {
      const ctx =
        audioContextRef.current ||
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
    } catch {
      // Fail silently
    }
  }, [enableSound, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return { triggerFullFeedback };
};

// ─────────────────────────────────────────────────────────────
// Matrix Rain Canvas (completo + prefers-reduced-motion)
// ─────────────────────────────────────────────────────────────
const MatrixRain = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    if (!active || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    let animationId: number;
    let lastTime = 0;
    const fps = 28;

    const draw = (timestamp: number) => {
      if (timestamp - lastTime < 1000 / fps) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastTime = timestamp;

      ctx.fillStyle = 'rgba(0, 8, 0, 0.085)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const alpha = 0.45 + Math.random() * 0.55;
        // ✅ FALLBACK: usa hex si la CSS var no está disponible
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.972) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
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
// Componente Principal: MatrixArcadeWhatsApp (CORREGIDO)
// ─────────────────────────────────────────────────────────────
export default function MatrixArcadeWhatsApp({
  phoneNumber,
  message = '',
  label = 'CONECTAR CON LA MATRIX',
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
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // ✅ FALLBACK: Define colores hex como respaldo si CSS vars fallan
  const MATRIX_HEX = '#00FF41';
  const MATRIX_RGBA = 'rgba(0, 255, 65,';

  const sizeClasses = {
    sm: 'w-16 h-16 text-xl',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-28 h-28 text-4xl',
  };

  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      triggerFullFeedback();

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        e.preventDefault();
        const appUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message || '')}`;
        window.location.href = appUrl;

        setTimeout(() => {
          if (document.visibilityState === 'visible') {
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
          }
        }, 1600);
      } else {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }

      onOpen?.();
    },
    [triggerFullFeedback, cleanPhone, message, whatsappUrl, onOpen]
  );

  return (
    <div
      className={`
        ${floating ? 'fixed bottom-6 right-6 z-50' : 'relative inline-block'}
        ${className}
      `}
      data-component="matrix-whatsapp"
      style={{ '--matrix-fallback': MATRIX_HEX } as React.CSSProperties}
    >
      {/* ✅ Glow exterior con fallback hex */}
      <div
        className={`absolute -inset-8 rounded-full transition-all duration-500 pointer-events-none
          ${isHovered && !prefersReducedMotion ? 'opacity-100 scale-110 blur-2xl' : 'opacity-40 blur-xl'}`}
        style={{
          background: `radial-gradient(circle, ${MATRIX_RGBA}0.6) 20%, transparent 70%)`,
          boxShadow: `0 0 30px ${MATRIX_RGBA}0.4)`,
        }}
      />

      {/* ✅ Botón principal con fallbacks */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative flex items-center justify-center
          ${sizeClasses[size]}
          bg-gradient-to-br from-zinc-950 via-black to-zinc-950
          border-[5px] border-[#00FF41]/60
          rounded-3xl overflow-hidden
          transition-all duration-300 ease-out
          ${!prefersReducedMotion ? 'hover:scale-110 active:scale-95' : ''}
          focus:outline-none focus:ring-4 focus:ring-[#00FF41]/50
          shadow-[0_0_20px_rgba(0,255,65,0.3)]
          hover:shadow-[0_0_50px_rgba(0,255,65,0.6)]
          group
        `}
        aria-label={`Abrir WhatsApp con ${label}`}
      >
        {/* Scanlines sutiles */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#00000033_0px,#00000033_2px,transparent_2px,transparent_4px)] pointer-events-none" />

        {/* ✅ Icono con color fallback */}
        <MatrixPhoneIcon
          className={`
            w-3/5 h-3/5 transition-all duration-300
            ${isHovered ? 'scale-110' : ''}
          `}
          style={{
            color: MATRIX_HEX,
            filter: `drop-shadow(0 0 20px ${MATRIX_RGBA}0.8))`,
          }}
        />

        {/* ✅ Energy ring con fallback */}
        <div
          className={`absolute inset-[5px] border border-[#00FF41]/40 rounded-[18px] transition-all duration-500
            ${isHovered && !prefersReducedMotion ? 'opacity-80 scale-95' : 'opacity-30'}`}
        />

        {/* ✅ Partículas (solo si no hay reduced motion) */}
        {isHovered && !prefersReducedMotion && (
          <>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="absolute w-1 h-1 rounded-full animate-ping"
                style={{
                  backgroundColor: MATRIX_HEX,
                  top: `${25 + Math.random() * 50}%`,
                  left: `${25 + Math.random() * 50}%`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: `${1.2 + Math.random() * 0.8}s`,
                }}
              />
            ))}
          </>
        )}
      </a>

      {/* ✅ Label con fallback de color */}
      {label && (
        <div
          className={`
            absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap
            font-mono text-xs tracking-[3px] uppercase
            transition-all duration-300
            ${isHovered && !prefersReducedMotion ? 'opacity-100' : 'opacity-70'}
          `}
          style={{ color: MATRIX_HEX, textShadow: `0 0 8px ${MATRIX_RGBA}0.7)` }}
        >
          <span style={{ color: `${MATRIX_RGBA}0.7)` }}>{'> '}</span> {label}
        </div>
      )}

      {/* ✅ Status indicator con fallback */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        <div
          className={`w-3 h-3 rounded-full transition-all ${
            onlineStatus === 'online'
              ? 'animate-pulse'
              : onlineStatus === 'away'
              ? 'bg-[#F7931A]'
              : 'bg-red-500 animate-none'
          }`}
          style={{
            backgroundColor: onlineStatus === 'online' ? MATRIX_HEX : undefined,
            boxShadow: `0 0 10px ${MATRIX_RGBA}0.8)`,
          }}
        />
        <span
          className="text-[9px] font-mono tracking-widest"
          style={{ color: `${MATRIX_RGBA}0.8)` }}
        >
          {onlineStatus.toUpperCase()}
          {lastSeen && onlineStatus !== 'online' && ` • ${lastSeen}`}
        </span>
      </div>

      {/* ✅ Matrix Rain (solo hover + si permite animaciones) */}
      {enableMatrixRain && !prefersReducedMotion && isHovered && (
        <div className="absolute -inset-16 rounded-[4rem] overflow-hidden pointer-events-none -z-10">
          <MatrixRain active={isHovered} />
        </div>
      )}
    </div>
  );
}