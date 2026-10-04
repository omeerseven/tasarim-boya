import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Kurulum ekranı devre dışı bırakıldı. Lütfen /admin/login üzerinden giriş yapın." },
    { status: 410 },
  );
}
