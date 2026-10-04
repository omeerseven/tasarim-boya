import { NextResponse } from "next/server";
import {
  createSessionToken,
  isConfigured,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  setupAdmin,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (isConfigured()) {
    return NextResponse.json(
      { error: "Yönetim paneli zaten kurulmuş." },
      { status: 409 },
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const securityQuestion =
    typeof body?.securityQuestion === "string" ? body.securityQuestion.trim() : "";
  const securityAnswer =
    typeof body?.securityAnswer === "string" ? body.securityAnswer.trim() : "";

  setupAdmin(password, securityQuestion, securityAnswer);
  const token = createSessionToken();

  const res = NextResponse.json({ ok: true });
  if (token) {
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
  }
  return res;
}
