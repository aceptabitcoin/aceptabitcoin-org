// ============================================================
// COUNTDOWN TIMER — Hackathon Edition
// Acepta Bitcoin México | Oracle System v2.0
// Design System: Cypherpunk Bank / Matrix Terminal
// ============================================================

"use client";

import { useState, useEffect, useMemo } from "react";

export interface CountdownTimerProps {
  targetDate: string; // ISO 8601 string (e.g., "2026-06-15T09:00:00-06:00")
  timezone: string;   // IANA timezone (e.g., "America/Mexico_City")
  labels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  className?: string;
  onComplete?: () => void; // Callback when countdown reaches zero
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

// Helper: Calculate time difference with timezone awareness
function calculateTimeLeft(targetDate: string, timezone: string): TimeLeft {
  try {
    // Parse target date in the specified timezone
    const target = new Date(targetDate).getTime();
    
    // Get current time in the same timezone (for consistency)
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
    console.error("[CountdownTimer] Error calculating time:", error);
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
  }
}

// Helper: Format number with leading zero for display
function formatUnit(value: number): string {
  return value.toString().padStart(2, "0");
}

export default function CountdownTimer({
  targetDate,
  timezone,
  labels,
  className = "",
  onComplete,
}: CountdownTimerProps) {
  // ✅ isMounted guard: prevents hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  // Mount effect: only run client-side logic after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Timer effect: update every second (only after mount)
  useEffect(() => {
    if (!isMounted) return;

    // Initial calculation
    const update = () => {
      const result = calculateTimeLeft(targetDate, timezone);
      setTimeLeft(result);
      
      // Trigger callback if expired
      if (result.isExpired && onComplete) {
        onComplete();
      }
    };

    update(); // Run immediately
    const interval = setInterval(update, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup
  }, [isMounted, targetDate, timezone, onComplete]);

  // ✅ Skeleton state: matches final layout dimensions to prevent layout shift
  if (!isMounted) {
    return (
      <div 
        className={`font-mono text-2xl text-matrix flex items-center justify-center gap-2 ${className}`}
        aria-label="Cargando contador"
      >
        {/* Days */}
        <span className="flex flex-col items-center">
          <span className="inline-block w-12 h-10 bg-matrix/10 border border-matrix/20 rounded animate-pulse" />
          <span className="text-[10px] text-gray-600 mt-1">{labels.days}</span>
        </span>
        <span className="text-matrix/30">:</span>
        
        {/* Hours */}
        <span className="flex flex-col items-center">
          <span className="inline-block w-12 h-10 bg-matrix/10 border border-matrix/20 rounded animate-pulse" />
          <span className="text-[10px] text-gray-600 mt-1">{labels.hours}</span>
        </span>
        <span className="text-matrix/30">:</span>
        
        {/* Minutes */}
        <span className="flex flex-col items-center">
          <span className="inline-block w-12 h-10 bg-matrix/10 border border-matrix/20 rounded animate-pulse" />
          <span className="text-[10px] text-gray-600 mt-1">{labels.minutes}</span>
        </span>
        <span className="text-matrix/30">:</span>
        
        {/* Seconds */}
        <span className="flex flex-col items-center">
          <span className="inline-block w-12 h-10 bg-matrix/10 border border-matrix/20 rounded animate-pulse" />
          <span className="text-[10px] text-gray-600 mt-1">{labels.seconds}</span>
        </span>
      </div>
    );
  }

  // ✅ Expired state: show message instead of zeros
  if (timeLeft.isExpired) {
    return (
      <div 
        className={`font-mono text-xl text-bitcoin font-bold ${className}`}
        role="status"
        aria-live="polite"
      >
        ⚡ ¡El hackathon ha comenzado!
      </div>
    );
  }

  // ✅ Render final countdown
  return (
    <div 
      className={`font-mono text-2xl text-matrix flex items-center justify-center gap-2 ${className}`}
      suppressHydrationWarning // Defensive: minor timestamp differences
      role="timer"
      aria-live="polite"
      aria-label={`Tiempo restante: ${timeLeft.days} días, ${timeLeft.hours} horas, ${timeLeft.minutes} minutos, ${timeLeft.seconds} segundos`}
    >
      {/* Days */}
      <span className="flex flex-col items-center">
        <span className="text-3xl font-vt323 text-white tabular-nums">
          {formatUnit(timeLeft.days)}
        </span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
          {labels.days}
        </span>
      </span>
      
      <span className="text-matrix/40 text-2xl font-vt323">:</span>
      
      {/* Hours */}
      <span className="flex flex-col items-center">
        <span className="text-3xl font-vt323 text-white tabular-nums">
          {formatUnit(timeLeft.hours)}
        </span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
          {labels.hours}
        </span>
      </span>
      
      <span className="text-matrix/40 text-2xl font-vt323">:</span>
      
      {/* Minutes */}
      <span className="flex flex-col items-center">
        <span className="text-3xl font-vt323 text-white tabular-nums">
          {formatUnit(timeLeft.minutes)}
        </span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
          {labels.minutes}
        </span>
      </span>
      
      <span className="text-matrix/40 text-2xl font-vt323">:</span>
      
      {/* Seconds */}
      <span className="flex flex-col items-center">
        <span className="text-3xl font-vt323 text-white tabular-nums animate-pulse">
          {formatUnit(timeLeft.seconds)}
        </span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
          {labels.seconds}
        </span>
      </span>
    </div>
  );
}