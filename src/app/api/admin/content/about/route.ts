import { NextResponse } from "next/server";
import { updateAbout, type About } from "@/lib/content";

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as About | null;

  if (!body || typeof body.heroTitle !== "string") {
    return NextResponse.json({ error: "Geçersiz hakkımızda verisi." }, { status: 400 });
  }

  const content = await updateAbout(body);
  return NextResponse.json({ about: content.about });
}
