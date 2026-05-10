// ============================================================
// HACKATHON BITCOIN UTILITIES
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { formatSats } from "@/lib/utils";

// ── Lightning Address utilities ──
export function validateLightningAddress(address: string): boolean {
  // Format: username@domain
  const pattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(address);
}

export function formatLightningAddress(address: string): string {
  return address.trim().toLowerCase();
}

// ── LNURL utilities ──
export function buildLnurlPayUrl(
  callbackUrl: string,
  amountMsats: number,
  comment?: string
): string {
  const url = new URL(callbackUrl);
  url.searchParams.set("amount", amountMsats.toString());
  if (comment) url.searchParams.set("comment", comment);
  return url.toString();
}

// ── Amount formatting ──
export function formatBitcoinAmount(sats: number, unit: "sats" | "BTC" = "sats"): string {
  if (unit === "BTC") {
    return (sats / 100_000_000).toFixed(8);
  }
  return formatSats(sats);
}

export function parseBitcoinAmount(input: string, unit: "sats" | "BTC" = "sats"): number | null {
  const sanitized = input.replace(/,/g, "").trim();
  const num = Number(sanitized);
  
  if (isNaN(num) || num <= 0) return null;
  
  if (unit === "BTC") {
    // Convert BTC to sats
    return Math.round(num * 100_000_000);
  }
  
  return Math.round(num);
}

// ── Hackathon scoring utilities ──
export interface HackathonScore {
  innovation: number;         // 0-10
  technicalComplexity: number; // 0-10
  bitcoinRelevance: number;   // 0-10
  presentation: number;       // 0-10
  completeness: number;       // 0-10
}

export const SCORE_WEIGHTS = {
  innovation: 0.25,
  technicalComplexity: 0.25,
  bitcoinRelevance: 0.25,
  presentation: 0.1,
  completeness: 0.15,
} as const;

export function calculateFinalScore(score: HackathonScore): {
  total: number;
  breakdown: Record<string, number>;
} {
  const breakdown: Record<string, number> = {};
  let total = 0;

  for (const [key, weight] of Object.entries(SCORE_WEIGHTS)) {
    const value = score[key as keyof HackathonScore];
    const weighted = value * weight;
    breakdown[key] = weighted;
    total += weighted;
  }

  return {
    total: Math.round(total * 100) / 100,
    breakdown,
  };
}

export function scoreToGrade(score: number): { grade: string; emoji: string; color: string } {
  if (score >= 9.0) return { grade: "EXTRAORDINARIO", emoji: "🏆", color: "text-yellow-400" };
  if (score >= 7.5) return { grade: "EXCELENTE", emoji: "🌟", color: "text-bitcoin" };
  if (score >= 6.0) return { grade: "BUENO", emoji: "✅", color: "text-matrix" };
  if (score >= 4.0) return { grade: "EN DESARROLLO", emoji: "🔧", color: "text-blue-400" };
  return { grade: "NECESITA MEJORAS", emoji: "💡", color: "text-gray-400" };
}

// ── Project ID generator (simple hash) ──
export function generateProjectId(name: string, edition: string): string {
  const combined = `${name.toLowerCase().replace(/\s+/g, "-")}-${edition}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `${combined}-${Math.abs(hash).toString(36)}`;
}

// ── Bitcoin-themed lorem ipsum for placeholder content ──
export const BITCOIN_LOREM = [
  "Sound money for sound minds.",
  "Not your keys, not your coins.",
  "Layer by layer, we build sovereignty.",
  "Proof of work changes everything.",
  "Fix the money, fix the world.",
  "Permissionless innovation since 2009.",
  "The internet of money, evolving.",
  "Sats stack when conviction is strong.",
  "Trust math, not institutions.",
  "Decentralized by design, sovereign by default.",
  "Maximalism is a feature, not a bug.",
  "Every satoshi counts.",
];