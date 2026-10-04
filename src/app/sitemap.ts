import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const { blogPosts } = getContent();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/hizmetler`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/hakkimizda`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    {
      url: `${SITE_URL}/iletisim`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
