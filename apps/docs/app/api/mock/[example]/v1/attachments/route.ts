import { type NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../../../data/loader";

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /attachments?sessionId=...
export function GET() {
  return NextResponse.json(
    { ok: true, data: [] },
    { headers: corsHeaders },
  );
}

// POST /attachments (upload)
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { ok: true, data: { uploaded: [], count: 0 } },
    { headers: corsHeaders },
  );
}
