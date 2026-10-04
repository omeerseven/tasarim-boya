"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Service } from "@/lib/content";

export function LeadForm({
  variant = "quote",
  services,
}: {
  variant?: "quote" | "contact";
  services: Service[];
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [service, setService] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: variant,
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          service,
          message: formData.get("message"),
        }),
      });

      if (!res.ok) throw new Error("Gönderim başarısız");

      setStatus("success");
      form.reset();
      setService("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-gold-300 bg-gold-50 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-gold-600" />
        <p className="font-heading text-lg font-semibold text-navy-950">
          Talebiniz Bize Ulaştı
        </p>
        <p className="text-sm text-muted-foreground">
          En kısa sürede ekibimiz sizinle iletişime geçecektir. Bizi tercih
          ettiğiniz için teşekkür ederiz.
        </p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => setStatus("idle")}
        >
          Yeni Talep Gönder
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor={`${variant}-name`}>Ad Soyad</Label>
        <Input id={`${variant}-name`} name="name" required placeholder="Adınız Soyadınız" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${variant}-phone`}>Telefon</Label>
        <Input
          id={`${variant}-phone`}
          name="phone"
          type="tel"
          required
          placeholder="05XX XXX XX XX"
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={`${variant}-email`}>E-posta</Label>
        <Input
          id={`${variant}-email`}
          name="email"
          type="email"
          placeholder="ornek@eposta.com"
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={`${variant}-service`}>İlgilendiğiniz Hizmet</Label>
        <Select value={service} onValueChange={(value) => setService(value ?? "")}>
          <SelectTrigger id={`${variant}-service`} className="w-full">
            <SelectValue placeholder="Bir hizmet seçin" />
          </SelectTrigger>
          <SelectContent>
            {services.map((s) => (
              <SelectItem key={s.id} value={s.slug}>
                {s.title}
              </SelectItem>
            ))}
            <SelectItem value="diger">Diğer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={`${variant}-message`}>Mesajınız</Label>
        <Textarea
          id={`${variant}-message`}
          name="message"
          required
          rows={4}
          placeholder="Projeniz hakkında bize kısaca bilgi verin (metrekare, mekan tipi, talep ettiğiniz tarih vb.)"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive sm:col-span-2">
          Gönderim sırasında bir sorun oluştu, lütfen tekrar deneyin.
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className="mt-1 w-full bg-navy-950 text-sand-50 hover:bg-navy-800 sm:col-span-2"
        size="lg"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Gönderiliyor...
          </>
        ) : variant === "quote" ? (
          "Ücretsiz Teklif Al"
        ) : (
          "Mesajı Gönder"
        )}
      </Button>
    </form>
  );
}
