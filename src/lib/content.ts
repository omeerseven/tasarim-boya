import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export type HeroSlide = { id: string; image: string; alt: string };

export type Hero = {
  badge: string;
  title: string;
  description: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  slides: HeroSlide[];
};

export type Stat = { id: string; label: string; value: string };
export type Faq = { id: string; question: string; answer: string };

export type Service = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string[];
  features: string[];
  image: string;
};

export type AboutValue = { id: string; title: string; description: string };
export type TeamMember = { id: string; name: string; role: string; image: string };

export type About = {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyImage: string;
  vision: string;
  mission: string;
  values: AboutValue[];
  team: TeamMember[];
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
};

export type MediaItem = { id: string; url: string; name: string; uploadedAt: string };

export type Branding = { logoUrl: string };

export type ContactInfo = {
  phoneDisplay: string;
  phoneHref: string;
  whatsappNumber: string;
  email: string;
  address: string;
  workingHours: string;
  /** Explicit Google Maps embed URL. Empty string = auto-derive from `address`. */
  mapEmbedUrl: string;
};

export type NavLink = { id: string; label: string; href: string };

export type SiteContent = {
  branding: Branding;
  contact: ContactInfo;
  navLinks: NavLink[];
  hero: Hero;
  stats: Stat[];
  faqs: Faq[];
  services: Service[];
  about: About;
  blogPosts: BlogPost[];
  media: MediaItem[];
};

function id(): string {
  return crypto.randomUUID();
}

const EMPTY_BRANDING: Branding = { logoUrl: "/tasarim-boya-mark.png" };
const EMPTY_CONTACT: ContactInfo = {
  phoneDisplay: "",
  phoneHref: "",
  whatsappNumber: "",
  email: "",
  address: "",
  workingHours: "",
  mapEmbedUrl: "",
};
const EMPTY_HERO: Omit<Hero, "slides"> = {
  badge: "",
  title: "",
  description: "",
  ctaPrimaryLabel: "",
  ctaPrimaryHref: "",
  ctaSecondaryLabel: "",
  ctaSecondaryHref: "",
};
const EMPTY_ABOUT: Omit<About, "values" | "team"> = {
  heroTitle: "",
  heroDescription: "",
  heroImage: "",
  storyTitle: "",
  storyParagraphs: [],
  storyImage: "",
  vision: "",
  mission: "",
};

async function replaceTable(table: string, rows: Record<string, unknown>[]): Promise<void> {
  await supabase.from(table).delete().not("id", "is", null);
  if (rows.length > 0) {
    await supabase.from(table).insert(rows);
  }
}

export async function getContent(): Promise<SiteContent> {
  const [
    brandingRes,
    contactRes,
    navLinksRes,
    heroRes,
    heroSlidesRes,
    statsRes,
    faqsRes,
    servicesRes,
    aboutRes,
    aboutValuesRes,
    teamMembersRes,
    blogPostsRes,
    mediaRes,
  ] = await Promise.all([
    supabase.from("branding").select("*").eq("id", 1).maybeSingle(),
    supabase.from("contact_info").select("*").eq("id", 1).maybeSingle(),
    supabase.from("nav_links").select("*").order("position", { ascending: true }),
    supabase.from("hero").select("*").eq("id", 1).maybeSingle(),
    supabase.from("hero_slides").select("*").order("position", { ascending: true }),
    supabase.from("stats").select("*").order("position", { ascending: true }),
    supabase.from("faqs").select("*").order("position", { ascending: true }),
    supabase.from("services").select("*").order("position", { ascending: true }),
    supabase.from("about").select("*").eq("id", 1).maybeSingle(),
    supabase.from("about_values").select("*").order("position", { ascending: true }),
    supabase.from("team_members").select("*").order("position", { ascending: true }),
    supabase.from("blog_posts").select("*").order("position", { ascending: true }),
    supabase.from("media").select("*").order("uploaded_at", { ascending: false }),
  ]);

  const branding = brandingRes.data
    ? { logoUrl: brandingRes.data.logo_url as string }
    : EMPTY_BRANDING;

  const contact = contactRes.data
    ? {
        phoneDisplay: contactRes.data.phone_display,
        phoneHref: contactRes.data.phone_href,
        whatsappNumber: contactRes.data.whatsapp_number,
        email: contactRes.data.email,
        address: contactRes.data.address,
        workingHours: contactRes.data.working_hours,
        mapEmbedUrl: contactRes.data.map_embed_url,
      }
    : EMPTY_CONTACT;

  const navLinks: NavLink[] = (navLinksRes.data ?? []).map((row) => ({
    id: row.id,
    label: row.label,
    href: row.href,
  }));

  const heroRow = heroRes.data;
  const hero: Hero = {
    ...(heroRow
      ? {
          badge: heroRow.badge,
          title: heroRow.title,
          description: heroRow.description,
          ctaPrimaryLabel: heroRow.cta_primary_label,
          ctaPrimaryHref: heroRow.cta_primary_href,
          ctaSecondaryLabel: heroRow.cta_secondary_label,
          ctaSecondaryHref: heroRow.cta_secondary_href,
        }
      : EMPTY_HERO),
    slides: (heroSlidesRes.data ?? []).map((row) => ({ id: row.id, image: row.image, alt: row.alt })),
  };

  const stats: Stat[] = (statsRes.data ?? []).map((row) => ({
    id: row.id,
    label: row.label,
    value: row.value,
  }));

  const faqs: Faq[] = (faqsRes.data ?? []).map((row) => ({
    id: row.id,
    question: row.question,
    answer: row.answer,
  }));

  const services: Service[] = (servicesRes.data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    longDescription: row.long_description ?? [],
    features: row.features ?? [],
    image: row.image,
  }));

  const aboutRow = aboutRes.data;
  const about: About = {
    ...(aboutRow
      ? {
          heroTitle: aboutRow.hero_title,
          heroDescription: aboutRow.hero_description,
          heroImage: aboutRow.hero_image,
          storyTitle: aboutRow.story_title,
          storyParagraphs: aboutRow.story_paragraphs ?? [],
          storyImage: aboutRow.story_image,
          vision: aboutRow.vision,
          mission: aboutRow.mission,
        }
      : EMPTY_ABOUT),
    values: (aboutValuesRes.data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
    })),
    team: (teamMembersRes.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      image: row.image,
    })),
  };

  const blogPosts: BlogPost[] = (blogPostsRes.data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content ?? [],
    category: row.category,
    date: row.post_date,
    readTime: row.read_time,
    image: row.image,
    author: row.author,
  }));

  const media: MediaItem[] = (mediaRes.data ?? []).map((row) => ({
    id: row.id,
    url: row.url,
    name: row.name,
    uploadedAt: row.uploaded_at,
  }));

  return { branding, contact, navLinks, hero, stats, faqs, services, about, blogPosts, media };
}

export async function updateBranding(branding: Branding): Promise<SiteContent> {
  await supabase
    .from("branding")
    .upsert({ id: 1, logo_url: branding.logoUrl, updated_at: new Date().toISOString() });
  return getContent();
}

export async function updateContact(contact: ContactInfo): Promise<SiteContent> {
  await supabase.from("contact_info").upsert({
    id: 1,
    phone_display: contact.phoneDisplay,
    phone_href: contact.phoneHref,
    whatsapp_number: contact.whatsappNumber,
    email: contact.email,
    address: contact.address,
    working_hours: contact.workingHours,
    map_embed_url: contact.mapEmbedUrl,
    updated_at: new Date().toISOString(),
  });
  return getContent();
}

export async function updateNavLinks(navLinks: NavLink[]): Promise<SiteContent> {
  await replaceTable(
    "nav_links",
    navLinks.map((link, index) => ({ id: link.id, label: link.label, href: link.href, position: index })),
  );
  return getContent();
}

export async function updateHero(hero: Hero): Promise<SiteContent> {
  await supabase.from("hero").upsert({
    id: 1,
    badge: hero.badge,
    title: hero.title,
    description: hero.description,
    cta_primary_label: hero.ctaPrimaryLabel,
    cta_primary_href: hero.ctaPrimaryHref,
    cta_secondary_label: hero.ctaSecondaryLabel,
    cta_secondary_href: hero.ctaSecondaryHref,
    updated_at: new Date().toISOString(),
  });
  await replaceTable(
    "hero_slides",
    hero.slides.map((slide, index) => ({ id: slide.id, image: slide.image, alt: slide.alt, position: index })),
  );
  return getContent();
}

export async function updateStats(stats: Stat[]): Promise<SiteContent> {
  await replaceTable(
    "stats",
    stats.map((stat, index) => ({ id: stat.id, label: stat.label, value: stat.value, position: index })),
  );
  return getContent();
}

export async function updateFaqs(faqs: Faq[]): Promise<SiteContent> {
  await replaceTable(
    "faqs",
    faqs.map((faq, index) => ({ id: faq.id, question: faq.question, answer: faq.answer, position: index })),
  );
  return getContent();
}

export async function updateServices(services: Service[]): Promise<SiteContent> {
  await replaceTable(
    "services",
    services.map((service, index) => ({
      id: service.id,
      slug: service.slug,
      title: service.title,
      short_description: service.shortDescription,
      long_description: service.longDescription,
      features: service.features,
      image: service.image,
      position: index,
    })),
  );
  return getContent();
}

export async function updateAbout(about: About): Promise<SiteContent> {
  await supabase.from("about").upsert({
    id: 1,
    hero_title: about.heroTitle,
    hero_description: about.heroDescription,
    hero_image: about.heroImage,
    story_title: about.storyTitle,
    story_paragraphs: about.storyParagraphs,
    story_image: about.storyImage,
    vision: about.vision,
    mission: about.mission,
    updated_at: new Date().toISOString(),
  });
  await replaceTable(
    "about_values",
    about.values.map((value, index) => ({
      id: value.id,
      title: value.title,
      description: value.description,
      position: index,
    })),
  );
  await replaceTable(
    "team_members",
    about.team.map((member, index) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      image: member.image,
      position: index,
    })),
  );
  return getContent();
}

export async function updateBlogPosts(blogPosts: BlogPost[]): Promise<SiteContent> {
  await replaceTable(
    "blog_posts",
    blogPosts.map((post, index) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      post_date: post.date,
      read_time: post.readTime,
      image: post.image,
      author: post.author,
      position: index,
    })),
  );
  return getContent();
}

export async function addMediaItem(item: Omit<MediaItem, "id" | "uploadedAt">): Promise<MediaItem> {
  const mediaItem: MediaItem = { ...item, id: id(), uploadedAt: new Date().toISOString() };
  await supabase
    .from("media")
    .insert({ id: mediaItem.id, url: mediaItem.url, name: mediaItem.name, uploaded_at: mediaItem.uploadedAt });
  return mediaItem;
}

export async function removeMediaItem(mediaId: string): Promise<boolean> {
  const { data } = await supabase.from("media").delete().eq("id", mediaId).select("id");
  return (data?.length ?? 0) > 0;
}

/**
 * Resolves the Google Maps embed URL to actually render for the contact
 * page: the admin's explicit override when set, otherwise a URL derived
 * from the current address. Shared between the admin preview and the
 * public contact page so both always agree.
 */
export function resolveMapEmbedUrl(contact: ContactInfo): string {
  const explicit = contact.mapEmbedUrl.trim();
  if (explicit) return explicit;
  return `https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&output=embed`;
}

export function createId(): string {
  return id();
}
