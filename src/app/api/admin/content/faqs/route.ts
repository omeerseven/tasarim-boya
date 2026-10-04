import { NextResponse } from "next/server";
import { updateFaqs, type Faq } from "@/lib/content";

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as Faq[] | null;

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Geçersiz SSS verisi." }, { status: 400 });
  }

  const content = await updateFaqs(body);
  return NextResponse.json({ faqs: content.faqs });
}
