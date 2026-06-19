// <head> 内の共通スクリプト（フォント・AdSense・GA4）。ja/en 両 layout で共有。

export function SiteScripts() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=BIZ+UDPMincho&family=Noto+Serif+JP:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <script defer src="https://codequest.work/generator/_shared/adsense.js?v=20260619b" />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-7Z6M3CJEV3" />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-7Z6M3CJEV3');`,
        }}
      />
    </>
  );
}
