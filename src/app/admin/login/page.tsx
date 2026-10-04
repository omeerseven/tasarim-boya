"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [nextPath] = useState(() => {
    if (typeof window === "undefined") return "/admin";
    const next = new URLSearchParams(window.location.search).get("next");
    return next && next.startsWith("/admin") ? next : "/admin";
  });

  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo dark />
        </div>

        <div className="rounded-3xl border border-navy-800 bg-navy-900/60 p-8 shadow-2xl backdrop-blur">
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
        </div>
      </div>
    </div>
  );
}
