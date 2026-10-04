import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/content";
import { SmartImage } from "@/components/smart-image";
import { Badge } from "@/components/ui/badge";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className={`relative w-full ${featured ? "h-72" : "h-52"}`}>
          <SmartImage
            src={post.image}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge className="absolute left-4 top-4 bg-gold-500 text-navy-950 hover:bg-gold-500">
            {post.category}
          </Badge>
        </div>
      </Link>
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-heading text-lg font-semibold text-navy-950 transition-colors group-hover:text-gold-600">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 transition-colors group-hover:text-gold-600"
        >
          Devamını Oku
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
