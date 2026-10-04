import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { ServiceCard } from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { unsplash, IMG } from "@/lib/unsplash";
import { getContent } from "@/lib/content";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Hizmetlerimiz";
const PAGE_DESCRIPTION =
  "İç boya badana, dış cephe boyama, dekoratif boya ve desen uygulamaları, kartonpiyer-alçıpan ile anahtar teslim tadilat hizmetlerimizi inceleyin, ücretsiz keşif talep edin.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/hizmetler" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/hizmetler",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default async function ServicesPage() {
  const { services } = await getContent();
  return (
    <>
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          <Image
            src={unsplash(IMG.painterAtWork, 2000)}
            alt="Tasarım Boya ustası uygulama yapıyor"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/90 to-navy-950/70" />
        </div>
        <Container className="relative z-10 flex flex-col items-center gap-5 py-24 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
            Hizmetlerimiz
          </span>
          <h1 className="max-w-2xl font-heading text-4xl font-semibold text-sand-50 sm:text-5xl">
            Her Mekana Özel, Uçtan Uca Çözümler
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-sand-200/90">
            İç mekandan dış cepheye, dekoratif detaylardan anahtar teslim
            tadilata kadar; projenizin her aşamasında yanınızdayız.
          </p>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="flex flex-col gap-12">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </Container>
      </section>

      <section className="bg-sand-100 py-16">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-heading text-2xl font-semibold text-navy-950 sm:text-3xl">
            Hangi Hizmete İhtiyacınız Olduğundan Emin Değil misiniz?
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Ücretsiz keşif talebinde bulunun, uzman ekibimiz mekanınızı
            inceleyip size en uygun çözümü önersin.
          </p>
          <Button
            render={<Link href="/iletisim" />}
            nativeButton={false}
            size="lg"
            className="bg-navy-950 text-sand-50 hover:bg-navy-800"
          >
            Ücretsiz Keşif Talep Et
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Container>
      </section>
    </>
  );
}
