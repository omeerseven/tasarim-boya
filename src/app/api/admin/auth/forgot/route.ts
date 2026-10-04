import { NextResponse } from "next/server";
import { getSecurityQuestion, isConfigured, resetPasswordWithAnswer } from "@/lib/admin-auth";

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Yönetim paneli henüz kurulmadı." },
      { status: 400 },
    );
  }
  const question = getSecurityQuestion();
  return NextResponse.json({ question });
}

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Yönetim paneli henüz kurulmadı." },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => null);
  const answer = typeof body?.answer === "string" ? body.answer : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "Yeni şifre en az 8 karakter olmalıdır." },
      { status: 400 },
    );
  }

  const success = resetPasswordWithAnswer(answer, newPassword);
  if (!success) {
    return NextResponse.json({ error: "Güvenlik cevabı yanlış." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
