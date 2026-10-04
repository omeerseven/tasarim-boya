"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PanelShell, type PanelMessage } from "@/components/admin/panel-shell";
import type { ContactInfo } from "@/lib/content";

function resolveMapPreviewSrc(contact: ContactInfo): string {
  const trimmed = contact.mapEmbedUrl.trim();
  if (trimmed.startsWith("https://")) return trimmed;
  const iframeMatch = trimmed.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  if (iframeMatch?.[1]?.startsWith("https://")) return iframeMatch[1];
  return `https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&output=embed`;
}

export function ContactPanel({ initialContact }: { initialContact: ContactInfo }) {
  const [contact, setContact] = useState<ContactInfo>(initialContact);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<PanelMessage>(null);
  const previewSrc = resolveMapPreviewSrc(contact);

  function updateField<K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) {
    setContact((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      if (!res.ok) throw new Error();
      setMessage({ type: "success", text: "Kaydedildi, sitede anında aktif." });
    } catch {
      setMessage({ type: "error", text: "Kaydedilemedi, tekrar deneyin." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <PanelShell
      title="İletişim Bilgileri"
      description="Telefon, WhatsApp, e-posta ve adres; sitenin her yerinde (header, footer, sağ alt sabit butonlar, iletişim sayfası) otomatik güncellenir."
      onSave={handleSave}
      saving={saving}
      message={message}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Görüntülenen Telefon</Label>
          <Input
            placeholder="0216 555 01 23"
            value={contact.phoneDisplay}
            onChange={(e) => updateField("phoneDisplay", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Arama İçin Telefon (ülke koduyla, + işaretiyle)</Label>
          <Input
            placeholder="+902165550123"
            value={contact.phoneHref}
            onChange={(e) => updateField("phoneHref", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>WhatsApp Numarası (ülke koduyla, + işaretsiz)</Label>
          <Input
            placeholder="902165550123"
            value={contact.whatsappNumber}
            onChange={(e) => updateField("whatsappNumber", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>E-posta</Label>
          <Input
            type="email"
            placeholder="info@tasarimboya.com"
            value={contact.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Adres</Label>
          <Input
            value={contact.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Çalışma Saatleri</Label>
          <Input
            value={contact.workingHours}
            onChange={(e) => updateField("workingHours", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Harita (Google Maps Embed Kodu veya URL&apos;si)</Label>
        <Textarea
          rows={3}
          placeholder='Örn: https://www.google.com/maps?q=...&output=embed veya <iframe src="...">...</iframe>'
          value={contact.mapEmbedUrl}
          onChange={(e) => updateField("mapEmbedUrl", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Google Maps&apos;te konumu açın → Paylaş → Harita Göm sekmesinden
          aldığınız &lt;iframe&gt; kodunu veya doğrudan embed URL&apos;sini
          yapıştırın. Boş bırakırsanız harita yukarıdaki adresten otomatik
          oluşturulur.
        </p>
        <div className="mt-2 overflow-hidden rounded-lg border border-border">
          <iframe
            key={previewSrc}
            title="Harita önizlemesi"
            src={previewSrc}
            className="h-40 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </PanelShell>
  );
}
