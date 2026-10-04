import { NextResponse } from "next/server";
import { updateNavLinks, type NavLink } from "@/lib/content";

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as NavLink[] | null;

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Geçersiz menü verisi." }, { status: 400 });
  }

  const content = updateNavLinks(body);
  return NextResponse.json({ navLinks: content.navLinks });
}
