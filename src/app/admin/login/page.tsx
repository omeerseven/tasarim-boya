"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [nextPath] = useState(() => {
    if (typeof window === "undefined") return "/admin";
    const next = new URLSearchParams(window.location.search).get("next");
    return next && next.startsWith("/admin") ? next : "/admin";
  });

  // Login state
  const [password, setPassword] = useState("");

  // Setup state
  const [setupPassword, setSetupPassword] = useState("");
  const [setupConfirm, setSetupConfirm] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth/status")
      .then((res) => res.json())
      .then((data) => setConfigured(Boolean(data.configured)))
      .catch(() => setConfigured(true))
      .finally(() => setChecking(false));
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Giriş başarısız.");
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSetup(e: FormEvent) {
    e.preventDefault();
    if (setupPassword.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }
    if (setupPassword !== setupConfirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (!securityQuestion.trim() || !securityAnswer.trim()) {
      setError("Güvenlik sorusu ve cevabı zorunludur.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: setupPassword,
          securityQuestion,
          securityAnswer,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kurulum başarısız.");
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kurulum başarısız.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo dark />
        </div>

        <div className="rounded-3xl border border-navy-800 bg-navy-900/60 p-8 shadow-2xl backdrop-blur">
          {checking ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
            </div>
          ) : configured ? (
            <>
              <div className="mb-6 flex flex-col items-center gap-2 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                  <Lock className="h-6 w-6" />
                </span>
                <h1 className="font-heading text-xl font-semibold text-sand-50">
                  Yönetim Paneli Girişi
                </h1>
                <p className="text-sm text-sand-200/70">
                  Devam etmek için şifrenizi girin.
                </p>
              </div>
              <form onSubmit={handleLogin} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sand-100">Şifre</Label>
                  <Input
                    type="password"
                    autoFocus
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-navy-700 bg-navy-950 text-sand-50"
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold-500 text-navy-950 hover:bg-gold-400"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Giriş Yap
                </Button>
              </form>
              <div className="mt-5 text-center">
                <Link
                  href="/admin/sifremi-unuttum"
                  className="text-xs font-medium text-sand-300/80 hover:text-gold-300"
                >
                  Şifremi Unuttum
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex flex-col items-center gap-2 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <h1 className="font-heading text-xl font-semibold text-sand-50">
                  Yönetim Paneli Kurulumu
                </h1>
                <p className="text-sm text-sand-200/70">
                  İlk kullanım: panel şifrenizi ve şifre sıfırlama için bir
                  güvenlik sorusu belirleyin.
                </p>
              </div>
              <form onSubmit={handleSetup} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sand-100">Şifre</Label>
                  <Input
                    type="password"
                    required
                    value={setupPassword}
                    onChange={(e) => setSetupPassword(e.target.value)}
                    className="border-navy-700 bg-navy-950 text-sand-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sand-100">Şifre (Tekrar)</Label>
                  <Input
                    type="password"
                    required
                    value={setupConfirm}
                    onChange={(e) => setSetupConfirm(e.target.value)}
                    className="border-navy-700 bg-navy-950 text-sand-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sand-100">Güvenlik Sorusu</Label>
                  <Input
                    required
                    placeholder="Örn: İlk projemizin yapıldığı ilçe neresidir?"
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    className="border-navy-700 bg-navy-950 text-sand-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sand-100">Cevap</Label>
                  <Input
                    required
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="border-navy-700 bg-navy-950 text-sand-50"
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold-500 text-navy-950 hover:bg-gold-400"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Kurulumu Tamamla ve Giriş Yap
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
