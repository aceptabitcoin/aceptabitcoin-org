// ============================================================
// LOADING STATE — Skeleton/placeholder loading
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { cn } from "@/lib/utils";

export default function LoadingState({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8 animate-pulse", className)}>
      {/* Hero Skeleton */}
      <div className="hackathon-card p-8">
        <div className="h-8 w-3/4 bg-gray-700 rounded mb-4" />
        <div className="h-4 w-1/2 bg-gray-800 rounded mb-6" />
        <div className="h-20 bg-gray-800 rounded mb-4" />
        <div className="flex gap-4">
          <div className="h-12 w-40 bg-gray-700 rounded" />
          <div className="h-12 w-40 bg-gray-800 rounded" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="hackathon-card p-4">
            <div className="h-6 w-16 bg-gray-700 rounded mb-2" />
            <div className="h-4 w-20 bg-gray-800 rounded" />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="hackathon-card p-6 space-y-4">
            <div className="h-6 w-2/3 bg-gray-700 rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-800 rounded w-full" />
              <div className="h-4 bg-gray-800 rounded w-4/5" />
              <div className="h-4 bg-gray-800 rounded w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}