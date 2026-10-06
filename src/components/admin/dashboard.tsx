"use client";

import { useMemo, useState } from "react";
import { FileText, Image as ImageIcon, Images, Inbox, Layers, Menu as MenuIcon } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { LeadsPanel } from "@/components/admin/leads-panel";
import { HeroPanel } from "@/components/admin/hero-panel";
import { StatsPanel } from "@/components/admin/stats-panel";
import { FaqsPanel } from "@/components/admin/faqs-panel";
import { BeforeAfterPanel } from "@/components/admin/before-after-panel";
import { ServicesPanel } from "@/components/admin/services-panel";
import { AboutPanel } from "@/components/admin/about-panel";
import { BlogPanel } from "@/components/admin/blog-panel";
import { MediaPanel } from "@/components/admin/media-panel";
import { BrandingPanel } from "@/components/admin/branding-panel";
import { NavLinksPanel } from "@/components/admin/nav-links-panel";
import { SettingsPanel } from "@/components/admin/settings-panel";
import type { Lead } from "@/lib/leads";
import type { SiteContent } from "@/lib/content";

export function AdminDashboard({
  initialLeads,
  content,
}: {
  initialLeads: Lead[];
  content: SiteContent;
}) {
  const [leads] = useState(initialLeads);

  const overview = useMemo(
    () => ({
      total: leads.length,
      newCount: leads.filter((l) => l.status === "yeni").length,
      blog: content.blogPosts.length,
      services: content.services.length,
    }),
    [leads, content.blogPosts.length, content.services.length],
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Inbox} label="Toplam Talep" value={overview.total} />
        <StatCard icon={Inbox} label="Yeni Talepler" value={overview.newCount} accent />
        <StatCard icon={FileText} label="Blog Yazısı" value={overview.blog} />
        <StatCard icon={Layers} label="Hizmet Sayısı" value={overview.services} />
      </div>

      <Tabs defaultValue="mesajlar">
        <TabsList className="flex-wrap">
          <TabsTrigger value="mesajlar">Gelen Kutusu</TabsTrigger>
          <TabsTrigger value="ana-sayfa">Ana Sayfa</TabsTrigger>
          <TabsTrigger value="oncesi-sonrasi">Öncesi / Sonrası</TabsTrigger>
          <TabsTrigger value="hizmetler">Hizmetler</TabsTrigger>
          <TabsTrigger value="hakkimizda">Hakkımızda</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="menu">
            <MenuIcon className="h-3.5 w-3.5" />
            Menü
          </TabsTrigger>
          <TabsTrigger value="medya">
            <Images className="h-3.5 w-3.5" />
            Medya
          </TabsTrigger>
          <TabsTrigger value="logo">
            <ImageIcon className="h-3.5 w-3.5" />
            Logo
          </TabsTrigger>
          <TabsTrigger value="ayarlar">Ayarlar</TabsTrigger>
        </TabsList>

        <TabsContent value="mesajlar" className="mt-6">
          <LeadsPanel initialLeads={leads} />
        </TabsContent>

        <TabsContent value="ana-sayfa" className="mt-6 space-y-6">
          <HeroPanel initialHero={content.hero} />
          <StatsPanel initialStats={content.stats} />
          <FaqsPanel initialFaqs={content.faqs} />
        </TabsContent>

        <TabsContent value="oncesi-sonrasi" className="mt-6">
          <BeforeAfterPanel initialItems={content.beforeAfterItems} />
        </TabsContent>

        <TabsContent value="hizmetler" className="mt-6">
          <ServicesPanel initialServices={content.services} />
        </TabsContent>

        <TabsContent value="hakkimizda" className="mt-6">
          <AboutPanel initialAbout={content.about} />
        </TabsContent>

        <TabsContent value="blog" className="mt-6">
          <BlogPanel initialPosts={content.blogPosts} />
        </TabsContent>

        <TabsContent value="menu" className="mt-6">
          <NavLinksPanel initialNavLinks={content.navLinks} />
        </TabsContent>

        <TabsContent value="medya" className="mt-6">
          <MediaPanel initialMedia={content.media} />
        </TabsContent>

        <TabsContent value="logo" className="mt-6">
          <BrandingPanel initialBranding={content.branding} />
        </TabsContent>

        <TabsContent value="ayarlar" className="mt-6">
          <SettingsPanel initialContact={content.contact} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Inbox;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <span
        className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${
          accent ? "bg-gold-500 text-navy-950" : "bg-navy-950 text-gold-400"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-heading text-2xl font-semibold text-navy-950">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
