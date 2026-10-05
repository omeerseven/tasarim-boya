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
import type { About, AboutValue, TeamMember } from "@/lib/content";

function linesToText(lines: string[]): string {
  return lines.join("\n\n");
}

function textToLines(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export function AboutPanel({ initialAbout }: { initialAbout: About }) {
  const [about, setAbout] = useState<About>(initialAbout);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<PanelMessage>(null);

  function updateField<K extends keyof About>(key: K, value: About[K]) {
    setAbout((prev) => ({ ...prev, [key]: value }));
  }

  function updateValue(id: string, patch: Partial<AboutValue>) {
    setAbout((prev) => ({
      ...prev,
      values: prev.values.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    }));
  }

  function updateTeamMember(id: string, patch: Partial<TeamMember>) {
    setAbout((prev) => ({
      ...prev,
      team: prev.team.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
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
        title="Hakkımızda — Üst Bölüm"
        onSave={handleSave}
        saving={saving}
        message={message}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Başlık</Label>
            <Input value={about.heroTitle} onChange={(e) => updateField("heroTitle", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Açıklama</Label>
            <Textarea
              rows={3}
              value={about.heroDescription}
              onChange={(e) => updateField("heroDescription", e.target.value)}
            />
          </div>
          <div className="flex items-end gap-4">
            <div className="relative h-20 w-32 flex-none overflow-hidden rounded-lg border border-border bg-muted">
              {about.heroImage ? (
                <SmartImage src={about.heroImage} alt="Önizleme" fill className="object-cover" />
              ) : null}
            </div>
            <div className="flex-1 space-y-1.5">
              <Label>Arka Plan Görsel URL&apos;si</Label>
              <Input value={about.heroImage} onChange={(e) => updateField("heroImage", e.target.value)} />
            </div>
          </div>
        </div>
      </PanelShell>

      <PanelShell title="Hikayemiz" onSave={handleSave} saving={saving} message={message}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Bölüm Başlığı</Label>
            <Input value={about.storyTitle} onChange={(e) => updateField("storyTitle", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Paragraflar (boş satırla ayırın)</Label>
            <Textarea
              rows={8}
              value={linesToText(about.storyParagraphs)}
              onChange={(e) => updateField("storyParagraphs", textToLines(e.target.value))}
            />
          </div>
          <div className="flex items-end gap-4">
            <div className="relative h-20 w-32 flex-none overflow-hidden rounded-lg border border-border bg-muted">
              {about.storyImage ? (
                <SmartImage src={about.storyImage} alt="Önizleme" fill className="object-cover" />
              ) : null}
            </div>
            <div className="flex-1 space-y-1.5">
              <Label>Görsel URL&apos;si</Label>
              <Input value={about.storyImage} onChange={(e) => updateField("storyImage", e.target.value)} />
            </div>
          </div>
        </div>
      </PanelShell>

      <PanelShell title="Vizyon & Misyon" onSave={handleSave} saving={saving} message={message}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Vizyonumuz</Label>
            <Textarea rows={4} value={about.vision} onChange={(e) => updateField("vision", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Misyonumuz</Label>
            <Textarea rows={4} value={about.mission} onChange={(e) => updateField("mission", e.target.value)} />
          </div>
        </div>
      </PanelShell>

      <PanelShell
        title="Çalışma Prensiplerimiz (Değerler)"
        onSave={handleSave}
        saving={saving}
        message={message}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setAbout((prev) => ({
                ...prev,
                values: [...prev.values, { id: crypto.randomUUID(), title: "", description: "" }],
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Değer Ekle
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {about.values.map((value, index) => (
            <ListItemCard
              key={value.id}
              onRemove={() =>
                setAbout((prev) => ({ ...prev, values: prev.values.filter((v) => v.id !== value.id) }))
              }
              onMoveUp={() => setAbout((prev) => ({ ...prev, values: reorder(prev.values, index, index - 1) }))}
              onMoveDown={() => setAbout((prev) => ({ ...prev, values: reorder(prev.values, index, index + 1) }))}
              canMoveUp={index > 0}
              canMoveDown={index < about.values.length - 1}
            >
              <div className="space-y-1.5">
                <Label>Başlık</Label>
                <Input value={value.title} onChange={(e) => updateValue(value.id, { title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Açıklama</Label>
                <Textarea
                  rows={3}
                  value={value.description}
                  onChange={(e) => updateValue(value.id, { description: e.target.value })}
                />
              </div>
            </ListItemCard>
          ))}
        </div>
      </PanelShell>

      <PanelShell
        title="Ekip"
        onSave={handleSave}
        saving={saving}
        message={message}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setAbout((prev) => ({
                ...prev,
                team: [...prev.team, { id: crypto.randomUUID(), name: "", role: "", image: "" }],
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Ekip Üyesi Ekle
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {about.team.map((member, index) => (
            <ListItemCard
              key={member.id}
              onRemove={() =>
                setAbout((prev) => ({ ...prev, team: prev.team.filter((t) => t.id !== member.id) }))
              }
              onMoveUp={() => setAbout((prev) => ({ ...prev, team: reorder(prev.team, index, index - 1) }))}
              onMoveDown={() => setAbout((prev) => ({ ...prev, team: reorder(prev.team, index, index + 1) }))}
              canMoveUp={index > 0}
              canMoveDown={index < about.team.length - 1}
            >
              <div className="flex items-start gap-3">
                <div className="relative h-16 w-16 flex-none overflow-hidden rounded-full border border-border bg-muted">
                  {member.image ? (
                    <SmartImage src={member.image} alt={member.name || "Önizleme"} fill className="object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Ad Soyad"
                    value={member.name}
                    onChange={(e) => updateTeamMember(member.id, { name: e.target.value })}
                  />
                  <Input
                    placeholder="Unvan"
                    value={member.role}
                    onChange={(e) => updateTeamMember(member.id, { role: e.target.value })}
                  />
                </div>
              </div>
              <Input
                placeholder="Görsel URL'si"
                value={member.image}
                onChange={(e) => updateTeamMember(member.id, { image: e.target.value })}
              />
            </ListItemCard>
          ))}
        </div>
      </PanelShell>
    </div>
  );
}
