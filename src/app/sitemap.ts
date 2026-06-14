import type { MetadataRoute } from "next";
import { localeUrls } from "@/i18n/site-meta";

// 静的exportのため force-static。basePath配下 /generator/clickable-area/sitemap.xml に出力される。
// 本体WordPressのsitemapはツールURLを含まないため、ja/en両URLをここで発見可能にする。
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = "2026-06-14";
  return [
    { url: localeUrls.ja, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: localeUrls.en, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
