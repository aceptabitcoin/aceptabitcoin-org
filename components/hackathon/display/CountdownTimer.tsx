// ============================================================
// COUNTDOWN TIMER — Hackathon Edition
// Acepta Bitcoin México | Oracle System v2.0
// Design System: "Bitcoin Matrix" v2.0
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface CountdownTimerProps {
  targetDate: string; // ISO 8601: "2026-06-05T09:00:00-06:00"
  timezone: string;   // IANA: "America/Mexico_City"
  labels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  className?: string;
  onComplete?: () => void;
  withContainer?: boolean; // 🎨 Opcional: envolver en glassmorphism card
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

// 🧠 Helper: Cálculo de tiempo con timezone awareness
function calculateTimeLeft(targetDate: string, timezone: string): TimeLeft {
  try {
    const target = new Date(targetDate).getTime();
    const now = new Date().toLocaleString("en-US", { timeZone: timezone });
    const currentTime = new Date(now).getTime();
    const difference = target - currentTime;
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  } catch (error) {
    console.error("[CountdownTimer] Error:", error);
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
  }
}

function formatUnit(value: number): string {
  return value.toString().padStart(2, "0");
}

export default function CountdownTimer({
  targetDate,
  timezone,
  labels,
  className = "",
  onComplete,
  withContainer = false,
}: CountdownTimerProps) {
  // ✅ isMounted guard: previene hydration mismatch (MANTENIMIENTO.md)
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const update = () => {
      const result = calculateTimeLeft(targetDate, timezone);
      setTimeLeft(result);
      if (result.isExpired && onComplete) onComplete();
    };
    
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isMounted, targetDate, timezone, onComplete]);

  // 🦴 Skeleton state: dimensiones fijas para evitar layout shift
  if (!isMounted) {
    return (
      <div className={cn("flex items-center justify-center gap-3", className)}>
        {[labels.days, labels.hours, labels.minutes, labels.seconds].map((label, i) => (
          <span key={label} className="flex flex-col items-center">
            <span className="w-14 h-12 bg-matrix/10 border border-matrix/20 rounded animate-pulse" />
            <span className="text-[9px] font-mono text-gray-600 mt-1 uppercase tracking-wider">
              {label}
            </span>
          </span>
        ))}
      </div>
    );
  }

  // ⚡ Expired state: mensaje con acento Bitcoin Orange
  if (timeLeft.isExpired) {
    return (
      <div 
        className={cn(
          "font-mono text-lg font-bold text-bitcoin",
          "drop-shadow-[0_0_15px_rgba(247,147,26,0.3)]",
          className
        )}
        role="status"
        aria-live="polite"
      >
        ⚡ ¡El hackathon ha comenzado!
      </div>
    );
  }

  // 🎨 Render principal alineado con DS
  const TimerUnit = ({ value, label }: { value: number; label: string }) => (
    <span className="flex flex-col items-center">
      <span className="text-3xl md:text-4xl font-vt323 text-[#FAFAFA] tabular-nums">
        {formatUnit(value)}
      </span>
      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mt-0.5">
        {label}
      </span>
    </span>
  );

  const content = (
    <div 
      className={cn(
        "font-mono flex items-center justify-center gap-3",
        "text-matrix", // Separadores en verde Matrix
        className
      )}
      suppressHydrationWarning
      role="timer"
      aria-live="polite"
      aria-label={`Tiempo restante: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
    >
      <TimerUnit value={timeLeft.days} label={labels.days} />
      <span className="text-2xl md:text-3xl font-vt323 text-matrix/40">:</span>
      <TimerUnit value={timeLeft.hours} label={labels.hours} />
      <span className="text-2xl md:text-3xl font-vt323 text-matrix/40">:</span>
      <TimerUnit value={timeLeft.minutes} label={labels.minutes} />
      <span className="text-2xl md:text-3xl font-vt323 text-matrix/40">:</span>
      <TimerUnit value={timeLeft.seconds} label={labels.seconds} />
    </div>
  );

  // 🎨 Opcional: envolver en glassmorphism card para Hero
  if (withContainer) {
    return (
      <div className={cn(
        "inline-flex items-center justify-center px-4 py-3 rounded-xl",
        "bg-black/80 backdrop-blur-md border border-white/10",
        "shadow-[0_0_20px_rgba(0,255,65,0.1)]",
        className
      )}>
        {content}
      </div>
    );
  }

  return content;
}