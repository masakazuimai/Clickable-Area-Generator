import type { Metadata } from "next";
import "../globals.css";
import { messages } from "@/i18n/messages";
import { buildMetadata, buildJsonLd } from "@/i18n/site-meta";
import { SiteScripts } from "@/components/site-scripts";
import { AdUnit } from "@/components/ad-unit";
import { SiteFooter } from "@/components/site-footer";

const lang = "en" as const;

export const metadata: Metadata = buildMetadata(lang);

const jsonLd = buildJsonLd(lang);

export default function EnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <SiteScripts />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="grain bg-bg min-h-screen font-sans text-text">
        {children}
        <div className="mx-auto min-h-[90px] max-w-[728px] my-8">
          <AdUnit />
        </div>
        <SiteFooter lang={lang} dict={messages[lang]} />
      </body>
    </html>
  );
}
