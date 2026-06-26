import { GeneratorApp } from "@/components/generator-app";
import { messages } from "@/i18n/messages";
import { buildJsonLd } from "@/i18n/site-meta";

const jsonLd = buildJsonLd("ja");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GeneratorApp dict={messages.ja} lang="ja" />
    </>
  );
}
