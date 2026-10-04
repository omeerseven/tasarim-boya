/**
 * data/*.json içindeki mevcut verileri Supabase tablolarına taşır.
 * Tek seferlik kullanım: npx tsx scripts/migrate-to-supabase.ts
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

// data/content.json'da branding/contact/navLinks hiç yazılmamış (admin panel
// bu bölümleri hiç düzenlememiş) — bu yüzden eski DEFAULT_CONTENT'teki gerçek
// işletme varsayılanlarını burada koruyoruz.
const FALLBACK_BRANDING = { logoUrl: "/tasarim-boya-mark.png" };
const FALLBACK_CONTACT = {
  phoneDisplay: "0216 555 01 23",
  phoneHref: "+902165550123",
  whatsappNumber: "902165550123",
  email: "info@tasarimboya.com",
  address: "Barbaros Mah. Begonya Sok. No: 12, Ataşehir / İstanbul",
  workingHours: "Pazartesi - Cumartesi: 08:30 - 19:00",
  mapEmbedUrl: "",
};
const FALLBACK_NAV_LINKS = [
  { id: crypto.randomUUID(), label: "Ana Sayfa", href: "/" },
  { id: crypto.randomUUID(), label: "Hakkımızda", href: "/hakkimizda" },
  { id: crypto.randomUUID(), label: "Hizmetler", href: "/hizmetler" },
  { id: crypto.randomUUID(), label: "Blog", href: "/blog" },
  { id: crypto.randomUUID(), label: "İletişim", href: "/iletisim" },
];

async function main() {
  loadEnvLocal();

  const { supabase } = await import("../src/lib/supabase");
  const content = await import("../src/lib/content");

  const dataDir = path.join(process.cwd(), "data");
  const siteContent = JSON.parse(fs.readFileSync(path.join(dataDir, "content.json"), "utf-8"));

  console.log("→ branding");
  await content.updateBranding(siteContent.branding ?? FALLBACK_BRANDING);

  console.log("→ contact_info");
  await content.updateContact(siteContent.contact ?? FALLBACK_CONTACT);

  console.log("→ nav_links");
  await content.updateNavLinks(
    siteContent.navLinks && siteContent.navLinks.length > 0 ? siteContent.navLinks : FALLBACK_NAV_LINKS,
  );

  console.log("→ hero + hero_slides");
  await content.updateHero(siteContent.hero);

  console.log("→ stats");
  await content.updateStats(siteContent.stats ?? []);

  console.log("→ faqs");
  await content.updateFaqs(siteContent.faqs ?? []);

  console.log("→ services");
  await content.updateServices(siteContent.services ?? []);

  console.log("→ about + about_values + team_members");
  await content.updateAbout(siteContent.about);

  console.log("→ blog_posts");
  await content.updateBlogPosts(siteContent.blogPosts ?? []);

  console.log("→ media");
  for (const item of siteContent.media ?? []) {
    await supabase
      .from("media")
      .upsert({ id: item.id, url: item.url, name: item.name, uploaded_at: item.uploadedAt });
  }

  console.log("→ leads");
  const leadsPath = path.join(dataDir, "leads.json");
  if (fs.existsSync(leadsPath)) {
    const leads = JSON.parse(fs.readFileSync(leadsPath, "utf-8"));
    for (const lead of leads) {
      await supabase.from("leads").upsert({
        id: lead.id,
        type: lead.type,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        service: lead.service ?? null,
        message: lead.message,
        status: lead.status,
        created_at: lead.createdAt,
      });
    }
    console.log(`  ${leads.length} lead aktarıldı.`);
  }

  console.log("→ admin_auth");
  const authPath = path.join(dataDir, "admin-auth.json");
  if (fs.existsSync(authPath)) {
    const auth = JSON.parse(fs.readFileSync(authPath, "utf-8"));
    await supabase.from("admin_auth").upsert({
      id: 1,
      password_hash: auth.passwordHash,
      password_salt: auth.passwordSalt,
      security_question: auth.securityQuestion,
      answer_hash: auth.answerHash,
      answer_salt: auth.answerSalt,
      session_secret: auth.sessionSecret,
    });
    console.log("  admin_auth satırı aktarıldı (mevcut gerçek şifre korundu).");
  } else {
    console.log("  data/admin-auth.json yok, atlanıyor (sabit şifre akışı zaten çalışır).");
  }

  console.log("\nTamamlandı.");
}

main().catch((err) => {
  console.error("Migration hatası:", err);
  process.exit(1);
});
