"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/lib/content";

export function SiteHeader({
  logoUrl,
  navLinks,
  phoneDisplay,
  phoneHref,
}: {
  logoUrl: string;
  navLinks: NavLink[];
  phoneDisplay: string;
  phoneHref: string;
}) {
  const pathname = usePathname();
  const telHref = `tel:${phoneHref}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container className="flex h-20 items-center justify-between py-3 sm:h-22">
        <Logo src={logoUrl} />

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-gold-600",
                  isActive ? "text-navy-950" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={telHref}
            className="flex items-center gap-2 text-sm font-medium text-navy-900 hover:text-gold-600"
          >
            <Phone className="h-4 w-4" />
            {phoneDisplay}
          </a>
          <Button
            render={<Link href="/iletisim" />}
            nativeButton={false}
            className="bg-navy-950 text-sand-50 hover:bg-navy-800"
          >
            Teklif Al
          </Button>
        </div>

        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="lg:hidden" />}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menüyü Aç</span>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background">
            <SheetHeader>
              <SheetTitle>
                <Logo src={logoUrl} />
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <SheetClose
                  key={link.id}
                  nativeButton={false}
                  render={
                    <Link
                      href={link.href}
                      className="rounded-md px-3 py-3 text-base font-medium text-navy-900 hover:bg-sand-100"
                    />
                  }
                >
                  {link.label}
                </SheetClose>
              ))}
              <SheetClose
                nativeButton={false}
                render={
                  <Link
                    href="/iletisim"
                    className="mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-navy-950 px-4 text-sm font-medium text-sand-50 hover:bg-navy-800"
                  />
                }
              >
                Teklif Al
              </SheetClose>
              <a
                href={telHref}
                className="mt-2 flex items-center gap-2 px-3 py-2 text-sm font-medium text-navy-900"
              >
                <Phone className="h-4 w-4" />
                {phoneDisplay}
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
