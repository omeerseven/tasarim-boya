import { NextResponse } from "next/server";
import { changePassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const currentPassword =
    typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "Yeni şifre en az 8 karakter olmalıdır." },
      { status: 400 },
    );
  }

  const success = await changePassword(currentPassword, newPassword);
  if (!success) {
    return NextResponse.json({ error: "Mevcut şifre yanlış." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
