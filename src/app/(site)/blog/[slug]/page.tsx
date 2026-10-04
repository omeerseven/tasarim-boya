import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, Clock, User } from "lucide-react";
import { Container } from "@/components/container";
import { BlogCard } from "@/components/blog-card";
import { SmartImage } from "@/components/smart-image";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  const { blogPosts } = await getContent();
  return blogPosts.find((post) => post.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.category, "Tasarım Boya", "boya blog", "dekorasyon"],
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const { blogPosts } = await getContent();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-gold-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Tüm Yazılar
        </Link>

        <span className="mt-6 inline-flex rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
          {post.category}
        </span>
        <h1 className="mt-4 font-heading text-3xl font-semibold leading-tight text-navy-950 sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {post.readTime} okuma
          </span>
        </div>

        <div className="relative mt-8 h-72 w-full overflow-hidden rounded-3xl sm:h-96">
          <SmartImage
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="mt-10 space-y-5">
          {post.content.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>
      </Container>

      {relatedPosts.length > 0 && (
        <Container className="mt-20">
          <h2 className="font-heading text-2xl font-semibold text-navy-950">
            Diğer Yazılarımız
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <BlogCard key={related.id} post={related} />
            ))}
          </div>
        </Container>
      )}
    </article>
  );
}
