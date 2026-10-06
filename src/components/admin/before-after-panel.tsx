"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { PanelShell, type PanelMessage } from "@/components/admin/panel-shell";
import { ListItemCard, reorder } from "@/components/admin/list-item-card";
import type { BeforeAfterItem } from "@/lib/content";

function newItem(): BeforeAfterItem {
  return { id: crypto.randomUUID(), title: "", beforeImage: "", afterImage: "" };
}

export function BeforeAfterPanel({ initialItems }: { initialItems: BeforeAfterItem[] }) {
  const [items, setItems] = useState<BeforeAfterItem[]>(initialItems);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<PanelMessage>(null);

  function updateItem(id: string, patch: Partial<BeforeAfterItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function handleSave() {
    if (items.some((item) => !item.title.trim() || !item.beforeImage.trim() || !item.afterImage.trim())) {
      setMessage({ type: "error", text: "Her örnek için başlık, öncesi ve sonrası görseli gereklidir." });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/before-after", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
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
      title="Öncesi / Sonrası"
      description="Ana sayfadaki 'Öncesi / Sonrası' bölümünde gösterilen örnekleri ekleyin, kaldırın veya sıralayın."
      onSave={handleSave}
      saving={saving}
      message={message}
      actions={
        <Button type="button" variant="outline" size="sm" onClick={() => setItems((prev) => [...prev, newItem()])}>
          <Plus className="h-4 w-4" />
          Örnek Ekle
        </Button>
      }
    >
      <div className="space-y-5">
        {items.map((item, index) => (
          <ListItemCard
            key={item.id}
            onRemove={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
            onMoveUp={() => setItems((prev) => reorder(prev, index, index - 1))}
            onMoveDown={() => setItems((prev) => reorder(prev, index, index + 1))}
            canMoveUp={index > 0}
            canMoveDown={index < items.length - 1}
          >
            <div className="space-y-1.5">
              <Label>Başlık</Label>
              <Input value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ImageUploadField
                label="Öncesi Görseli"
                value={item.beforeImage}
                onChange={(url) => updateItem(item.id, { beforeImage: url })}
                alt={`${item.title} - öncesi`}
              />
              <ImageUploadField
                label="Sonrası Görseli"
                value={item.afterImage}
                onChange={(url) => updateItem(item.id, { afterImage: url })}
                alt={`${item.title} - sonrası`}
              />
            </div>
          </ListItemCard>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">Henüz örnek eklenmedi.</p>}
      </div>
    </PanelShell>
  );
}
