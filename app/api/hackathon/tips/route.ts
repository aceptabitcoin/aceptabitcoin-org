// ============================================================
// TIPJAR ENDPOINT — Edition-specific tipping
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentEdition } from "@/lib/hackathon/editions/legacy-data";

export async function GET(request: NextRequest) {
  const edition = getCurrentEdition();
  
  return NextResponse.json({
    edition: edition.id,
    tipAddress: "hackathon@aceptabitcoin.org",
    description: "Apoya al Hackathon Bitcoin México",
    suggestedAmounts: [1000, 5000, 10000, 50000],
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  
  return NextResponse.json({
    success: true,
    message: "Tip received",
    data,
  });
}