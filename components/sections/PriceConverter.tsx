"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Coins, DollarSign, Bitcoin, Activity, Zap } from "lucide-react";

export default function PriceConverter() {
  const [prices, setPrices] = useState<{ usd: number; mxn: number }>({
    usd: 0,
    mxn: 0,
  });
  const [loading, setLoading] = useState(true);

  // Estados de conversión
  const [btcUsd, setBtcUsd] = useState<number>(1);
  const [usdAmount, setUsdAmount] = useState<number>(65000);

  const [btcMxn, setBtcMxn] = useState<number>(1);
  const [mxnAmount, setMxnAmount] = useState<number>(1300000);

  const [sats, setSats] = useState<number>(10000);
  const [satsMxn, setSatsMxn] = useState<number>(0);

  // Fetch de precios
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=mxn,usd",
          { cache: "no-store", next: { revalidate: 45 } }
        );
        const data = await res.json();

        const newPrices = {
          usd: data.bitcoin.usd,
          mxn: data.bitcoin.mxn,
        };

        setPrices(newPrices);
        setUsdAmount(btcUsd * newPrices.usd);
        setMxnAmount(btcMxn * newPrices.mxn);
        setSatsMxn((sats / 100_000_000) * newPrices.mxn);
      } catch (error) {
        console.error("Error fetching prices");
        const fallback = { usd: 105000, mxn: 2_050_000 };
        setPrices(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 45000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleBtcUsdChange = (value: number) => {
    setBtcUsd(value);
    setUsdAmount(value * prices.usd);
  };

  const handleUsdChange = (value: number) => {
    setUsdAmount(value);
    if (prices.usd) setBtcUsd(value / prices.usd);
  };

  const handleBtcMxnChange = (value: number) => {
    setBtcMxn(value);
    setMxnAmount(value * prices.mxn);
  };

  const handleMxnChange = (value: number) => {
    setMxnAmount(value);
    if (prices.mxn) setBtcMxn(value / prices.mxn);
  };

  const handleSatsChange = (value: number) => {
    setSats(value);
    setSatsMxn((value / 100_000_000) * prices.mxn);
  };

  const handleSatsMxnChange = (value: number) => {
    setSatsMxn(value);
    if (prices.mxn) setSats((value / prices.mxn) * 100_000_000);
  };

  return (
    <Card className="relative overflow-hidden border border-white/10 bg-black/80 backdrop-blur-md p-6 sm:p-8">
      {/* Background Grid - Design System Spec */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.15)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-matrix/10 border border-matrix/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,65,0.2)]">
              <Activity className="h-6 w-6 text-matrix" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold tracking-tight text-[#FAFAFA]">Oracle de Precios</h3>
              <p className="font-mono text-xs text-matrix/70">Bitcoin en tiempo real</p>
            </div>
          </div>

          {!loading && prices.usd && (
            <div className="text-right">
              <div className="text-xs text-gray-500 font-mono uppercase">BTC/USD</div>
              <div className="font-mono text-xl font-bold text-matrix">
                ${prices.usd.toLocaleString("en-US")}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* 1. BTC ↔ USD - Bitcoin Orange */}
          <div className="group">
            <div className="flex items-center gap-2 mb-2">
              <Bitcoin className="h-4 w-4 text-bitcoin" />
              <span className="font-mono uppercase text-xs tracking-widest text-bitcoin">Bitcoin ↔ Dólar</span>
            </div>
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center bg-white/5 border border-bitcoin/20 rounded-2xl p-5 hover:border-bitcoin/50 transition-all">
              <div className="space-y-1">
                <Input
                  type="number"
                  step="0.00000001"
                  value={btcUsd}
                  onChange={(e) => handleBtcUsdChange(parseFloat(e.target.value) || 0)}
                  className="h-14 bg-white/5 border-white/20 font-mono text-2xl font-bold focus:border-bitcoin focus:ring-1 focus:ring-bitcoin text-[#FAFAFA] placeholder:text-gray-600"
                />
                <p className="text-center text-[10px] text-gray-500 font-mono uppercase">BTC</p>
              </div>
              <div className="text-bitcoin/50 font-mono">↔</div>
              <div className="space-y-1">
                <Input
                  type="text"
                  value={usdAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  onChange={(e) => handleUsdChange(parseFloat(e.target.value.replace(/,/g, "")) || 0)}
                  className="h-14 bg-white/5 border-white/20 font-mono text-2xl font-bold focus:border-bitcoin focus:ring-1 focus:ring-bitcoin text-[#FAFAFA] placeholder:text-gray-600"
                />
                <p className="text-center text-[10px] text-gray-500 font-mono uppercase">USD</p>
              </div>
            </div>
          </div>

          {/* 2. BTC ↔ MXN - Bitcoin Orange (CORREGIDO: antes orange-400) */}
          <div className="group">
            <div className="flex items-center gap-2 mb-2">
              <Bitcoin className="h-4 w-4 text-bitcoin" />
              <span className="font-mono uppercase text-xs tracking-widest text-bitcoin">Bitcoin ↔ Pesos</span>
            </div>
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center bg-white/5 border border-bitcoin/20 rounded-2xl p-5 hover:border-bitcoin/50 transition-all">
              <div className="space-y-1">
                <Input
                  type="number"
                  step="0.00000001"
                  value={btcMxn}
                  onChange={(e) => handleBtcMxnChange(parseFloat(e.target.value) || 0)}
                  className="h-14 bg-white/5 border-white/20 font-mono text-2xl font-bold focus:border-bitcoin focus:ring-1 focus:ring-bitcoin text-[#FAFAFA] placeholder:text-gray-600"
                />
                <p className="text-center text-[10px] text-gray-500 font-mono uppercase">BTC</p>
              </div>
              <div className="text-bitcoin/50 font-mono">↔</div>
              <div className="space-y-1">
                <Input
                  type="text"
                  value={mxnAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  onChange={(e) => handleMxnChange(parseFloat(e.target.value.replace(/,/g, "")) || 0)}
                  className="h-14 bg-white/5 border-white/20 font-mono text-2xl font-bold focus:border-bitcoin focus:ring-1 focus:ring-bitcoin text-[#FAFAFA] placeholder:text-gray-600"
                />
                <p className="text-center text-[10px] text-gray-500 font-mono uppercase">MXN</p>
              </div>
            </div>
          </div>

          {/* 3. SATS ↔ MXN - Matrix Green (Lightning) */}
          <div className="group">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-matrix" />
              <span className="font-mono uppercase text-xs tracking-widest text-matrix">Satoshis ↔ Pesos</span>
            </div>
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center bg-matrix/10 border border-matrix/30 rounded-2xl p-5 hover:border-matrix/50 transition-all">
              <div className="space-y-1">
                <Input
                  type="number"
                  value={sats}
                  onChange={(e) => handleSatsChange(Math.floor(parseFloat(e.target.value)) || 0)}
                  className="h-14 bg-white/5 border-white/20 font-mono text-2xl font-bold focus:border-matrix focus:ring-1 focus:ring-matrix text-matrix placeholder:text-matrix/30"
                />
                <p className="text-center text-[10px] text-matrix/70 font-mono uppercase">SATS</p>
              </div>
              <div className="text-matrix/50 font-mono">↔</div>
              <div className="space-y-1">
                <Input
                  type="text"
                  value={satsMxn.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  onChange={(e) => handleSatsMxnChange(parseFloat(e.target.value.replace(/,/g, "")) || 0)}
                  className="h-14 bg-white/5 border-white/20 font-mono text-2xl font-bold focus:border-matrix focus:ring-1 focus:ring-matrix text-[#FAFAFA] placeholder:text-gray-600"
                />
                <p className="text-center text-[10px] text-matrix/70 font-mono uppercase">MXN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Footer - Design System Spec */}
        <div className="mt-8 flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 bg-matrix rounded-full animate-pulse" />
            LIVE • Coingecko
          </div>
          <div>Actualizado cada 45s</div>
        </div>
      </div>
    </Card>
  );
}