'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

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
}

// ─────────────────────────────────────────────────────────────
// Icono Matrix Phone (SVG custom, reutilizable)
// ─────────────────────────────────────────────────────────────
export const MatrixPhoneIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
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
// Hook: Feedback Háptico + Audio Arcade (con guard de privacidad)
// ─────────────────────────────────────────────────────────────
const useArcadeFeedback = (enableSound: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const triggerHaptic = useCallback(() => {
    if (prefersReducedMotion) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([8, 18, 6]); // Patrón arcade sutil
    }
  }, [prefersReducedMotion]);

  const playClick = useCallback(() => {
    if (!enableSound || prefersReducedMotion || typeof window === 'undefined') return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'square';
      osc.frequency.setValueAtTime(920, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.095);

      filter.type = 'lowpass';
      filter.frequency.value = 1400;

      gain.gain.setValueAtTime(0.13, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.135);

      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Fail silently: audio no es crítico
    }
  }, [enableSound, prefersReducedMotion]);

  const triggerFullFeedback = useCallback(() => {
    playClick();
    triggerHaptic();
  }, [playClick, triggerHaptic]);

  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return { triggerFullFeedback };
};

// ─────────────────────────────────────────────────────────────
// Matrix Rain Canvas (con soporte prefers-reduced-motion)
// ─────────────────────────────────────────────────────────────
const MatrixRain = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

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
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
      aria-hidden="true"
    />
  );
};

// ─────────────────────────────────────────────────────────────
// Componente Principal: MatrixArcadeWhatsApp
// ─────────────────────────────────────────────────────────────
export default function MatrixArcadeWhatsApp({
  phoneNumber,
  message = '',
  label = 'CONECTAR CON LA MATRIX',
  size = 'lg',
  enableMatrixRain = true,
  enableSound = false, // 🔇 Desactivado por defecto (UX friendly)
  onlineStatus = 'online',
  lastSeen,
  className = '',
  onOpen,
}: MatrixArcadeWhatsAppProps) {
  const { triggerFullFeedback } = useArcadeFeedback(enableSound);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  // Mapeo de tamaños con clases Tailwind DS v2.0
  const sizeClasses = {
    sm: 'w-16 h-16 text-xl',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-28 h-28 text-4xl',
  };

  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  // Handler inteligente: App nativa → Web fallback
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      triggerFullFeedback();

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isMobile) {
        e.preventDefault();
        const appUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message || '')}`;
        window.location.href = appUrl;

        // Fallback a web si la app no se abre en 1.6s
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

  // Clases dinámicas alineadas a DS v2.0
  const glowClass = isHovered
    ? 'shadow-[var(--matrix-glow-hover)]'
    : 'shadow-[var(--matrix-glow)]';

  const borderClass = isHovered ? 'border-[var(--matrix)]/70' : 'border-[var(--matrix)]/40';

  return (
    <div className={`relative inline-block ${className}`} data-component="matrix-whatsapp">
      {/* Matrix Rain (solo si está activo y el usuario permite animaciones) */}
      {enableMatrixRain && !prefersReducedMotion && (
        <div className="absolute -inset-12 rounded-[4rem] overflow-hidden">
          <MatrixRain active={isHovered} />
        </div>
      )}

      {/* Glow exterior con CSS vars del DS v2.0 */}
      <div
        className={`absolute -inset-6 rounded-full transition-all duration-500 pointer-events-none ${
          isHovered && !prefersReducedMotion ? 'opacity-100 blur-3xl scale-110' : 'opacity-60 blur-2xl'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(0,255,65,0.75) 15%, rgba(0,200,60,0.25) 50%, transparent 80%)',
        }}
      />

      {/* Botón Principal */}
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
          border-[5px] ${borderClass}
          rounded-3xl overflow-hidden
          transition-all duration-300 ease-out
          ${!prefersReducedMotion ? 'hover:scale-110 active:scale-95' : ''}
          focus:outline-none focus:ring-4 focus:ring-[var(--matrix)]/50
          ${glowClass}
          group
        `}
        aria-label={`Abrir WhatsApp con ${label}`}
      >
        {/* Scanlines overlay */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#00000022_0px,#00000022_1px,transparent_1px,transparent_3px)] pointer-events-none" />

        {/* Scanline animation */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-30 pointer-events-none"
          style={{
            animation: prefersReducedMotion
              ? 'none'
              : isHovered
              ? 'scanline 1.6s linear infinite'
              : 'scanline 4s linear infinite',
          }}
        />

        {/* Icono con color DS v2.0 */}
        <MatrixPhoneIcon
          className={`
            w-3/5 h-3/5 transition-all duration-300 drop-shadow-[0_0_20px_var(--matrix)]
            ${isHovered ? 'text-[var(--matrix)]/90 scale-110' : 'text-[var(--matrix)]'}
          `}
        />

        {/* Energy ring */}
        <div
          className={`absolute inset-[6px] border border-[var(--matrix)]/30 rounded-[20px] transition-all duration-700 ${
            isHovered && !prefersReducedMotion ? 'opacity-90 scale-95' : 'opacity-20'
          }`}
        />

        {/* Partículas (solo si no hay reduced motion) */}
        {isHovered && !prefersReducedMotion && (
          <>
            {[...Array(7)].map((_, i) => (
              <span
                key={i}
                className="absolute w-1.5 h-1.5 bg-[var(--matrix)] rounded-full animate-ping"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </>
        )}
      </a>

      {/* Label con tipografía DS v2.0 */}
      {label && (
        <div
          className={`
            absolute top-full mt-4 left-1/2 -translate-x-1/2
            font-mono text-[var(--matrix)] text-sm tracking-[4px] uppercase
            transition-all duration-300 drop-shadow-[0_0_12px_var(--matrix)]
            ${isHovered && !prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-2'}
          `}
        >
          <span className="text-[var(--matrix)]/80 mr-1">{'> '}</span> {label}
        </div>
      )}

      {/* Indicador de estado (DS v2.0 compliant) */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        <div
          className={`w-3 h-3 rounded-full shadow-[0_0_12px_currentColor] transition-colors ${
            onlineStatus === 'online'
              ? 'bg-[var(--matrix)] animate-pulse text-[var(--matrix)]'
              : onlineStatus === 'away'
              ? 'bg-[var(--bitcoin)] text-[var(--bitcoin)]'
              : 'bg-red-500 animate-none text-red-500'
          }`}
        />
        <span className="text-[10px] font-mono text-[var(--matrix)]/80 tracking-widest">
          {onlineStatus.toUpperCase()}
          {lastSeen && onlineStatus !== 'online' && ` • ${lastSeen}`}
        </span>
      </div>

      {/* Keyframes globales (solo se inyectan una vez) */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes scanline {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        }
      `}</style>
    </div>
  );
}