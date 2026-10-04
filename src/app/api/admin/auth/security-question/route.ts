import { NextResponse } from "next/server";
import { updateSecurityQuestion } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const currentPassword =
    typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const answer = typeof body?.answer === "string" ? body.answer.trim() : "";

  if (!question || !answer) {
    return NextResponse.json(
      { error: "Güvenlik sorusu ve cevabı zorunludur." },
      { status: 400 },
    );
  }

  const success = await updateSecurityQuestion(currentPassword, question, answer);
  if (!success) {
    return NextResponse.json({ error: "Mevcut şifre yanlış." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
