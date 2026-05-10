// ============================================================
// COUNTDOWN TIMER — Time remaining until event start
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: string | Date;
  timezone?: string;
  labels?: {
    days?: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
  };
  className?: string;
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, total: ms };
}

export default function CountdownTimer({
  targetDate,
  timezone,
  labels = { days: "DÍAS", hours: "HORAS", minutes: "MINUTOS", seconds: "SEGUNDOS" },
  className,
}: CountdownTimerProps) {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  
  const [time, setTime] = useState(() =>
    Math.max(0, target.getTime() - Date.now())
  );

  useEffect(() => {
    if (time <= 0) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, target.getTime() - Date.now());
      setTime(remaining);

      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  const { days, hours, minutes, seconds } = formatTime(time);

  if (time <= 0) {
    return (
      <div
        className={cn(
          "text-center font-vt323 text-3xl font-bold text-matrix",
          className
        )}
      >
        ¡El hackathon ha comenzado!
      </div>
    );
  }

  const units = [
    { value: days, label: labels.days || "DÍAS", color: "text-bitcoin" },
    { value: hours, label: labels.hours || "HORAS", color: "text-matrix" },
    { value: minutes, label: labels.minutes || "MIN", color: "text-bitcoin" },
    { value: seconds, label: labels.seconds || "SEG", color: "text-matrix" },
  ];

  return (
    <div className={cn("flex gap-4 md:gap-8 justify-center", className)}>
      {units.map((unit, idx) => (
        <div key={idx} className="text-center">
          <div
            className={`font-vt323 text-3xl md:text-5xl font-bold ${unit.color} drop-shadow-[0_0_15px_currentColor]`}
          >
            {String(unit.value).padStart(2, "0")}
          </div>
          <div className="font-mono text-[9px] uppercase text-gray-500 mt-1 tracking-widest">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}