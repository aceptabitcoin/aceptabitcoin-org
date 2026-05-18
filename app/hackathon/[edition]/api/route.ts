// ============================================================
// HACKATHON API ROUTE — Edition-level endpoints
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { NextRequest, NextResponse } from "next/server";

// GET /hackathon/[edition]/api - List available endpoints
export async function GET(request: NextRequest) {
  const endpoints = {
    "INFO /hackathon/[edition]/register": {
      description: "Registration is now handled via Google Forms.",
      url: process.env.NEXT_PUBLIC_HACKATHON_REGISTRATION_FORM_URL || "Contact organizers",
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

// POST registration removed: Migrated to Google Forms for data sovereignty and ease of management.