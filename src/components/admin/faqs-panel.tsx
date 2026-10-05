"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PanelShell, type PanelMessage } from "@/components/admin/panel-shell";
import { ListItemCard, reorder } from "@/components/admin/list-item-card";
import type { Faq } from "@/lib/content";

export function FaqsPanel({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<PanelMessage>(null);

  function updateFaq(id: string, patch: Partial<Faq>) {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqs),
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
      title="Sıkça Sorulan Sorular"
      description="Ana sayfadaki SSS bölümünü yönetin."
      onSave={handleSave}
      saving={saving}
      message={message}
      actions={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setFaqs((prev) => [
              ...prev,
              { id: crypto.randomUUID(), question: "", answer: "" },
            ])
          }
        >
          <Plus className="h-4 w-4" />
          Soru Ekle
        </Button>
      }
    >
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <ListItemCard
            key={faq.id}
            onRemove={() => setFaqs((prev) => prev.filter((f) => f.id !== faq.id))}
            onMoveUp={() => setFaqs((prev) => reorder(prev, index, index - 1))}
            onMoveDown={() => setFaqs((prev) => reorder(prev, index, index + 1))}
            canMoveUp={index > 0}
            canMoveDown={index < faqs.length - 1}
          >
            <div className="space-y-1.5">
              <Label>Soru</Label>
              <Input value={faq.question} onChange={(e) => updateFaq(faq.id, { question: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Cevap</Label>
              <Textarea rows={3} value={faq.answer} onChange={(e) => updateFaq(faq.id, { answer: e.target.value })} />
            </div>
          </ListItemCard>
        ))}
        {faqs.length === 0 && <p className="text-sm text-muted-foreground">Henüz soru eklenmedi.</p>}
      </div>
    </PanelShell>
  );
}
