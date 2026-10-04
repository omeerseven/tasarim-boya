import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import { AdminDashboard } from "@/components/admin/dashboard";
import { getLeads } from "@/lib/leads";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Yönetim Paneli",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const leads = await getLeads();
  const content = await getContent();

  return (
    <div className="admin-theme min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <Container className="flex items-center justify-between py-4">
          <div>
            <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
              Yönetim Paneli
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              Ana sayfa, hizmetler, hakkımızda, blog ve medya içeriklerini
              yönetin; gelen teklif ve mesajları takip edin.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Siteye Dön
          </Link>
        </Container>
      </header>

      <Container className="py-8">
        <AdminDashboard initialLeads={leads} content={content} />
      </Container>
    </div>
  );
}
