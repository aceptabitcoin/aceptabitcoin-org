// Design System: "Bitcoin Matrix" v2.0 | Hydration-Safe Structure
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface CountdownTimerProps {
  targetDate: string;
  timezone: string;
  labels: { days: string; hours: string; minutes: string; seconds: string };
  className?: string;
  onComplete?: () => void;
  withContainer?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeLeft(targetDate: string, timezone: string): TimeLeft {
  try {
    const target = new Date(targetDate).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isExpired: false,
    };
  } catch {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
  }
}

function formatUnit(val: number) {
  return val.toString().padStart(2, "0");
}

export default function CountdownTimer({
  targetDate,
  timezone,
  labels,
  className = "",
  onComplete,
  withContainer = false,
}: CountdownTimerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false,
  });

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (!isMounted) return;
    const tick = () => {
      const next = calculateTimeLeft(targetDate, timezone);
      setTimeLeft(next);
      if (next.isExpired && onComplete) onComplete();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isMounted, targetDate, timezone, onComplete]);

  // 🟢 Componentes internos con estructura 100% estable
  const Unit = ({ value, label }: { value: number; label: string }) => (
    <span className="flex flex-col items-center">
      <span className={cn(
        "text-3xl md:text-4xl font-vt323 tabular-nums transition-colors duration-300",
        isMounted ? "text-[#FAFAFA]" : "text-transparent select-none"
      )}>
        {isMounted ? formatUnit(value) : "00"}
      </span>
      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mt-0.5">
        {label}
      </span>
    </span>
  );

  const Sep = () => (
    <span className="text-2xl md:text-3xl font-vt323 text-matrix/40">:</span>
  );

  // 🟡 Estado expirado (solo se muestra cuando ya montó)
  if (isMounted && timeLeft.isExpired) {
    return (
      <div className={cn("font-mono text-lg font-bold text-bitcoin drop-shadow-[0_0_15px_rgba(247,147,26,0.3)]", className)} role="status">
         ¡El hackathon ha comenzado!
      </div>
    );
  }

  //  Estructura de renderizado idéntica en SSR y CSR
  const content = (
    <div className={cn("font-mono flex items-center justify-center gap-3", className)} role="timer" aria-live="polite">
      <Unit value={timeLeft.days} label={labels.days} />
      <Sep />
      <Unit value={timeLeft.hours} label={labels.hours} />
      <Sep />
      <Unit value={timeLeft.minutes} label={labels.minutes} />
      <Sep />
      <Unit value={timeLeft.seconds} label={labels.seconds} />
    </div>
  );

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