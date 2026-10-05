"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { PanelShell, type PanelMessage } from "@/components/admin/panel-shell";
import { ListItemCard, reorder } from "@/components/admin/list-item-card";
import type { Hero, HeroSlide } from "@/lib/content";

function newSlide(): HeroSlide {
  return { id: crypto.randomUUID(), image: "", alt: "" };
}

export function HeroPanel({ initialHero }: { initialHero: Hero }) {
  const [hero, setHero] = useState<Hero>(initialHero);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<PanelMessage>(null);

  function updateField<K extends keyof Hero>(key: K, value: Hero[K]) {
    setHero((prev) => ({ ...prev, [key]: value }));
  }

  function updateSlide(id: string, patch: Partial<HeroSlide>) {
    setHero((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  }

  function removeSlide(id: string) {
    setHero((prev) => ({ ...prev, slides: prev.slides.filter((s) => s.id !== id) }));
  }

  function moveSlide(index: number, direction: -1 | 1) {
    setHero((prev) => ({ ...prev, slides: reorder(prev.slides, index, index + direction) }));
  }

  async function handleSave() {
    if (hero.slides.length === 0) {
      setMessage({ type: "error", text: "En az bir slider görseli eklemelisiniz." });
      return;
    }
    if (hero.slides.some((s) => !s.image.trim())) {
      setMessage({ type: "error", text: "Tüm slider alanları için bir görsel yüklenmelidir." });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero),
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
    <div className="space-y-6">
      <PanelShell
        title="Hero Metinleri"
        description="Ana sayfanın en üstünde görünen başlık, açıklama ve buton metinleri."
        onSave={handleSave}
        saving={saving}
        message={message}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Rozet (Badge) Metni</Label>
            <Input value={hero.badge} onChange={(e) => updateField("badge", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Başlık</Label>
            <Input value={hero.title} onChange={(e) => updateField("title", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Açıklama</Label>
            <Textarea
              rows={3}
              value={hero.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Birincil Buton Metni</Label>
            <Input
              value={hero.ctaPrimaryLabel}
              onChange={(e) => updateField("ctaPrimaryLabel", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Birincil Buton Linki</Label>
            <Input
              value={hero.ctaPrimaryHref}
              onChange={(e) => updateField("ctaPrimaryHref", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>İkincil Buton Metni</Label>
            <Input
              value={hero.ctaSecondaryLabel}
              onChange={(e) => updateField("ctaSecondaryLabel", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>İkincil Buton Linki</Label>
            <Input
              value={hero.ctaSecondaryHref}
              onChange={(e) => updateField("ctaSecondaryHref", e.target.value)}
            />
          </div>
        </div>
      </PanelShell>

      <PanelShell
        title="Hero Slider Görselleri"
        description="Ana sayfada dönen görselleri ekleyin, kaldırın veya sıralayın."
        onSave={handleSave}
        saving={saving}
        message={message}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setHero((prev) => ({ ...prev, slides: [...prev.slides, newSlide()] }))}
          >
            <Plus className="h-4 w-4" />
            Görsel Ekle
          </Button>
        }
      >
        <div className="space-y-4">
          {hero.slides.map((slide, index) => (
            <ListItemCard
              key={slide.id}
              onRemove={() => removeSlide(slide.id)}
              onMoveUp={() => moveSlide(index, -1)}
              onMoveDown={() => moveSlide(index, 1)}
              canMoveUp={index > 0}
              canMoveDown={index < hero.slides.length - 1}
            >
              <div className="space-y-3">
                <ImageUploadField
                  value={slide.image}
                  onChange={(url) => updateSlide(slide.id, { image: url })}
                  alt={slide.alt}
                />
                <Input
                  placeholder="Alternatif metin (alt)"
                  value={slide.alt}
                  onChange={(e) => updateSlide(slide.id, { alt: e.target.value })}
                />
              </div>
            </ListItemCard>
          ))}
          {hero.slides.length === 0 && (
            <p className="text-sm text-muted-foreground">Henüz slider görseli eklenmedi.</p>
          )}
        </div>
      </PanelShell>
    </div>
  );
}
