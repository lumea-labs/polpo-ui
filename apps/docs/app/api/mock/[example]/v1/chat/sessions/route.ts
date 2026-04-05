import { type NextRequest, NextResponse } from "next/server";
import { getDataset, corsHeaders } from "../../../../data/loader";

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
    { ok: true, data: { sessions: dataset.sessions } },
    { headers: corsHeaders },
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ example: string }> },
) {
  await params;
  return NextResponse.json(
    { ok: true, data: { deleted: true } },
    { headers: corsHeaders },
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ example: string }> },
) {
  await params;
  const body = await req.json().catch(() => ({}));
  return NextResponse.json(
    { ok: true, data: { renamed: true, title: body.title ?? "" } },
    { headers: corsHeaders },
  );
}
