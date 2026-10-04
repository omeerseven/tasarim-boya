import { NextResponse } from "next/server";
import { updateServices, type Service } from "@/lib/content";

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as Service[] | null;

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Geçersiz hizmet verisi." }, { status: 400 });
  }

  const content = updateServices(body);
  return NextResponse.json({ services: content.services });
}
