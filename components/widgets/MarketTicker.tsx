"use client";

import React, { useState, useEffect } from "react";
import { useMarketData } from "@/hooks/useMarketData";
import { Activity, Cpu, Zap, Box, TrendingUp } from "lucide-react";
import MatrixRain from "@/components/ui/MatrixRain";

export const MarketTicker = () => {
  const { data, loading, error } = useMarketData();
  const [currentTime, setCurrentTime] = useState("");

  // 🔹 Reloj MX correcto + anti-hydration mismatch
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("es-MX", {
          hour12: false,
          timeZone: "America/Mexico_City",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) return null;

  return (
    <div className="relative w-full bg-black/90 border-y border-matrix/30 backdrop-blur-md py-2.5 overflow-hidden h-14 flex items-center z-50">
      {/* Matrix Rain Background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <MatrixRain />
      </div>

      {/* Enhanced Scanlines — Design System Compliant */}
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,#00ff4122_0px,#00ff4122_1px,transparent_1px,transparent_4px)] opacity-40" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-matrix/10 to-transparent animate-scanline" />

      <div className="container mx-auto px-4 flex items-center justify-between gap-6 relative z-10 h-full">
        
        {/* Oracle Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            loading 
              ? "bg-matrix/60 animate-pulse" 
              : "bg-matrix shadow-[0_0_12px_#00FF41]"
          }`} />
          <div>
            <span className="font-mono text-[10px] text-matrix uppercase tracking-[0.125em] hidden sm:inline">
              ORACLE.SYSTEM
            </span>
            <span className="font-mono text-[10px] text-matrix/70 uppercase tracking-widest block sm:hidden">
              ONLINE
            </span>
          </div>
        </div>

        {/* Data Stream — Scroll horizontal en mobile */}
        <div className="flex-1 flex items-center justify-center md:justify-start gap-x-6 md:gap-x-8 overflow-x-auto pb-1 font-mono text-sm whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* BTC/USD */}
          <div className="flex items-center gap-2 group">
            <TrendingUp className="w-4 h-4 text-bitcoin group-hover:scale-110 transition-transform" />
            <span className="text-gray-500 text-xs">BTC/USD</span>
            <span className="text-bitcoin font-bold tabular-nums">
              {data ? `$${data.priceUsd.toLocaleString()}` : "———"}
            </span>
          </div>

          {/* BTC/MXN */}
          <div className="flex items-center gap-2 group">
            <span className="text-gray-500 text-xs">BTC/MXN</span>
            <span className="text-matrix font-medium tabular-nums">
              {data ? `$${data.priceMxn.toLocaleString()}` : "———"}
            </span>
          </div>

          {/* Fees */}
          <div className="flex items-center gap-2 group">
            <Zap className="w-4 h-4 text-matrix animate-pulse" />
            <span className="text-gray-500 text-xs">FEE</span>
            <span className="text-matrix">
              {data ? `${data.fees.fast} sat/vB` : "——"}
            </span>
          </div>

          {/* Block Height */}
          <div className="flex items-center gap-2 group">
            <Box className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 text-xs">BLOCK</span>
            <span className="text-white font-vt323 text-xl tracking-wider">
              {data ? data.blockHeight.toLocaleString() : "———"}
            </span>
          </div>

          {/* Hashrate — Desktop only */}
          <div className="hidden xl:flex items-center gap-2 group">
            <Cpu className="w-4 h-4 text-matrix/70" />
            <span className="text-gray-500 text-xs">HASH</span>
            <span className="text-matrix/80 font-medium">
              {data ? `${(data.hashrate / 1e18).toFixed(2)} EH/s` : "——"}
            </span>
          </div>
        </div>

        {/* System Time — México */}
        <div className="hidden md:flex items-center gap-2 shrink-0 font-mono text-right">
          <span className="text-[10px] text-gray-600">MX TIME</span>
          <span className="text-matrix/90 font-vt323 text-base tracking-widest tabular-nums">
            {currentTime || "00:00:00"}
          </span>
        </div>
      </div>

      {/* Bottom subtle line glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-matrix/40 to-transparent" />
    </div>
  );
};