"use client";

import { useEffect, useRef } from "react";

export function AdUnit() {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
    } catch {
      // AdSense未ロード時は無視
    }
  }, []);

  return (
    <ins
      className="adsbygoogle ad-banner"
      ref={adRef}
      style={{ display: "inline-block" }}
      data-ad-client="ca-pub-4871781946658288"
      data-ad-slot="4138074609"
    />
  );
}
