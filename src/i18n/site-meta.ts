import type { Metadata } from "next";
import type { Lang } from "./messages";

// SEO（metadata / JSON-LD）の多言語ソース。ja は既存実装と一致、en は "Image Map Generator" 軸。

export const SITE_BASE = "https://codequest.work/generator/clickable-area";

export const localeUrls: Record<Lang, string> = {
  ja: `${SITE_BASE}/`,
  en: `${SITE_BASE}/en/`,
};

// OG画像は public/ の静的PNGを絶対URLで参照（basePath込み。public資産はmetadata文字列にbasePathが自動付与されないため）。
// 画像の再生成手順は memory/structure.md を参照。
const ogImageUrls: Record<Lang, string> = {
  ja: `${SITE_BASE}/og-image.png`,
  en: `${SITE_BASE}/og-image-en.png`,
};

// 言語切替リンク先（root layout を跨ぐためフルパス指定＝フルリロード）
export const switchHref: Record<Lang, string> = {
  ja: "/generator/clickable-area/en/",
  en: "/generator/clickable-area/",
};

const ogLocale: Record<Lang, string> = {
  ja: "ja_JP",
  en: "en_US",
};

type SeoContent = {
  readonly siteName: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly appName: string;
  readonly appAlternateName: string;
  readonly featureList: readonly string[];
  readonly breadcrumbGenerators: string;
  readonly breadcrumbCurrent: string;
};

export const seo: Record<Lang, SeoContent> = {
  ja: {
    siteName: "Clickable Area Generator | クリッカブルエリアジェネレーター",
    description:
      "画像にクリッカブルエリアを設定してレスポンシブ対応HTMLコードを自動生成する無料ツール。矩形・円形のエリア指定、ドラッグ操作での移動・リサイズ、CSS方式のレスポンシブ出力に対応。アカウント登録不要。",
    keywords: ["クリッカブルエリア", "イメージマップ", "画像マップ", "ジェネレーター", "image map generator", "clickable area", "レスポンシブ", "HTML", "CSS", "無料ツール"],
    appName: "Clickable Area Generator",
    appAlternateName: "クリッカブルエリアジェネレーター",
    featureList: ["画像へのクリッカブルエリア設定", "矩形・円形のエリア指定", "ドラッグ操作でのエリア移動・リサイズ", "CSS方式のレスポンシブ対応コード出力", "HTML Map形式のコード出力", "画像サイズのリサイズ（アスペクト比固定）", "ワンクリックコピー"],
    breadcrumbGenerators: "ジェネレーター",
    breadcrumbCurrent: "Clickable Area Generator",
  },
  en: {
    siteName: "Free Image Map Generator – Responsive HTML, No Coding",
    description:
      "Create an HTML image map online, free. Draw clickable areas on any image and copy responsive HTML/CSS that scales on mobile — no sign-up, no install.",
    keywords: ["image map generator", "HTML image map maker", "responsive image map", "clickable area", "image map creator", "image mapper", "free online tool", "HTML", "CSS"],
    appName: "Image Map Generator",
    appAlternateName: "Clickable Area Generator",
    featureList: ["Draw clickable areas on any image", "Rectangle and circle shapes", "Move and resize areas by dragging", "Responsive CSS-based code output", "HTML image map (<map>) output", "Resize the image with a locked aspect ratio", "One-click copy"],
    breadcrumbGenerators: "Generators",
    breadcrumbCurrent: "Image Map Generator",
  },
};

export function buildMetadata(lang: Lang): Metadata {
  const c = seo[lang];
  const url = localeUrls[lang];

  return {
    title: c.siteName,
    description: c.description,
    keywords: [...c.keywords],
    authors: [{ name: "CodeQuest", url: "https://codequest.work/" }],
    creator: "CodeQuest",
    publisher: "CodeQuest",
    // basePath(/generator/clickable-area)は画像等の相対パスにNextが自動付与するため、
    // metadataBaseはドメインルートにする（二重付与を防止）。canonical/og:urlは絶対指定。
    metadataBase: new URL("https://codequest.work/"),
    alternates: {
      canonical: url,
      languages: {
        ja: localeUrls.ja,
        en: localeUrls.en,
        "x-default": localeUrls.ja,
      },
    },
    openGraph: {
      type: "website",
      url,
      title: c.siteName,
      description: c.description,
      siteName: "CodeQuest",
      locale: ogLocale[lang],
      images: [{ url: ogImageUrls[lang], width: 1200, height: 630, alt: c.appName }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.siteName,
      description: c.description,
      images: [ogImageUrls[lang]],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildJsonLd(lang: Lang) {
  const c = seo[lang];
  const url = localeUrls[lang];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: c.appName,
        alternateName: c.appAlternateName,
        description: c.description,
        url,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "JPY",
        },
        featureList: [...c.featureList],
        creator: {
          "@type": "Organization",
          name: "CodeQuest",
          url: "https://codequest.work/",
        },
      },
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
            item: url,
          },
        ],
      },
    ],
  };
}
