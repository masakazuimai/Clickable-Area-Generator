import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://codequest.work/generator/clickable-area/";
const siteName = "Clickable Area Generator | クリッカブルエリアジェネレーター";
const description =
  "画像にクリッカブルエリアを設定してレスポンシブ対応HTMLコードを自動生成する無料ツール。矩形・円形のエリア指定、ドラッグ操作での移動・リサイズ、CSS方式のレスポンシブ出力に対応。アカウント登録不要。";

export const metadata: Metadata = {
  title: siteName,
  description,
  keywords: [
    "クリッカブルエリア",
    "イメージマップ",
    "画像マップ",
    "ジェネレーター",
    "image map generator",
    "clickable area",
    "レスポンシブ",
    "HTML",
    "CSS",
    "無料ツール",
  ],
  authors: [{ name: "CodeQuest", url: "https://codequest.work/" }],
  creator: "CodeQuest",
  publisher: "CodeQuest",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteName,
    description,
    siteName: "CodeQuest",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Clickable Area Generator",
      alternateName: "クリッカブルエリアジェネレーター",
      description,
      url: siteUrl,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "JPY",
      },
      featureList: [
        "画像へのクリッカブルエリア設定",
        "矩形・円形のエリア指定",
        "ドラッグ操作でのエリア移動・リサイズ",
        "CSS方式のレスポンシブ対応コード出力",
        "HTML Map形式のコード出力",
        "画像サイズのリサイズ（アスペクト比固定）",
        "ワンクリックコピー",
      ],
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
          name: "ジェネレーター",
          item: "https://codequest.work/tag/generator/",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Clickable Area Generator",
          item: siteUrl,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "クリッカブルエリアジェネレーターとは？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "画像上にクリック可能な領域（リンクエリア）を視覚的に設定し、レスポンシブ対応のHTMLコードを自動生成する無料Webツールです。",
          },
        },
        {
          "@type": "Question",
          name: "レスポンシブ対応のクリッカブルエリアはどう実装しますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "従来のHTML map要素はピクセル固定のためレスポンシブ非対応です。本ツールではposition: absoluteとパーセント指定のCSS方式でコードを出力するため、画像が縮小されてもクリック領域が追従します。",
          },
        },
        {
          "@type": "Question",
          name: "対応している画像形式は？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "PNG、JPG、SVG、WebPなど、ブラウザが表示可能なすべての画像形式に対応しています。",
          },
        },
        {
          "@type": "Question",
          name: "エリアの形状は何が使えますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "矩形（rect）と円形（circle）の2種類に対応しています。ドラッグ操作で描画し、作成後も移動・リサイズが可能です。",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=BIZ+UDPMincho&family=Noto+Serif+JP:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4871781946658288" crossOrigin="anonymous" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7Z6M3CJEV3" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-7Z6M3CJEV3');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="grain bg-bg min-h-screen font-sans text-text">
        {children}
      </body>
    </html>
  );
}
