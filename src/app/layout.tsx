import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-tagline",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Hayallerinizi Tasarlıyoruz`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "boya badana",
    "İstanbul boyacı",
    "dış cephe boyama",
    "dekoratif boya",
    "kartonpiyer",
    "alçıpan",
    "anahtar teslim tadilat",
    "Tasarım Boya",
  ],
  authors: [{ name: SITE_NAME }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Hayallerinizi Tasarlıyoruz`,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Hayallerinizi Tasarlıyoruz`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
