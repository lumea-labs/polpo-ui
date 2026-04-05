import { type NextRequest, NextResponse } from "next/server";
import { getDataset, corsHeaders } from "../../../data/loader";

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ example: string }> },
) {
  const { example } = await params;
  const dataset = getDataset(example);

  if (!dataset) {
    return NextResponse.json(
      { ok: false, error: `Unknown example: ${example}` },
      { status: 404, headers: corsHeaders },
    );
  }

  return NextResponse.json(
    { ok: true, data: dataset.agents },
    { headers: corsHeaders },
  );
}
