import { NextResponse } from "next/server";
import { updateBranding, type Branding } from "@/lib/content";

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as Branding | null;

  if (!body || typeof body.logoUrl !== "string" || !body.logoUrl.trim()) {
    return NextResponse.json({ error: "Geçersiz logo verisi." }, { status: 400 });
  }

  const content = updateBranding(body);
  return NextResponse.json({ branding: content.branding });
}
