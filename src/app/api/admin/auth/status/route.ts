import { NextResponse } from "next/server";
import { isConfigured } from "@/lib/admin-auth";

export async function GET() {
  return NextResponse.json({ configured: isConfigured() });
}
