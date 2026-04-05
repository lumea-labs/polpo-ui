import { type NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../../../../data/loader";

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const path = form.get("path") as string || "workspace";
  const file = form.get("file") as File | null;
  const filename = file?.name || "upload";

  return NextResponse.json(
    {
      ok: true,
      data: {
        uploaded: [{ name: `${path}/${filename}`, size: file?.size || 0 }],
        count: 1,
      },
    },
    { headers: corsHeaders },
  );
}
