import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingContactButtons } from "@/components/floating-contact-buttons";
import { getContent } from "@/lib/content";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const { services, navLinks, contact, branding } = getContent();

  return (
    <>
      <SiteHeader
        logoUrl={branding.logoUrl}
        navLinks={navLinks}
        phoneDisplay={contact.phoneDisplay}
        phoneHref={contact.phoneHref}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter services={services} navLinks={navLinks} contact={contact} logoUrl={branding.logoUrl} />
      <FloatingContactButtons phoneHref={contact.phoneHref} whatsappNumber={contact.whatsappNumber} />
    </>
  );
}
