import type { Metadata } from "next";
import "../globals.css";
import { messages } from "@/i18n/messages";
import { buildMetadata } from "@/i18n/site-meta";
import { SiteScripts } from "@/components/site-scripts";
import { AdUnit } from "@/components/ad-unit";
import { SiteFooter } from "@/components/site-footer";

const lang = "en" as const;

export const metadata: Metadata = buildMetadata(lang);

export default function EnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <SiteScripts />
      </head>
      <body className="grain bg-bg min-h-screen font-sans text-text">
        {children}
        <AdUnit lang="en" />
        <SiteFooter lang={lang} dict={messages[lang]} />
      </body>
    </html>
  );
}
