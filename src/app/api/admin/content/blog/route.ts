import { NextResponse } from "next/server";
import { updateBlogPosts, type BlogPost } from "@/lib/content";

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as BlogPost[] | null;

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Geçersiz blog verisi." }, { status: 400 });
  }

  const slugs = new Set<string>();
  for (const post of body) {
    if (!post.slug || slugs.has(post.slug)) {
      return NextResponse.json(
        { error: "Her blog yazısının benzersiz bir slug değeri olmalıdır." },
        { status: 400 },
      );
    }
    slugs.add(post.slug);
  }

  const content = updateBlogPosts(body);
  return NextResponse.json({ blogPosts: content.blogPosts });
}
