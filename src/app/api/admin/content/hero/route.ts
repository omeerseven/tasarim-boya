import { NextResponse } from "next/server";
import { updateHero, type Hero } from "@/lib/content";

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as Hero | null;

  if (!body || typeof body.title !== "string" || !Array.isArray(body.slides)) {
    return NextResponse.json({ error: "Geçersiz hero verisi." }, { status: 400 });
  }

  if (body.slides.length === 0) {
    return NextResponse.json(
      { error: "En az bir slider görseli gereklidir." },
      { status: 400 },
    );
  }

  const content = await updateHero(body);
  return NextResponse.json({ hero: content.hero });
}
