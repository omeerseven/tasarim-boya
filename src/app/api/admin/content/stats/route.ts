import { NextResponse } from "next/server";
import { updateStats, type Stat } from "@/lib/content";

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as Stat[] | null;

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Geçersiz sayaç verisi." }, { status: 400 });
  }

  const content = updateStats(body);
  return NextResponse.json({ stats: content.stats });
}
