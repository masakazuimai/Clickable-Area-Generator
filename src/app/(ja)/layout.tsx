import type { Metadata } from "next";
import "../globals.css";
import { messages } from "@/i18n/messages";
import { buildMetadata } from "@/i18n/site-meta";
import { SiteScripts } from "@/components/site-scripts";
import { AdUnit } from "@/components/ad-unit";
import { SiteFooter } from "@/components/site-footer";

const lang = "ja" as const;

export const metadata: Metadata = buildMetadata(lang);

export default function JaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <SiteScripts />
      </head>
      <body className="grain bg-bg min-h-screen font-sans text-text">
        {children}
        <div className="ad-wrap mx-auto my-8 text-center">
          <AdUnit />
        </div>
        <SiteFooter lang={lang} dict={messages[lang]} />
      </body>
    </html>
  );
}
