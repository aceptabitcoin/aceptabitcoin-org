'use client';

import { useEffect, useRef, useCallback, useState } from "react";

interface MatrixRainProps {
  className?: string;
  speed?: number;        // 0.6 ~ 1.0 recomendado
  opacity?: number;      // Opacidad base de la estela (0.05 - 0.12)
  color?: string;        // Color principal de la lluvia (estela)
  headColor?: string;    // Color de las cabezas brillantes
  fadeRate?: number;     // Qué tan rápido se borra el fondo (más alto = estela más corta)
}

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/=[]{}";

export default function MatrixRain({
  className = "",
  speed = 0.75,
  opacity = 0.085,
  color = "#00FF41",
  headColor = "#FFFFFF",
  fadeRate = 0.12,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const dropsRef = useRef<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const initDrops = useCallback((columns: number) => {
    dropsRef.current = Array.from({ length: columns }, () => Math.random() * -150);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let columns = 0;
    const fontSize = 16; 

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent || parent.offsetWidth === 0) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      columns = Math.floor(canvas.width / fontSize);
      initDrops(columns);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      // Fondo con fade sutil → estela más persistente y elegante
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeRate})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Fira Code', monospace`;

      for (let i = 0; i < dropsRef.current.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = dropsRef.current[i] * fontSize;

        if (y < 0) {
          dropsRef.current[i] += speed * (0.6 + Math.random() * 0.6);
          continue;
        }

        // CORRECCIÓN: Como solo dibujamos un carácter por columna por frame, 
        // este carácter SIEMPRE es la cabeza de la gota.
        // Usamos el headColor con opacidad 1 para que brille.
        ctx.fillStyle = headColor;
        ctx.shadowColor = color; // Brillo verde alrededor de la cabeza blanca
        ctx.shadowBlur = 8;      // Glow solo en la cabeza (mucho más ligero que antes)
        ctx.globalAlpha = 1;

        ctx.fillText(char, x, y);

        // Reset de estado del canvas
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;

        // Reinicio con más naturalidad
        if (y > canvas.height && Math.random() > 0.96) {
          dropsRef.current[i] = Math.random() * -50;
        }

        dropsRef.current[i] += speed * (0.4 + Math.random() * 0.8);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [speed, opacity, color, headColor, fadeRate, initDrops, isMounted]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none select-none ${className}`}
      style={{ zIndex: 0, mixBlendMode: "screen" }}
    />
  );
}