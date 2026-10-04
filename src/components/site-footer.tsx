import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import type { ContactInfo, NavLink, Service } from "@/lib/content";

export function SiteFooter({
  services,
  navLinks,
  contact,
  logoUrl,
}: {
  services: Service[];
  navLinks: NavLink[];
  contact: ContactInfo;
  logoUrl: string;
}) {
  return (
    <footer className="border-t border-navy-800 bg-navy-950 text-sand-100">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo dark src={logoUrl} />
            <p className="text-sm leading-relaxed text-sand-200/80">
              Hayallerinizi Tasarlıyoruz. İç/dış cephe boya badana, dekoratif
              uygulamalar ve anahtar teslim tadilat hizmetlerinde güvenilir
              çözüm ortağınız.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-gold-400">
              Hizmetlerimiz
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-sand-200/80">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href="/hizmetler"
                    className="transition-colors hover:text-gold-300"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-gold-400">
              Kurumsal
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-sand-200/80">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="transition-colors hover:text-gold-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-gold-400">
              İletişim
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-sand-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 flex-none text-gold-400" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 flex-none text-gold-400" />
                <a href={`tel:${contact.phoneHref}`} className="hover:text-gold-300">
                  {contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 flex-none text-gold-400" />
                <a href={`mailto:${contact.email}`} className="hover:text-gold-300">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 flex-none text-gold-400" />
                <span>{contact.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-x-3 gap-y-2 border-t border-navy-800 pt-8 text-center text-xs text-sand-300/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Tasarım Boya. Tüm hakları saklıdır.</p>
          <span className="hidden text-sand-300/30 sm:inline">•</span>
          <p>Hayallerinizi Tasarlıyoruz.</p>
          <span className="hidden text-sand-300/30 sm:inline">•</span>
          <p>
            Web Yazılım ve Geliştirme:{" "}
            <a
              href="tel:05511721526"
              aria-label="vizuracreative'yi arayın: 0551 172 15 26"
              className="font-medium text-gold-400 underline-offset-2 transition-colors hover:text-gold-300 hover:underline"
            >
              vizuracreative
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
