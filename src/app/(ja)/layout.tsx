import type { Metadata } from "next";
import "../globals.css";
import { messages } from "@/i18n/messages";
import { buildMetadata, buildJsonLd } from "@/i18n/site-meta";
import { SiteScripts } from "@/components/site-scripts";
import { AdBanner } from "@/components/ad-banner";
import { SiteFooter } from "@/components/site-footer";

const lang = "ja" as const;

export const metadata: Metadata = buildMetadata(lang);

const jsonLd = buildJsonLd(lang);

export default function JaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <SiteScripts />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="grain bg-bg min-h-screen font-sans text-text">
        {children}
        <AdBanner />
        <SiteFooter lang={lang} dict={messages[lang]} />
      </body>
    </html>
  );
}
