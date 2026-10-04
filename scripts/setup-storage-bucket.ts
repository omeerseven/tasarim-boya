/**
 * Supabase Storage'da admin medya yüklemeleri için public bir bucket oluşturur.
 * Tek seferlik kullanım: npx tsx scripts/setup-storage-bucket.ts
 */
import fs from "fs";
import path from "path";

function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  const raw = fs.readFileSync(envPath, "utf-8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();
  const { supabase } = await import("../src/lib/supabase");

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  if (buckets?.some((b) => b.name === "media")) {
    console.log("'media' bucket'ı zaten var, atlanıyor.");
    return;
  }

  const { error } = await supabase.storage.createBucket("media", {
    public: true,
    fileSizeLimit: 8 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
  });
  if (error) throw error;
  console.log("'media' bucket'ı oluşturuldu (public, 8MB limit).");
}

main().catch((err) => {
  console.error("Bucket oluşturma hatası:", err);
  process.exit(1);
});
