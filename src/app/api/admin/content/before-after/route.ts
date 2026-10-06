import { NextResponse } from "next/server";
import { updateBeforeAfterItems, type BeforeAfterItem } from "@/lib/content";

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as BeforeAfterItem[] | null;

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Geçersiz öncesi/sonrası verisi." }, { status: 400 });
  }

  const content = await updateBeforeAfterItems(body);
  return NextResponse.json({ beforeAfterItems: content.beforeAfterItems });
}
