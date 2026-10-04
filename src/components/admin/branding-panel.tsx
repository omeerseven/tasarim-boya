"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/smart-image";
import type { Branding } from "@/lib/content";

export function BrandingPanel({ initialBranding }: { initialBranding: Branding }) {
  const [branding, setBranding] = useState<Branding>(initialBranding);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelected(file: File) {
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/admin/media", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData?.error || "Yükleme başarısız.");

      const logoUrl = uploadData.media.url as string;
      const saveRes = await fetch("/api/admin/content/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoUrl }),
      });
      if (!saveRes.ok) throw new Error("Logo kaydedilemedi.");

      setBranding({ logoUrl });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logo güncellenemedi.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-slate-900">Logo Yönetimi</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Üst menü ve alt bilgi alanındaki kurumsal logoyu güncelleyin.
          </p>
        </div>
        {success && <span className="text-xs font-medium text-emerald-600">Logo güncellendi.</span>}
        {error && <span className="text-xs font-medium text-destructive">{error}</span>}
      </div>

      <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
        <div className="flex h-28 w-28 flex-none items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4">
          {branding.logoUrl ? (
            <SmartImage
              src={branding.logoUrl}
              alt="Mevcut logo"
              width={96}
              height={96}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xs text-slate-400">Logo yok</span>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-sm text-slate-500">
            PNG, JPG, WEBP veya SVG formatında, tercihen şeffaf arka planlı bir
            logo dosyası yükleyin. Yüklendiği anda ana sayfadaki header ve
            footer otomatik olarak güncellenir.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelected(file);
            }}
          />
          <Button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="bg-navy-950 text-sand-50 hover:bg-navy-800"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Yeni Logo Yükle
          </Button>
        </div>
      </div>
    </div>
  );
}
