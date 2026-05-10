// ============================================================
// LEADERBOARD ENDPOINT — Live hackathon rankings
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getEditionBySlug } from "@/lib/hackathon/editions/legacy-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const editionSlug = searchParams.get("edition") || "hbtcmx-2026-1";
  
  const edition = getEditionBySlug(editionSlug);
  
  if (!edition) {
    return NextResponse.json({ error: "Edition not found" }, { status: 404 });
  }

  // Mock leaderboard data - would come from actual scoring system
  const leaderboard = [
    { rank: 1, team: "Corriente Satoshi", score: 9.2, members: ["godin-001", "Aureo"] },
    { rank: 2, team: "LN-Gateway Pro", score: 8.7, members: ["bitdev", "nop118"] },
    { rank: 3, team: "BlockBazaar", score: 8.3, members: ["devmerida"] },
    { rank: 4, team: "SatoshiSafe", score: 7.9, members: ["yucabtc"] },
  ];

  return NextResponse.json({
    edition: edition.id,
    leaderboard,
    lastUpdated: new Date().toISOString(),
  });
}