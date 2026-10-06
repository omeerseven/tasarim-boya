"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { SmartImage } from "@/components/smart-image";

/**
 * Multi-file variant of ImageUploadField: uploads one or more files to
 * Supabase Storage via /api/admin/media and maintains an ordered list of
 * public URLs. The surrounding form still owns persistence.
 */
export function MultiImageUploadField({
  label,
  values,
  onChange,
}: {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFilesSelected(files: FileList) {
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/media", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Yükleme başarısız.");
        uploaded.push(data.media.url as string);
      }
      onChange([...values, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  function moveTo(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-1.5">
      {label && <Label>{label}</Label>}
      <div className="flex flex-wrap gap-3">
        {values.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative h-20 w-28 flex-none overflow-hidden rounded-lg border border-border bg-muted"
          >
            <SmartImage src={url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label="Görseli kaldır"
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy-950/70 text-white transition hover:bg-destructive"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-navy-950/70 py-0.5">
              <button
                type="button"
                onClick={() => moveTo(index, -1)}
                disabled={index === 0}
                aria-label="Sola taşı"
                className="flex h-5 w-5 items-center justify-center rounded text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => moveTo(index, 1)}
                disabled={index === values.length - 1}
                aria-label="Sağa taşı"
                className="flex h-5 w-5 items-center justify-center rounded text-white disabled:opacity-30"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          aria-label="Görsel ekle"
          className="flex h-20 w-28 flex-none items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground transition hover:bg-accent disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) handleFilesSelected(e.target.files);
        }}
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
