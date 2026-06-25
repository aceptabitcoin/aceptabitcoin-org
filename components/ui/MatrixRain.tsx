'use client';

import { useEffect, useRef } from "react";

interface MatrixRainProps {
  speed?: number;
  opacity?: number;
  className?: string;
  color?: string;
}

export default function MatrixRain({
  speed = 0.5,
  opacity = 0.1,
  className = "",
  color = "#00ff41",
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let columns: number[];
    let drops: number[];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth ?? window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight ?? window.innerHeight;
      const colCount = Math.floor(canvas.width / 14);
      columns = Array.from({ length: colCount }, () => Math.random() * -100);
      drops = Array.from({ length: colCount }, () => Math.random() * -50);
    };

    resize();
    window.addEventListener("resize", resize);

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*()_+-=[]{}|;:,.<>?";

    const draw = () => {
      ctx!.fillStyle = `rgba(0, 0, 0, 0.05)`;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      ctx!.font = "14px monospace";

      for (let i = 0; i < columns.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 14;
        const y = drops[i] * 14;

        ctx!.fillStyle = color;
        ctx!.globalAlpha = opacity;
        ctx!.fillText(char, x, y);

        drops[i] += 0.5 * speed;

        if (drops[i] * 14 > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }

      ctx!.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [speed, opacity, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
