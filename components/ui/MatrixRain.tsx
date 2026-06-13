'use client';

import { useEffect, useRef, useCallback, useState } from "react";

// ============================================================
// MATRIX RAIN — The Falling Code Effect (Optimized for Breathing Room)
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

interface MatrixRainProps {
  className?: string;
  speed?: number;        // Multiplicador de velocidad de caída (default: 1)
  opacity?: number;      // Opacidad base para la estela (default: 0.08)
  color?: string;        // Color del tema activo (ej: #F7931A, #00FF41)
}

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/=[]{}";

export default function MatrixRain({
  className = "",
  speed = 1,
  opacity = 0.08, // Reducido por defecto para menos saturación
  color = "#00FF41",
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const dropsRef = useRef<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const initDrops = useCallback((columns: number) => {
    // Inicializamos las gotas en posiciones aleatorias negativas para que no caigan todas de golpe
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
    // CAMBIO: Aumentamos el tamaño de fuente para espaciar las columnas (más "aire")
    const fontSize = 18; 

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
      // CAMBIO: Aumentamos la opacidad del "borrado" (0.15) para que el rastro sea más corto y limpio
      ctx.fillStyle = `rgba(0, 0, 0, 0.15)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Fira Code', monospace`;

      for (let i = 0; i < dropsRef.current.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = dropsRef.current[i] * fontSize;

        if (y < 0) {
          dropsRef.current[i] += speed * (0.5 + Math.random() * 0.5);
          continue;
        }

        // Determinar si es la "cabeza" de la gota (el carácter más reciente)
        const isHead = Math.random() > 0.95; 

        if (isHead) {
          // --- Cabecera Brillante ---
          ctx.fillStyle = "#FFFFFF"; // Blanco puro para máximo contraste
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;       // Glow intenso solo en la cabeza
          ctx.globalAlpha = 1.0;
        } else {
          // --- Estela Tenue ---
          ctx.fillStyle = color;
          ctx.shadowBlur = 0;        // Sin glow en la estela para no saturar
          ctx.globalAlpha = opacity; // Muy transparente
        }

        ctx.fillText(char, x, y);

        // Resetear propiedades
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;

        // Reiniciar la gota al llegar al fondo con aleatoriedad
        if (y > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }

        // Progreso de caída
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