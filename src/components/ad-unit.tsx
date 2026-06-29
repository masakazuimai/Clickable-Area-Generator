"use client";

import { useEffect, useRef, useState } from "react";

export function AdUnit({ lang = "ja" }: { lang?: "ja" | "en" }) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [closed, setClosed] = useState(false);
  const isEn = lang === "en";

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
    <div className={`footer-ad${closed ? " is-closed" : ""}`}>
      <div className="ad-widget__head">
        <span className="ad-widget__label">{isEn ? "Sponsored" : "広告"}</span>
        <button
          className="ad-widget__close"
          type="button"
          aria-label={isEn ? "Close ad" : "広告を閉じる"}
          onClick={() => setClosed(true)}
        >
          ×
        </button>
      </div>
      <ins
        className="adsbygoogle"
        ref={adRef}
        style={{ display: "block" }}
        data-ad-client="ca-pub-4871781946658288"
        data-ad-slot="4138074609"
      />
    </div>
  );
}
