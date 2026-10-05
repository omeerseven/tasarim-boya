"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PanelShell, type PanelMessage } from "@/components/admin/panel-shell";
import { ListItemCard, reorder } from "@/components/admin/list-item-card";
import type { NavLink } from "@/lib/content";

export function NavLinksPanel({ initialNavLinks }: { initialNavLinks: NavLink[] }) {
  const [navLinks, setNavLinks] = useState<NavLink[]>(initialNavLinks);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<PanelMessage>(null);

  function updateLink(id: string, patch: Partial<NavLink>) {
    setNavLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  async function handleSave() {
    if (navLinks.some((l) => !l.label.trim() || !l.href.trim())) {
      setMessage({ type: "error", text: "Her bağlantının etiketi ve adresi olmalıdır." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/nav-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(navLinks),
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
      title="Üst Menü Bağlantıları"
      description="Header ve footer'daki menü öğelerini, sırasını ve hedef adreslerini düzenleyin."
      onSave={handleSave}
      saving={saving}
      message={message}
      actions={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setNavLinks((prev) => [...prev, { id: crypto.randomUUID(), label: "", href: "/" }])
          }
        >
          <Plus className="h-4 w-4" />
          Bağlantı Ekle
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {navLinks.map((link, index) => (
          <ListItemCard
            key={link.id}
            onRemove={() => setNavLinks((prev) => prev.filter((l) => l.id !== link.id))}
            onMoveUp={() => setNavLinks((prev) => reorder(prev, index, index - 1))}
            onMoveDown={() => setNavLinks((prev) => reorder(prev, index, index + 1))}
            canMoveUp={index > 0}
            canMoveDown={index < navLinks.length - 1}
          >
            <div className="space-y-1.5">
              <Label>Etiket</Label>
              <Input value={link.label} onChange={(e) => updateLink(link.id, { label: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Adres</Label>
              <Input value={link.href} onChange={(e) => updateLink(link.id, { href: e.target.value })} />
            </div>
          </ListItemCard>
        ))}
      </div>
    </PanelShell>
  );
}
