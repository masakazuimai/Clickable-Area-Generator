import type { Metadata } from "next";
import { HowtoArticle } from "@/components/howto-article";
import { howtoContent } from "@/i18n/howto-content";
import { buildHowtoMetadata, buildHowtoJsonLd } from "@/i18n/howto-meta";

export const metadata: Metadata = buildHowtoMetadata("ja");

const jsonLd = buildHowtoJsonLd("ja");

export default function HowtoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HowtoArticle content={howtoContent.ja} />
    </>
  );
}
