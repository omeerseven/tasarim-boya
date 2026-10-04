import { NextResponse } from "next/server";
import path from "path";
import { addMediaItem, getContent, removeMediaItem } from "@/lib/content";
import { supabase } from "@/lib/supabase";

const BUCKET = "media";
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

/** Storage public URL'sinden bucket içindeki dosya yolunu çıkarır. */
function storagePathFromUrl(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

export async function GET() {
  const content = await getContent();
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

  const fileName = sanitizeFileName(file.name || "gorsel");
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, { contentType: file.type, cacheControl: "31536000" });
  if (uploadError) {
    return NextResponse.json({ error: "Görsel yüklenemedi." }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  const mediaItem = await addMediaItem({ url: publicUrlData.publicUrl, name: file.name || fileName });
  return NextResponse.json({ media: mediaItem }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id parametresi gereklidir." }, { status: 400 });
  }

  const content = await getContent();
  const item = content.media.find((m) => m.id === id);
  const removed = await removeMediaItem(id);
  if (!removed) {
    return NextResponse.json({ error: "Medya bulunamadı." }, { status: 404 });
  }

  const storagePath = item ? storagePathFromUrl(item.url) : null;
  if (storagePath) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
  }

  return NextResponse.json({ ok: true });
}
