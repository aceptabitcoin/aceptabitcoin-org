'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Coins, DollarSign, Bitcoin, Activity, Zap, Terminal, Radio } from "lucide-react";

export default function PriceConverter() {
  const [isMounted, setIsMounted] = useState(false);
  const [prices, setPrices] = useState<{ usd: number; mxn: number }>({
    usd: 0,
    mxn: 0,
  });
  const [loading, setLoading] = useState(true);

  // 🪙 LA FUENTE DE LA VERDAD ÚNICA: Todo el componente se calcula en base a esta cantidad de BTC
  const [btcAmount, setBtcAmount] = useState<number>(1);

  // Guardián para prevenir errores de hidratación en Next.js
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch de precios síncrono y periódico
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=mxn,usd",
          { next: { revalidate: 45 } }
        );
        const data = await res.json();

        if (data?.bitcoin?.usd && data?.bitcoin?.mxn) {
          setPrices({
            usd: data.bitcoin.usd,
            mxn: data.bitcoin.mxn,
          });
        }
      } catch (error) {
        console.error("Error fetching prices, usando valores de respaldo.");
        setPrices({ usd: 105000, mxn: 2050000 });
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 45000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return null;

  // 🧮 Cálculos derivados en tiempo de Render
  const currentUsdPrice = prices.usd || 105000;
  const currentMxnPrice = prices.mxn || 2050000;

  const usdValue = btcAmount * currentUsdPrice;
  const mxnValue = btcAmount * currentMxnPrice;
  const satsValue = Math.round(btcAmount * 100_000_000);

  // ⚡ Handlers de conversión encadenados globales
  const handleBtcChange = (val: string) => {
    const num = parseFloat(val);
    setBtcAmount(isNaN(num) ? 0 : num);
  };

  const handleUsdChange = (val: string) => {
    const num = parseFloat(val);
    setBtcAmount(isNaN(num) || currentUsdPrice === 0 ? 0 : num / currentUsdPrice);
  };

  const handleMxnChange = (val: string) => {
    const num = parseFloat(val);
    setBtcAmount(isNaN(num) || currentMxnPrice === 0 ? 0 : num / currentMxnPrice);
  };

  const handleSatsChange = (val: string) => {
    const num = parseFloat(val);
    setBtcAmount(isNaN(num) ? 0 : num / 100_000_000);
  };

  // Helper para mostrar cadenas vacías en lugar de '0' cuando el usuario borra el campo
  const formatValue = (val: number) => (val === 0 ? "" : val);

  return (
    <Card className="relative overflow-hidden border border-white/10 bg-black/80 backdrop-blur-md p-6 sm:p-8 shadow-[0_0_40px_rgba(0,255,65,0.1)]">
      {/* Background Grid - Design System Spec */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.15)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40 pointer-events-none" />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.02)_50%)] bg-[length:100%_4px] pointer-events-none animate-scanline opacity-30" />

      <div className="relative z-10">
        {/* Header - Enhanced Terminal Style */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-matrix/20">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-matrix/10 border-2 border-matrix/40 flex items-center justify-center shadow-[0_0_25px_rgba(0,255,65,0.3)] relative">
              <Terminal className="h-7 w-7 text-matrix" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-matrix rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,65,0.8)]" />
            </div>
            <div>
              <h3 className="font-serif text-3xl font-bold tracking-tight text-[#FAFAFA] drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                Oracle de Precios
              </h3>
              <p className="font-mono text-xs text-matrix tracking-wider flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 bg-matrix rounded-full animate-pulse" />
                CONVERSIÓN ENCADENADA • TIEMPO REAL
              </p>
            </div>
          </div>

          {!loading && prices.usd > 0 && (
            <div className="text-right bg-black/60 border border-matrix/30 rounded-lg px-4 py-3 shadow-[0_0_15px_rgba(0,255,65,0.15)]">
              <div className="text-[10px] text-matrix/70 font-mono uppercase tracking-wider mb-1">BTC/USD SPOT</div>
              <div className="font-mono text-2xl font-bold text-matrix tabular-nums">
                ${prices.usd.toLocaleString("en-US")}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* 1. BTC ↔ USD - PRIMARY ROW (Bitcoin Orange) */}
          <div className="group relative">
            {/* Section Label - VT323 for technical metadata */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-bitcoin/10 border border-bitcoin/30 flex items-center justify-center shadow-[0_0_10px_rgba(247,147,26,0.2)]">
                <Bitcoin className="h-5 w-5 text-bitcoin" />
              </div>
              <div>
                <span className="font-vt323 text-xl text-bitcoin tracking-wider">BITCOIN ↔ DÓLAR</span>
                <span className="block text-[10px] font-mono text-gray-500 uppercase mt-0.5">Conversión Principal</span>
              </div>
            </div>
            
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center bg-gradient-to-br from-bitcoin/5 to-transparent border-2 border-bitcoin/30 rounded-2xl p-6 hover:border-bitcoin/60 hover:shadow-[0_0_30px_rgba(247,147,26,0.3)] transition-all duration-500">
              <div className="space-y-2">
                <Input
                  type="number"
                  step="0.00000001"
                  placeholder="0.00"
                  value={formatValue(btcAmount)}
                  onChange={(e) => handleBtcChange(e.target.value)}
                  className="h-16 bg-black/60 border-2 border-white/20 font-mono text-2xl sm:text-3xl font-bold focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/50 text-[#FAFAFA] placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-inner"
                />
                <p className="text-center text-xs text-bitcoin/80 font-vt323 tracking-wider uppercase">BTC</p>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="text-bitcoin font-mono text-2xl">⇄</div>
                <div className="text-[9px] text-gray-500 font-mono">SPOT</div>
              </div>
              
              <div className="space-y-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formatValue(Number(usdValue.toFixed(2)))}
                  onChange={(e) => handleUsdChange(e.target.value)}
                  className="h-16 bg-black/60 border-2 border-white/20 font-mono text-2xl sm:text-3xl font-bold focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/50 text-[#FAFAFA] placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-inner"
                />
                <p className="text-center text-xs text-bitcoin/80 font-vt323 tracking-wider uppercase">USD</p>
              </div>
            </div>
          </div>

          {/* 2. BTC ↔ MXN - SECONDARY ROW (Bitcoin Orange) */}
          <div className="group relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-bitcoin/10 border border-bitcoin/30 flex items-center justify-center shadow-[0_0_10px_rgba(247,147,26,0.2)]">
                <Bitcoin className="h-5 w-5 text-bitcoin" />
              </div>
              <div>
                <span className="font-vt323 text-xl text-bitcoin tracking-wider">BITCOIN ↔ PESOS</span>
                <span className="block text-[10px] font-mono text-gray-500 uppercase mt-0.5">Mercado Mexicano</span>
              </div>
            </div>
            
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center bg-gradient-to-br from-bitcoin/5 to-transparent border-2 border-bitcoin/30 rounded-2xl p-6 hover:border-bitcoin/60 hover:shadow-[0_0_30px_rgba(247,147,26,0.3)] transition-all duration-500">
              <div className="space-y-2">
                <Input
                  type="number"
                  step="0.00000001"
                  placeholder="0.00"
                  value={formatValue(btcAmount)}
                  onChange={(e) => handleBtcChange(e.target.value)}
                  className="h-16 bg-black/60 border-2 border-white/20 font-mono text-2xl sm:text-3xl font-bold focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/50 text-[#FAFAFA] placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-inner"
                />
                <p className="text-center text-xs text-bitcoin/80 font-vt323 tracking-wider uppercase">BTC</p>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="text-bitcoin font-mono text-2xl">⇄</div>
                <div className="text-[9px] text-gray-500 font-mono">SPOT</div>
              </div>
              
              <div className="space-y-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formatValue(Number(mxnValue.toFixed(2)))}
                  onChange={(e) => handleMxnChange(e.target.value)}
                  className="h-16 bg-black/60 border-2 border-white/20 font-mono text-2xl sm:text-3xl font-bold focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/50 text-[#FAFAFA] placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-inner"
                />
                <p className="text-center text-xs text-bitcoin/80 font-vt323 tracking-wider uppercase">MXN</p>
              </div>
            </div>
          </div>

          {/* 3. SATS ↔ MXN - LIGHTNING ROW (Matrix Green) */}
          <div className="group relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-matrix/10 border border-matrix/30 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,65,0.2)]">
                <Zap className="h-5 w-5 text-matrix" />
              </div>
              <div>
                <span className="font-vt323 text-xl text-matrix tracking-wider">SATOSHIS ↔ PESOS</span>
                <span className="block text-[10px] font-mono text-gray-500 uppercase mt-0.5">Lightning Network</span>
              </div>
            </div>
            
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center bg-gradient-to-br from-matrix/10 to-transparent border-2 border-matrix/40 rounded-2xl p-6 hover:border-matrix/70 hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] transition-all duration-500">
              <div className="space-y-2">
                <Input
                  type="number"
                  step="1"
                  placeholder="0"
                  value={formatValue(satsValue)}
                  onChange={(e) => handleSatsChange(e.target.value)}
                  className="h-16 bg-black/60 border-2 border-white/20 font-mono text-2xl sm:text-3xl font-bold focus:border-matrix focus:ring-2 focus:ring-matrix/50 text-matrix placeholder:text-matrix/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-inner"
                />
                <p className="text-center text-xs text-matrix font-vt323 tracking-wider uppercase">SATS</p>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="text-matrix font-mono text-2xl">⇄</div>
                <div className="text-[9px] text-gray-500 font-mono">LN</div>
              </div>
              
              <div className="space-y-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formatValue(Number(mxnValue.toFixed(2)))}
                  onChange={(e) => handleMxnChange(e.target.value)}
                  className="h-16 bg-black/60 border-2 border-white/20 font-mono text-2xl sm:text-3xl font-bold focus:border-matrix focus:ring-2 focus:ring-matrix/50 text-[#FAFAFA] placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-inner"
                />
                <p className="text-center text-xs text-matrix font-vt323 tracking-wider uppercase">MXN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Footer - Enhanced Terminal Style */}
        <div className="mt-8 pt-6 border-t border-matrix/20 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-matrix/10 border border-matrix/30 rounded-lg px-3 py-1.5">
              <div className="h-2 w-2 bg-matrix rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
              <span className="text-matrix tracking-wider">LIVE</span>
            </div>
            <span className="text-gray-500">Coingecko API</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500">
            <Radio className="h-3 w-3" />
            <span>Refresh: 45s</span>
          </div>
        </div>

        {/* Corner Accents - Design System Spec */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-matrix/30 opacity-50" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-matrix/30 opacity-50" />
      </div>
    </Card>
  );
}