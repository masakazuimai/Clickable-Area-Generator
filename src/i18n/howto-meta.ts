import type { Metadata } from "next";
import type { Lang } from "./messages";
import { SITE_BASE, localeUrls, seo } from "./site-meta";
import { howtoContent } from "./howto-content";

// 「使い方・FAQ」ページの SEO。canonical は howto 自身、OGP type=article。
// 本文（可視コンテンツ）は howto-content.ts、UI辞書は messages.ts。

export const howtoUrls: Record<Lang, string> = {
  ja: `${SITE_BASE}/howto/`,
  en: `${SITE_BASE}/en/howto/`,
};

const ogImageUrls: Record<Lang, string> = {
  ja: `${SITE_BASE}/og-image.png`,
  en: `${SITE_BASE}/og-image-en.png`,
};

const ogLocale: Record<Lang, string> = {
  ja: "ja_JP",
  en: "en_US",
};

const metaTitle: Record<Lang, string> = {
  ja: "クリッカブルエリアの作り方・使い方｜Clickable Area Generator",
  en: "How to Create a Clickable Image Map｜Image Map Generator",
};

const metaDescription: Record<Lang, string> = {
  ja: "画像にクリッカブルエリアを設定してレスポンシブ対応 HTML を作る方法を、5 ステップの使い方・矩形/円形の使い分け・CSS方式の仕組み・よくある失敗・FAQ で解説します。",
  en: "How to build a responsive HTML image map: a 5-step workflow, rectangle vs. circle, how CSS responsive mode works, common mistakes, and an FAQ.",
};

export function buildHowtoMetadata(lang: Lang): Metadata {
  const url = howtoUrls[lang];

  return {
    title: metaTitle[lang],
    description: metaDescription[lang],
    authors: [{ name: "CodeQuest", url: "https://codequest.work/" }],
    creator: "CodeQuest",
    publisher: "CodeQuest",
    metadataBase: new URL("https://codequest.work/"),
    alternates: {
      canonical: url,
      languages: {
        ja: howtoUrls.ja,
        en: howtoUrls.en,
        "x-default": howtoUrls.ja,
      },
    },
    openGraph: {
      type: "article",
      url,
      title: metaTitle[lang],
      description: metaDescription[lang],
      siteName: "CodeQuest",
      locale: ogLocale[lang],
      images: [{ url: ogImageUrls[lang], width: 1200, height: 630, alt: seo[lang].appName }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle[lang],
      description: metaDescription[lang],
      images: [ogImageUrls[lang]],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildHowtoJsonLd(lang: Lang) {
  const c = seo[lang];
  const content = howtoContent[lang];
  const url = howtoUrls[lang];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "CodeQuest",
            item: "https://codequest.work/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: c.breadcrumbGenerators,
            item: "https://codequest.work/category/generator/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: c.breadcrumbCurrent,
            item: localeUrls[lang],
          },
          {
            "@type": "ListItem",
            position: 4,
            name: content.breadcrumb[3].name,
            item: url,
          },
        ],
      },
      {
        "@type": "HowTo",
        name: content.h1,
        description: metaDescription[lang],
        step: content.steps.items.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.desc,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faq.items.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: {
            "@type": "Answer",
            text: a,
          },
        })),
      },
    ],
  };
}
