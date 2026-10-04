"use client";

import { useRef, useState } from "react";
import { Check, Copy, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/smart-image";
import type { MediaItem } from "@/lib/content";

export function MediaPanel({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Yükleme başarısız.");
      setMedia((prev) => [data.media as MediaItem, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCopy(item: MediaItem) {
    const absoluteUrl = item.url.startsWith("/")
      ? `${window.location.origin}${item.url}`
      : item.url;
    try {
      await navigator.clipboard.writeText(item.url || absoluteUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-navy-950">Medya Kütüphanesi</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Görsel yükleyin, ardından URL&apos;sini kopyalayıp hero slider, hizmet, blog veya ekip
            alanlarına yapıştırın.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-xs font-medium text-destructive">{error}</span>}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          <Button
            type="button"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="bg-navy-950 text-sand-50 hover:bg-navy-800"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Görsel Yükle
          </Button>
        </div>
      </div>

      <div className="p-6">
        {media.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Henüz görsel yüklenmedi. &quot;Görsel Yükle&quot; butonuyla ilk görselinizi ekleyin.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {media.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-muted">
                <div className="relative h-28 w-full">
                  <SmartImage src={item.url} alt={item.name} fill className="object-cover" />
                </div>
                <div className="space-y-2 p-3">
                  <p className="truncate text-xs font-medium text-navy-950" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 flex-1 px-2 text-xs"
                      onClick={() => handleCopy(item)}
                    >
                      {copiedId === item.id ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      {copiedId === item.id ? "Kopyalandı" : "URL Kopyala"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={deletingId === item.id}
                      onClick={() => handleDelete(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
