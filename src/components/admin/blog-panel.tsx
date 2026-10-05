"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/smart-image";
import { PanelShell, type PanelMessage } from "@/components/admin/panel-shell";
import { ListItemCard, reorder } from "@/components/admin/list-item-card";
import type { BlogPost } from "@/lib/content";

function linesToText(lines: string[]): string {
  return lines.join("\n\n");
}

function textToLines(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function newPost(): BlogPost {
  return {
    id: crypto.randomUUID(),
    slug: "",
    title: "",
    excerpt: "",
    content: [],
    category: "",
    date: new Date().toISOString().slice(0, 10),
    readTime: "5 dk",
    image: "",
    author: "Tasarım Boya Ekibi",
  };
}

export function BlogPanel({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<PanelMessage>(null);

  function updatePost(id: string, patch: Partial<BlogPost>) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  async function handleSave() {
    if (posts.some((p) => !p.slug.trim() || !p.title.trim())) {
      setMessage({ type: "error", text: "Her yazının başlığı ve slug değeri olmalıdır." });
      return;
    }
    const slugs = new Set<string>();
    for (const p of posts) {
      if (slugs.has(p.slug)) {
        setMessage({ type: "error", text: `"${p.slug}" slug değeri birden fazla kez kullanılıyor.` });
        return;
      }
      slugs.add(p.slug);
    }

    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(posts),
      });
      if (!res.ok) throw new Error();
      setMessage({ type: "success", text: "Kaydedildi." });
    } catch {
      setMessage({ type: "error", text: "Kaydedilemedi, tekrar deneyin." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <PanelShell
      title="Blog Yazıları"
      description="Blog yazılarını ekleyin, düzenleyin veya kaldırın."
      onSave={handleSave}
      saving={saving}
      message={message}
      actions={
        <Button type="button" variant="outline" size="sm" onClick={() => setPosts((prev) => [newPost(), ...prev])}>
          <Plus className="h-4 w-4" />
          Yazı Ekle
        </Button>
      }
    >
      <div className="space-y-5">
        {posts.map((post, index) => (
          <ListItemCard
            key={post.id}
            onRemove={() => setPosts((prev) => prev.filter((p) => p.id !== post.id))}
            onMoveUp={() => setPosts((prev) => reorder(prev, index, index - 1))}
            onMoveDown={() => setPosts((prev) => reorder(prev, index, index + 1))}
            canMoveUp={index > 0}
            canMoveDown={index < posts.length - 1}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Başlık</Label>
                <Input value={post.title} onChange={(e) => updatePost(post.id, { title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Slug (URL)</Label>
                <Input value={post.slug} onChange={(e) => updatePost(post.id, { slug: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Özet</Label>
              <Textarea rows={2} value={post.excerpt} onChange={(e) => updatePost(post.id, { excerpt: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>İçerik (paragrafları boş satırla ayırın)</Label>
              <Textarea
                rows={6}
                value={linesToText(post.content)}
                onChange={(e) => updatePost(post.id, { content: textToLines(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="space-y-1.5">
                <Label>Kategori</Label>
                <Input value={post.category} onChange={(e) => updatePost(post.id, { category: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Tarih</Label>
                <Input
                  type="date"
                  value={post.date}
                  onChange={(e) => updatePost(post.id, { date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Okuma Süresi</Label>
                <Input value={post.readTime} onChange={(e) => updatePost(post.id, { readTime: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Yazar</Label>
                <Input value={post.author} onChange={(e) => updatePost(post.id, { author: e.target.value })} />
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div className="relative h-20 w-32 flex-none overflow-hidden rounded-lg border border-border bg-muted">
                {post.image ? (
                  <SmartImage src={post.image} alt={post.title || "Önizleme"} fill className="object-cover" />
                ) : null}
              </div>
              <div className="flex-1 space-y-1.5">
                <Label>Görsel URL&apos;si</Label>
                <Input value={post.image} onChange={(e) => updatePost(post.id, { image: e.target.value })} />
              </div>
            </div>
          </ListItemCard>
        ))}
        {posts.length === 0 && <p className="text-sm text-muted-foreground">Henüz blog yazısı eklenmedi.</p>}
      </div>
    </PanelShell>
  );
}
