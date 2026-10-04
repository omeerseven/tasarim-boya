import { NextResponse } from "next/server";
import { deleteLead, updateLeadStatus, type Lead } from "@/lib/leads";

const VALID_STATUSES: Lead["status"][] = [
  "yeni",
  "iletisime-gecildi",
  "tamamlandi",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const status = body?.status;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
  }

  const lead = await updateLeadStatus(id, status);
  if (!lead) {
    return NextResponse.json({ error: "Talep bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ lead });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = await deleteLead(id);
  if (!deleted) {
    return NextResponse.json({ error: "Talep bulunamadı." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
