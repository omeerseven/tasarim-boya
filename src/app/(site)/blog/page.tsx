import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { BlogCard } from "@/components/blog-card";
import { getContent } from "@/lib/content";
import { unsplash, IMG } from "@/lib/unsplash";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Blog";
const PAGE_DESCRIPTION =
  "Boya renk trendleri, duvar kağıdı seçimi, boya bitiş türleri ve ev dekorasyonu üzerine Tasarım Boya uzmanlarından güncel ipuçları ve rehberler.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/blog",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default async function BlogPage() {
  const { blogPosts } = await getContent();
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          <Image
            src={unsplash(IMG.colorPalette, 2000)}
            alt="Boya renk paleti ve numuneleri"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/90 to-navy-950/70" />
        </div>
        <Container className="relative z-10 flex flex-col items-center gap-5 py-24 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
            Blog
          </span>
          <h1 className="max-w-2xl font-heading text-4xl font-semibold text-sand-50 sm:text-5xl">
            İlham Verici İçerikler
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-sand-200/90">
            Renk trendleri, dekorasyon ipuçları ve uygulama rehberleriyle
            mekanlarınız için ilham kaynağı olmayı hedefliyoruz.
          </p>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Öne Çıkan" title="Son Yazılarımız" />

          {featured ? (
            <>
              <div className="mt-12">
                <BlogCard post={featured} featured />
              </div>

              <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            <p className="mt-12 text-center text-sm text-muted-foreground">
              Henüz yayınlanmış bir blog yazısı bulunmuyor.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
