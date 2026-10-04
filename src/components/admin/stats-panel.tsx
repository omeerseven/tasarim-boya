"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PanelShell, type PanelMessage } from "@/components/admin/panel-shell";
import { ListItemCard, reorder } from "@/components/admin/list-item-card";
import type { Stat } from "@/lib/content";

export function StatsPanel({ initialStats }: { initialStats: Stat[] }) {
  const [stats, setStats] = useState<Stat[]>(initialStats);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<PanelMessage>(null);

  function updateStat(id: string, patch: Partial<Stat>) {
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
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
      title="Sayaçlar"
      description="Ana sayfadaki istatistik rakamlarını düzenleyin."
      onSave={handleSave}
      saving={saving}
      message={message}
      actions={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setStats((prev) => [...prev, { id: `new-${crypto.randomUUID()}`, label: "", value: "" }])
          }
        >
          <Plus className="h-4 w-4" />
          Sayaç Ekle
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((stat, index) => (
          <ListItemCard
            key={stat.id}
            onRemove={() => setStats((prev) => prev.filter((s) => s.id !== stat.id))}
            onMoveUp={() => setStats((prev) => reorder(prev, index, index - 1))}
            onMoveDown={() => setStats((prev) => reorder(prev, index, index + 1))}
            canMoveUp={index > 0}
            canMoveDown={index < stats.length - 1}
          >
            <div className="space-y-1.5">
              <Label>Değer</Label>
              <Input value={stat.value} onChange={(e) => updateStat(stat.id, { value: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Etiket</Label>
              <Input value={stat.label} onChange={(e) => updateStat(stat.id, { label: e.target.value })} />
            </div>
          </ListItemCard>
        ))}
      </div>
    </PanelShell>
  );
}
