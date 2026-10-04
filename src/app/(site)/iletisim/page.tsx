import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { LeadForm } from "@/components/lead-form";
import { getContent, resolveMapEmbedUrl } from "@/lib/content";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "İletişim";
const PAGE_DESCRIPTION =
  "Tasarım Boya ile iletişime geçin: telefon, WhatsApp, e-posta, adres ve ücretsiz keşif talebi için hemen formu doldurun.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/iletisim" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/iletisim",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function ContactPage() {
  const { services, contact } = getContent();

  const contactInfo = [
    { icon: MapPin, title: "Adres", detail: contact.address },
    {
      icon: Phone,
      title: "Telefon",
      detail: contact.phoneDisplay,
      href: `tel:${contact.phoneHref}`,
    },
    {
      icon: Mail,
      title: "E-posta",
      detail: contact.email,
      href: `mailto:${contact.email}`,
    },
    { icon: Clock, title: "Çalışma Saatleri", detail: contact.workingHours },
  ];

  return (
    <>
      <section className="bg-navy-950 py-20 sm:py-24">
        <Container className="flex flex-col items-center gap-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
            İletişim
          </span>
          <h1 className="max-w-2xl font-heading text-4xl font-semibold text-sand-50 sm:text-5xl">
            Projeniz İçin Bize Ulaşın
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-sand-200/90">
            Sorularınız veya ücretsiz keşif talebiniz için formu doldurun ya
            da doğrudan bizi arayın; 24 saat içinde dönüş yapalım.
          </p>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="İletişim Bilgileri"
              title="Size Nasıl Yardımcı Olabiliriz?"
              align="left"
            />
            <div className="space-y-5">
              {contactInfo.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-navy-950 text-gold-400">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy-950">
                      {item.title}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-gold-600"
                      >
                        {item.detail}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Tasarım Boya Konum Haritası"
                src={resolveMapEmbedUrl(contact)}
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
            <h2 className="font-heading text-xl font-semibold text-navy-950">
              Mesaj Gönderin
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Aşağıdaki formu doldurduğunuzda talebiniz ekibimize iletilir.
            </p>
            <div className="mt-6">
              <LeadForm variant="contact" services={services} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
