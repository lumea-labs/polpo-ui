import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  const baseUrl = process.env.NEXT_PUBLIC_POLPO_URL!;
  const apiKey = process.env.NEXT_PUBLIC_POLPO_API_KEY;

  // If it's already an absolute http URL, fetch directly
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  const res = await fetch(fullUrl, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
  });

  if (!res.ok) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contentType = res.headers.get("content-type") || "image/png";
  const body = await res.arrayBuffer();

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
