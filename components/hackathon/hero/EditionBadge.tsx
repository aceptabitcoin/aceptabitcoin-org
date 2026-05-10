"use client";

import { cn } from "@/lib/utils";

interface EditionBadgeProps {
  text: string;
  variant?: "pulse" | "static";
}

export default function EditionBadge({ text, variant = "static" }: EditionBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-matrix/30 bg-matrix/5 backdrop-blur-sm">
      {variant === "pulse" && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-matrix opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-matrix"></span>
        </span>
      )}
      <span className="font-mono text-[10px] uppercase tracking-widest text-matrix font-bold">
        {text}
      </span>
    </div>
  );
}
