// AdSense 横長バナー（最大728×90）。ja/en 両 layout で共有。

export function AdBanner() {
  return (
    <div
      className="mx-auto px-6 py-6"
      style={{ maxWidth: 728 }}
      dangerouslySetInnerHTML={{
        __html: `<ins class="adsbygoogle" style="display:block;max-width:728px;max-height:90px" data-ad-client="ca-pub-4871781946658288" data-ad-slot="7493033745" data-ad-format="horizontal" data-full-width-responsive="false"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`,
      }}
    />
  );
}
