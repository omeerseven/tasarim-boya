"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, KeyRound, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);

  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth/forgot")
      .then(async (res) => {
        if (!res.ok) {
          setNotConfigured(true);
          return;
        }
        const data = await res.json();
        setQuestion(data.question);
      })
      .catch(() => setNotConfigured(true))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Sıfırlama başarısız.");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sıfırlama başarısız.");
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
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
            </div>
          ) : notConfigured ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-sand-200/80">
                Yönetim paneli henüz kurulmamış. Önce giriş sayfasından
                kurulumu tamamlayın.
              </p>
              <Button
                render={<Link href="/admin/login" />}
                nativeButton={false}
                className="bg-gold-500 text-navy-950 hover:bg-gold-400"
              >
                Giriş Sayfasına Dön
              </Button>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle2 className="h-10 w-10 text-gold-400" />
              <h1 className="font-heading text-lg font-semibold text-sand-50">
                Şifreniz Güncellendi
              </h1>
              <p className="text-sm text-sand-200/70">
                Yeni şifrenizle giriş yapabilirsiniz.
              </p>
              <Button
                render={<Link href="/admin/login" />}
                nativeButton={false}
                className="mt-2 w-full bg-gold-500 text-navy-950 hover:bg-gold-400"
              >
                Giriş Sayfasına Dön
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col items-center gap-2 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                  <KeyRound className="h-6 w-6" />
                </span>
                <h1 className="font-heading text-xl font-semibold text-sand-50">
                  Şifremi Unuttum
                </h1>
                <p className="text-sm text-sand-200/70">
                  Güvenlik sorunuzu yanıtlayarak yeni bir şifre belirleyin.
                </p>
              </div>
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sand-100">Güvenlik Sorusu</Label>
                  <p className="rounded-lg border border-navy-700 bg-navy-950 px-3 py-2 text-sm text-sand-200">
                    {question}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sand-100">Cevabınız</Label>
                  <Input
                    autoFocus
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="border-navy-700 bg-navy-950 text-sand-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sand-100">Yeni Şifre</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-navy-700 bg-navy-950 text-sand-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sand-100">Yeni Şifre (Tekrar)</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Şifreyi Sıfırla
                </Button>
              </form>
              <div className="mt-5 text-center">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-sand-300/80 hover:text-gold-300"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Giriş sayfasına dön
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
