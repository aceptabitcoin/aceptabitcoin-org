"use client";

import { useEffect, useState } from "react";
import MatrixRain from "@/components/ui/MatrixRain";

export default function MatrixHeroBackground({ enabled = true }: { enabled?: boolean }) {
  if (!enabled) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <MatrixRain />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
    </div>
  );
}
