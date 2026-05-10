// ============================================================
// HACKATHON API ROUTE — Edition-level endpoints
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { validateRegistration } from "@/lib/hackathon/validation";

// GET /hackathon/[edition]/api - List available endpoints
export async function GET(request: NextRequest) {
  const endpoints = {
    "POST /hackathon/[edition]/api/register": {
      description: "Register a team for the hackathon",
      body: {
        teamName: "string",
        email: "string",
        members: [{ nombre: "string", rol: "string" }],
      },
    },
    "POST /hackathon/[edition]/api/submission": {
      description: "Submit a project (post-hackathon)",
      body: {
        projectName: "string",
        projectUrl: "string",
      },
    },
  };

  return NextResponse.json({ endpoints });
}

// POST /hackathon/[edition]/api/register - Register team
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const result = validateRegistration(data);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid registration data", details: result.errors },
        { status: 400 }
      );
    }

    // TODO: Save to database
    // TODO: Send webhook to Discord
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Registration received successfully",
        team: result.data.teamName 
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}