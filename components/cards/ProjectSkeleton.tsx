"use client";

import { Card } from "@/components/ui/card";

interface ProjectSkeletonProps {
  count?: number;
}

export default function ProjectSkeleton({ count = 4 }: ProjectSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="relative overflow-hidden bg-black/80 backdrop-blur-md border border-white/10 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Corner Accents - Matrix style (sutil en skeleton) */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-matrix/20" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-matrix/20" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-matrix/20" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-matrix/20" />

          {/* Image skeleton */}
          <div className="h-48 bg-white/5 relative overflow-hidden">
            {/* Scanline effect sutil */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-matrix/5 to-transparent animate-scanline" />
          </div>
          
          <div className="p-6 space-y-4">
            {/* Title Row */}
            <div className="flex items-center gap-3">
              {/* Logo placeholder */}
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10" />
              <div className="space-y-2 flex-1">
                <div className="w-32 h-4 bg-white/10 rounded" />
                <div className="w-20 h-3 bg-white/5 rounded" />
              </div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-white/10 rounded" />
              <div className="w-3/4 h-3 bg-white/5 rounded" />
            </div>

            {/* Tags skeleton */}
            <div className="flex gap-1.5">
              <div className="w-14 h-5 bg-white/5 rounded border border-white/10" />
              <div className="w-12 h-5 bg-white/5 rounded border border-white/10" />
              <div className="w-16 h-5 bg-white/5 rounded border border-white/10" />
            </div>

            {/* Button skeleton */}
            <div className="w-full h-9 bg-bitcoin/20 rounded-lg border border-bitcoin/30" />
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 pointer-events-none shadow-[0_0_20px_rgba(0,255,65,0.05)]" />
        </Card>
      ))}
    </>
  );
}