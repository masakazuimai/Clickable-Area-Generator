import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clickable Area Generator",
  description: "画像にクリッカブルエリアを設定してHTMLコードを生成するツール",
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7Z6M3CJEV3" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-7Z6M3CJEV3');`,
          }}
        />
      </head>
      <body className="grain bg-bg min-h-screen font-sans text-text">{children}</body>
    </html>
  );
}
