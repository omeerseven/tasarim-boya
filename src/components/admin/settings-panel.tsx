"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PanelShell, type PanelMessage } from "@/components/admin/panel-shell";
import { ContactPanel } from "@/components/admin/contact-panel";
import type { ContactInfo } from "@/lib/content";

export function SettingsPanel({
  initialContact,
}: {
  initialContact: ContactInfo;
}) {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<PanelMessage>(null);

  const [questionPassword, setQuestionPassword] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionSaving, setQuestionSaving] = useState(false);
  const [questionMessage, setQuestionMessage] = useState<PanelMessage>(null);

  async function handlePasswordSave(e?: FormEvent) {
    e?.preventDefault();
    if (newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "Yeni şifre en az 8 karakter olmalıdır." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Yeni şifreler eşleşmiyor." });
      return;
    }
    setPasswordSaving(true);
    setPasswordMessage(null);
    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Şifre güncellenemedi.");
      setPasswordMessage({ type: "success", text: "Şifre güncellendi." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Şifre güncellenemedi.",
      });
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleQuestionSave(e?: FormEvent) {
    e?.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setQuestionMessage({ type: "error", text: "Soru ve cevap zorunludur." });
      return;
    }
    setQuestionSaving(true);
    setQuestionMessage(null);
    try {
      const res = await fetch("/api/admin/auth/security-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: questionPassword, question, answer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Güncellenemedi.");
      setQuestionMessage({ type: "success", text: "Güvenlik sorusu güncellendi." });
      setQuestionPassword("");
      setQuestion("");
      setAnswer("");
    } catch (err) {
      setQuestionMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Güncellenemedi.",
      });
    } finally {
      setQuestionSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <ContactPanel initialContact={initialContact} />

      <PanelShell
        title="Şifre Değiştir"
        onSave={handlePasswordSave}
        saving={passwordSaving}
        message={passwordMessage}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Mevcut Şifre</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Yeni Şifre</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Yeni Şifre (Tekrar)</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </PanelShell>

      <PanelShell
        title="Güvenlik Sorusu"
        description="Şifrenizi unutursanız kullanılacak soru ve cevabı güncelleyin."
        onSave={handleQuestionSave}
        saving={questionSaving}
        message={questionMessage}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Mevcut Şifre</Label>
            <Input
              type="password"
              value={questionPassword}
              onChange={(e) => setQuestionPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Güvenlik Sorusu</Label>
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Cevap</Label>
            <Input value={answer} onChange={(e) => setAnswer(e.target.value)} />
          </div>
        </div>
      </PanelShell>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg font-semibold text-navy-950">Oturum</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Yönetim panelinden güvenli bir şekilde çıkış yapın.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </Button>
        </div>
      </div>
    </div>
  );
}
