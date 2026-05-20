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

  // Fetch de precios (independiente de los inputs)
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

        // Actualizar valores derivados
        setUsdAmount(btcUsd * newPrices.usd);
        setMxnAmount(btcMxn * newPrices.mxn);
        setSatsMxn((sats / 100_000_000) * newPrices.mxn);
      } catch (error) {
        console.error("Error fetching prices");
        // Fallback realista
        const fallback = { usd: 105000, mxn: 2_050_000 };
        setPrices(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 45000); // cada 45 segundos
    return () => clearInterval(interval);
  }, []); // ← Solo se ejecuta al montar

  // Handlers actualizados
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
    <Card className="relative overflow-hidden border-white/10 bg-black/60 backdrop-blur-2xl p-6 sm:p-8">
      {/* Background Matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.08)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-matrix to-bitcoin/80 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.3)]">
              <Activity className="h-6 w-6 text-black" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold tracking-tight">Oracle de Precios</h3>
              <p className="font-mono text-xs text-matrix/70">Bitcoin en tiempo real</p>
            </div>
          </div>

          {!loading && prices.usd && (
            <div className="text-right">
              <div className="text-xs text-gray-500 font-mono">BTC/USD</div>
              <div className="font-mono text-xl font-bold text-matrix">
                ${prices.usd.toLocaleString("en-US")}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* 1. BTC ↔ USD */}
          <div className="group">
            <div className="flex items-center gap-2 mb-2">
              <Bitcoin className="h-4 w-4 text-bitcoin" />
              <span className="font-mono uppercase text-xs tracking-widest text-bitcoin">Bitcoin ↔ Dólar</span>
            </div>
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center bg-black/40 border border-bitcoin/20 rounded-2xl p-5 hover:border-bitcoin/40 transition-all">
              <div className="space-y-1">
                <Input
                  type="number"
                  step="0.00000001"
                  value={btcUsd}
                  onChange={(e) => handleBtcUsdChange(parseFloat(e.target.value) || 0)}
                  className="h-14 bg-transparent border-white/10 font-mono text-2xl font-bold focus:border-bitcoin text-white"
                />
                <p className="text-center text-[10px] text-gray-500">BTC</p>
              </div>
              <div className="text-bitcoin/50">↔</div>
              <div className="space-y-1">
                <Input
                  type="text"
                  value={usdAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  onChange={(e) => handleUsdChange(parseFloat(e.target.value.replace(/,/g, "")) || 0)}
                  className="h-14 bg-transparent border-white/10 font-mono text-2xl font-bold focus:border-bitcoin text-white"
                />
                <p className="text-center text-[10px] text-gray-500">USD</p>
              </div>
            </div>
          </div>

          {/* 2. BTC ↔ MXN */}
          <div className="group">
            <div className="flex items-center gap-2 mb-2">
              <Bitcoin className="h-4 w-4 text-orange-400" />
              <span className="font-mono uppercase text-xs tracking-widest text-orange-400">Bitcoin ↔ Pesos</span>
            </div>
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center bg-black/40 border border-orange-500/20 rounded-2xl p-5 hover:border-orange-500/40 transition-all">
              <div className="space-y-1">
                <Input
                  type="number"
                  step="0.00000001"
                  value={btcMxn}
                  onChange={(e) => handleBtcMxnChange(parseFloat(e.target.value) || 0)}
                  className="h-14 bg-transparent border-white/10 font-mono text-2xl font-bold focus:border-orange-400 text-white"
                />
                <p className="text-center text-[10px] text-gray-500">BTC</p>
              </div>
              <div className="text-orange-500/50">↔</div>
              <div className="space-y-1">
                <Input
                  type="text"
                  value={mxnAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  onChange={(e) => handleMxnChange(parseFloat(e.target.value.replace(/,/g, "")) || 0)}
                  className="h-14 bg-transparent border-white/10 font-mono text-2xl font-bold focus:border-orange-400 text-white"
                />
                <p className="text-center text-[10px] text-gray-500">MXN</p>
              </div>
            </div>
          </div>

          {/* 3. SATS ↔ MXN (el más usado en Lightning) */}
          <div className="group">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-matrix" />
              <span className="font-mono uppercase text-xs tracking-widest text-matrix">Satoshis ↔ Pesos</span>
            </div>
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center bg-gradient-to-r from-matrix/5 to-black/40 border border-matrix/30 rounded-2xl p-5 hover:border-matrix/60 transition-all">
              <div className="space-y-1">
                <Input
                  type="number"
                  value={sats}
                  onChange={(e) => handleSatsChange(Math.floor(parseFloat(e.target.value)) || 0)}
                  className="h-14 bg-transparent border-white/10 font-mono text-2xl font-bold focus:border-matrix text-matrix"
                />
                <p className="text-center text-[10px] text-matrix/70">SATS</p>
              </div>
              <div className="text-matrix/50">↔</div>
              <div className="space-y-1">
                <Input
                  type="text"
                  value={satsMxn.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  onChange={(e) => handleSatsMxnChange(parseFloat(e.target.value.replace(/,/g, "")) || 0)}
                  className="h-14 bg-transparent border-white/10 font-mono text-2xl font-bold focus:border-matrix text-white"
                />
                <p className="text-center text-[10px] text-matrix/70">MXN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="mt-8 flex items-center justify-between text-[10px] font-mono text-gray-500">
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