"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SmartImage } from "@/components/smart-image";
import { cn } from "cn";

/**
 * File-upload replacement for the old "paste an image URL" text inputs.
 * Uploads directly to Supabase Storage via /api/admin/media and hands the
 * resulting public URL back through onChange — the surrounding form still
 * owns persistence (its own Save button writes that URL to content tables).
 */
export function ImageUploadField({
  label,
  value,
  onChange,
  alt,
  shape = "rect",
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  alt?: string;
  shape?: "rect" | "circle";
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelected(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Yükleme başarısız.");
      onChange(data.media.url as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-end gap-4">
      <div
        className={cn(
          "relative flex-none overflow-hidden border border-border bg-muted",
          shape === "circle" ? "h-16 w-16 rounded-full" : "h-20 w-32 rounded-lg",
        )}
      >
        {value ? <SmartImage src={value} alt={alt || "Önizleme"} fill className="object-cover" /> : null}
      </div>
      <div className="flex-1 space-y-1.5">
        {label && <Label>{label}</Label>}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelected(file);
          }}
        />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {value ? "Değiştir" : "Dosya Yükle"}
          </Button>
          {value && !uploading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
              Kaldır
            </Button>
          )}
        </div>
        {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
    </div>
  );
}
