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
import type { Service } from "@/lib/content";

function linesToText(lines: string[]): string {
  return lines.join("\n");
}

function textToLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function newService(): Service {
  return {
    id: `new-${crypto.randomUUID()}`,
    slug: "",
    title: "",
    shortDescription: "",
    longDescription: [],
    features: [],
    image: "",
  };
}

export function ServicesPanel({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<PanelMessage>(null);

  function updateService(id: string, patch: Partial<Service>) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function handleSave() {
    if (services.some((s) => !s.slug.trim() || !s.title.trim())) {
      setMessage({ type: "error", text: "Her hizmetin başlığı ve slug değeri olmalıdır." });
      return;
    }
    const slugs = new Set<string>();
    for (const s of services) {
      if (slugs.has(s.slug)) {
        setMessage({ type: "error", text: `"${s.slug}" slug değeri birden fazla kez kullanılıyor.` });
        return;
      }
      slugs.add(s.slug);
    }

    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services),
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
      title="Hizmetler"
      description="Hizmetler sayfasındaki tüm hizmet kartlarını düzenleyin."
      onSave={handleSave}
      saving={saving}
      message={message}
      actions={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setServices((prev) => [...prev, newService()])}
        >
          <Plus className="h-4 w-4" />
          Hizmet Ekle
        </Button>
      }
    >
      <div className="space-y-5">
        {services.map((service, index) => (
          <ListItemCard
            key={service.id}
            onRemove={() => setServices((prev) => prev.filter((s) => s.id !== service.id))}
            onMoveUp={() => setServices((prev) => reorder(prev, index, index - 1))}
            onMoveDown={() => setServices((prev) => reorder(prev, index, index + 1))}
            canMoveUp={index > 0}
            canMoveDown={index < services.length - 1}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Başlık</Label>
                <Input value={service.title} onChange={(e) => updateService(service.id, { title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Slug (URL)</Label>
                <Input value={service.slug} onChange={(e) => updateService(service.id, { slug: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Kısa Açıklama</Label>
              <Textarea
                rows={2}
                value={service.shortDescription}
                onChange={(e) => updateService(service.id, { shortDescription: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Detaylı Açıklama (her satır bir paragraf)</Label>
              <Textarea
                rows={5}
                value={linesToText(service.longDescription)}
                onChange={(e) => updateService(service.id, { longDescription: textToLines(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Özellikler (her satır bir madde)</Label>
              <Textarea
                rows={4}
                value={linesToText(service.features)}
                onChange={(e) => updateService(service.id, { features: textToLines(e.target.value) })}
              />
            </div>
            <div className="flex items-end gap-4">
              <div className="relative h-20 w-32 flex-none overflow-hidden rounded-lg border border-border bg-muted">
                {service.image ? (
                  <SmartImage src={service.image} alt={service.title || "Önizleme"} fill className="object-cover" />
                ) : null}
              </div>
              <div className="flex-1 space-y-1.5">
                <Label>Görsel URL&apos;si</Label>
                <Input value={service.image} onChange={(e) => updateService(service.id, { image: e.target.value })} />
              </div>
            </div>
          </ListItemCard>
        ))}
        {services.length === 0 && <p className="text-sm text-muted-foreground">Henüz hizmet eklenmedi.</p>}
      </div>
    </PanelShell>
  );
}
