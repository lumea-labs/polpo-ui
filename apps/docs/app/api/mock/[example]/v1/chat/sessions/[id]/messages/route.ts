import { type NextRequest, NextResponse } from "next/server";
import { getDataset, corsHeaders } from "../../../../../../data/loader";

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ example: string; id: string }> },
) {
  const { example, id } = await params;
  const dataset = getDataset(example);

  if (!dataset) {
    return NextResponse.json(
      { ok: false, error: `Unknown example: ${example}` },
      { status: 404, headers: corsHeaders },
    );
  }

  const session = dataset.sessions.find((s: any) => s.id === id);
  const messages = dataset.messages[id] || [];

  return NextResponse.json(
    {
      ok: true,
      data: {
        session: session ? { id: session.id, title: session.title } : { id, title: "Unknown session" },
        messages,
      },
    },
    { headers: corsHeaders },
  );
}
