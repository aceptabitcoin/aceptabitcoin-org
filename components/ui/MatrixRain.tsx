'use client';

import { useEffect, useRef, useCallback, useState } from "react";

// ============================================================
// MATRIX RAIN — The Falling Code Effect (With White Glowing Head)
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

interface MatrixRainProps {
  className?: string;
  speed?: number;        // Multiplicador de velocidad de caída (default: 1)
  opacity?: number;      // Opacidad base para la estela (default: 0.12)
  color?: string;        // Color del tema activo (ej: #F7931A, #00FF41)
}

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/=[]{}";

export default function MatrixRain({
  className = "",
  speed = 1,
  opacity = 0.12,
  color = "#00FF41",
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const dropsRef = useRef<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const initDrops = useCallback((columns: number) => {
    dropsRef.current = Array.from({ length: columns }, () => Math.random() * -100);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let columns = 0;
    const fontSize = 14;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      columns = Math.floor(canvas.width / fontSize);
      initDrops(columns);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      // 1. Efecto de desvanecimiento de la estela
      ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Fira Code', monospace`;

      for (let i = 0; i < dropsRef.current.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = dropsRef.current[i] * fontSize;

        // Omitir dibujar si la gota está muy arriba fuera de la pantalla
        if (y < 0) {
          dropsRef.current[i] += speed * (0.5 + Math.random() * 0.5);
          continue;
        }

        // Determinar si es la "cabeza" de la gota
        const isHead = Math.random() > 0.93; 

        if (isHead) {
          // --- EFECTO PELÍCULA: Cabecera brillante casi blanca ---
          ctx.fillStyle = "#FAFAFA"; 
          ctx.shadowColor = color;
          ctx.shadowBlur = 8 + Math.random() * 4; // Glow variable para realismo CRT
          ctx.globalAlpha = 1.0;
        } else {
          // --- Estela estándar con color temático ---
          ctx.fillStyle = color;
          ctx.shadowBlur = 0;
          ctx.globalAlpha = opacity * 1.8;
        }

        ctx.fillText(char, x, y);

        // Resetear propiedades globales para la siguiente iteración
        ctx.shadowBlur = 0;
        ctx.globalAlpha = opacity;

        // Reiniciar la gota al llegar al fondo
        if (y > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }

        // Progreso de caída con aleatoriedad fluida
        dropsRef.current[i] += speed * (0.5 + Math.random() * 0.5);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [speed, opacity, color, initDrops, isMounted]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}