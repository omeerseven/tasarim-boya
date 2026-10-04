import { NextResponse } from "next/server";
import { getSecurityQuestion, isConfigured, resetPasswordWithAnswer } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isConfigured())) {
    return NextResponse.json(
      { error: "Yönetim paneli henüz kurulmadı." },
      { status: 400 },
    );
  }
  const question = await getSecurityQuestion();
  return NextResponse.json({ question });
}

export async function POST(request: Request) {
  if (!(await isConfigured())) {
    return NextResponse.json(
      { error: "Yönetim paneli henüz kurulmadı." },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => null);
  const answer = typeof body?.answer === "string" ? body.answer : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

  const success = await resetPasswordWithAnswer(answer, newPassword);
  if (!success) {
    return NextResponse.json({ error: "Güvenlik cevabı yanlış." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
