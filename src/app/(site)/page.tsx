import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, PaintBucket, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/hero-slider";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { FaqSection } from "@/components/faq-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { LeadForm } from "@/components/lead-form";
import { SmartImage } from "@/components/smart-image";
import { beforeAfterItems, processSteps } from "@/lib/data";
import { getContent } from "@/lib/content";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "İstanbul Boya Badana, Dekorasyon ve Tadilat Hizmetleri";
const PAGE_DESCRIPTION =
  "Tasarım Boya ile İstanbul'da iç/dış cephe boya badana, dekoratif duvar uygulamaları, kartonpiyer-alçıpan ve anahtar teslim tadilat hizmetlerinde ücretsiz keşif ve şeffaf fiyatlandırma.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

const highlights = [
  {
    icon: PaintBucket,
    title: "Kaliteli Malzeme",
    description: "Uzun ömürlü, sağlığa duyarlı ve düşük kokulu boya sistemleri.",
  },
  {
    icon: Users,
    title: "Uzman Ekip",
    description: "14 yılı aşan deneyime sahip, özenli ve disiplinli usta kadrosu.",
  },
  {
    icon: ShieldCheck,
    title: "İşçilik Garantisi",
    description: "Tüm uygulamalarımızda yazılı garanti ve şeffaf süreç yönetimi.",
  },
  {
    icon: Sparkles,
    title: "Özel Tasarım",
    description: "Mekanınıza özel renk, doku ve dekoratif uygulama danışmanlığı.",
  },
];

export default async function HomePage() {
  const { hero, stats, services, faqs } = await getContent();

  return (
    <>
      <HeroSlider hero={hero} />

      {/* Stats */}
      <section className="border-b border-border bg-sand-50">
        <Container className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <p className="font-heading text-3xl font-semibold text-navy-950 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </Container>
      </section>

      {/* Highlights */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Neden Tasarım Boya"
            title="Her Projede Aynı Titizlik, Aynı Güven"
            description="14 yılı aşan tecrübemizle konut ve ticari mekanlarda kaliteli malzeme, uzman işçilik ve şeffaf süreç yönetimi sunuyoruz."
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-950 text-gold-400">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="font-heading text-lg font-semibold text-navy-950">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services teaser */}
      <section className="bg-sand-50 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Hizmetlerimiz"
            title="İhtiyacınıza Uygun Çözümler"
            description="İç mekandan dış cepheye, dekoratif detaylardan anahtar teslim tadilata kadar geniş bir hizmet yelpazesi sunuyoruz."
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/hizmetler#${service.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-48 w-full">
                  <SmartImage
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-navy-950 transition-colors group-hover:text-gold-600">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.shortDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button
              render={<Link href="/hizmetler" />}
              nativeButton={false}
              size="lg"
              className="bg-navy-950 text-sand-50 hover:bg-navy-800"
            >
              Tüm Hizmetleri Gör
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Before / After */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Dönüşümler"
            title="Öncesi / Sonrası"
            description="Gerçek projelerimizden seçtiğimiz örneklerle, boya ve tadilat uygulamalarımızın mekanlara kattığı farkı birlikte görelim."
          />
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {beforeAfterItems.map((item) => (
              <BeforeAfterSlider
                key={item.title}
                title={item.title}
                before={item.before}
                after={item.after}
              />
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Karşılaştırmayı görmek için kaydırıcıyı sürükleyin.
          </p>
        </Container>
      </section>

      {/* Process */}
      <section className="bg-navy-950 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Çalışma Sürecimiz"
            title="Keşiften Teslimata Beş Adım"
            description="Her projede izlediğimiz sistematik süreç; şeffaflık, zaman yönetimi ve uygulama kalitesini garanti eder."
            className="[&_h2]:text-sand-50 [&_p]:text-sand-200/80"
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-navy-800 bg-navy-900 p-6"
              >
                <span className="font-heading text-3xl font-semibold text-gold-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-heading text-lg font-semibold text-sand-50">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sand-200/75">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-sand-50 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Müşteri Yorumları"
            title="Bizi Tercih Edenler Ne Diyor?"
            description="Gerçekleştirdiğimiz projelerden memnun kalan müşterilerimizin deneyimlerini sizlerle paylaşıyoruz."
          />
          <div className="mt-14">
            <TestimonialsSection />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Sıkça Sorulan Sorular"
            title="Merak Edilenler"
            description="Projeniz hakkında en sık aldığımız soruları sizler için derledik."
          />
          <div className="mt-12">
            <FaqSection faqs={faqs} />
          </div>
        </Container>
      </section>

      {/* Quick quote form */}
      <section id="teklif" className="bg-sand-100 py-20 sm:py-24">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Hızlı Teklif"
            title="Projeniz İçin Ücretsiz Teklif Alın"
            description="Formu doldurun, 24 saat içinde sizinle iletişime geçelim."
          />
          <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
            <LeadForm variant="quote" services={services} />
          </div>
        </Container>
      </section>
    </>
  );
}
