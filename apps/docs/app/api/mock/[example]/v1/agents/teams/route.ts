import { NextResponse } from "next/server";
import { corsHeaders } from "../../../../data/loader";

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export function GET() {
  return NextResponse.json(
    { ok: true, data: [] },
    { headers: corsHeaders },
  );
}
