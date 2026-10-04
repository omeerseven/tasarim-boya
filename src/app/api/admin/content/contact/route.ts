import { NextResponse } from "next/server";
import { updateContact, type ContactInfo } from "@/lib/content";

/**
 * Accepts either a raw Google Maps embed URL or a full <iframe> embed
 * snippet and normalizes it down to a plain http(s) URL safe to use as
 * an <iframe src>. Anything else (or a non-http scheme) is dropped so the
 * contact page falls back to deriving a map from the address instead.
 */
function normalizeMapEmbedUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const iframeMatch = trimmed.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  const candidate = (iframeMatch ? iframeMatch[1] : trimmed).trim();

  return /^https:\/\//i.test(candidate) ? candidate : "";
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactInfo | null;

  if (!body || typeof body.phoneDisplay !== "string" || typeof body.email !== "string") {
    return NextResponse.json({ error: "Geçersiz iletişim verisi." }, { status: 400 });
  }

  const mapEmbedUrl = normalizeMapEmbedUrl(
    typeof body.mapEmbedUrl === "string" ? body.mapEmbedUrl : "",
  );

  const content = await updateContact({ ...body, mapEmbedUrl });
  return NextResponse.json({ contact: content.contact });
}
