import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Target, Eye, Award } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/smart-image";
import { getContent } from "@/lib/content";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Hakkımızda";
const PAGE_DESCRIPTION =
  "2012'den bu yana İstanbul'da boya badana ve tadilat sektöründe hizmet veren Tasarım Boya'nın hikayesi, vizyonu, misyonu ve uzman ekibiyle tanışın.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/hakkimizda" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/hakkimizda",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function AboutPage() {
  const { about, stats } = getContent();

  return (
    <>
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          <SmartImage
            src={about.heroImage}
            alt="Tasarım Boya ekibi proje planlaması yapıyor"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/90 to-navy-950/70" />
        </div>
        <Container className="relative z-10 flex flex-col items-center gap-5 py-24 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
            Hakkımızda
          </span>
          <h1 className="max-w-2xl font-heading text-4xl font-semibold text-sand-50 sm:text-5xl">
            {about.heroTitle}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-sand-200/90">
            {about.heroDescription}
          </p>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative h-80 w-full overflow-hidden rounded-3xl sm:h-[28rem]">
            <SmartImage
              src={about.storyImage}
              alt="Usta detay işçiliği uyguluyor"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-5">
            <SectionHeading eyebrow="Hikayemiz" title={about.storyTitle} align="left" />
            {about.storyParagraphs.map((paragraph, index) => (
              <p key={index} className="text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-sand-50 py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-950 text-gold-400">
                <Eye className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-heading text-2xl font-semibold text-navy-950">
                Vizyonumuz
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {about.vision}
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-950 text-gold-400">
                <Target className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-heading text-2xl font-semibold text-navy-950">
                Misyonumuz
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {about.mission}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Çalışma Prensiplerimiz"
            title="Bizi Biz Yapan Değerler"
            description="Her projede aynı titizlikle uyguladığımız temel prensipler."
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((value) => (
              <div
                key={value.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <Award className="h-7 w-7 text-gold-500" />
                <h3 className="mt-4 font-heading text-lg font-semibold text-navy-950">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-navy-950 py-20 sm:py-24">
        <Container className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <p className="font-heading text-3xl font-semibold text-gold-400 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-sand-200/80 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Ekibimiz"
            title="Projelerinizi Hayata Geçiren İsimler"
            description="Deneyimli ve tutkulu ekibimiz, her projeye aynı özeni gösterir."
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.team.map((member) => (
              <div
                key={member.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="relative h-56 w-full">
                  <SmartImage
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="font-heading text-base font-semibold text-navy-950">
                    {member.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-sand-100 py-16">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-heading text-2xl font-semibold text-navy-950 sm:text-3xl">
            Projenizi Birlikte Hayata Geçirelim
          </h2>
          <Button
            render={<Link href="/iletisim" />}
            nativeButton={false}
            size="lg"
            className="bg-navy-950 text-sand-50 hover:bg-navy-800"
          >
            Bize Ulaşın
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Container>
      </section>
    </>
  );
}
