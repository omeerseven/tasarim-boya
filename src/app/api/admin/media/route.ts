import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { addMediaItem, getContent, removeMediaItem } from "@/lib/content";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

function sanitizeFileName(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${Date.now()}-${base || "gorsel"}${ext}`;
}

export async function GET() {
  const content = getContent();
  return NextResponse.json({ media: content.media });
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Görsel dosyası bulunamadı." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Yalnızca JPG, PNG, WEBP, GIF veya SVG dosyaları yüklenebilir." },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Dosya boyutu 8 MB'ı aşamaz." },
      { status: 400 },
    );
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const fileName = sanitizeFileName(file.name || "gorsel");
  const filePath = path.join(UPLOAD_DIR, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  const mediaItem = addMediaItem({ url: `/uploads/${fileName}`, name: file.name || fileName });
  return NextResponse.json({ media: mediaItem }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id parametresi gereklidir." }, { status: 400 });
  }

  const content = getContent();
  const item = content.media.find((m) => m.id === id);
  const removed = removeMediaItem(id);
  if (!removed) {
    return NextResponse.json({ error: "Medya bulunamadı." }, { status: 404 });
  }

  if (item && item.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", item.url);
    await fs.unlink(filePath).catch(() => undefined);
  }

  return NextResponse.json({ ok: true });
}
