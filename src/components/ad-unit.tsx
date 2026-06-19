// push は共有ローダー（_shared/adsense.js）が幅確定後に行う。ここでは枠のみ置く。
export function AdUnit() {
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-4871781946658288"
      data-ad-slot="7493033745"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
