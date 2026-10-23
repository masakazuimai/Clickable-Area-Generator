"use client";

import { useEffect, useRef, useState } from "react";

// 広告テスト（2026-10-24〜6週間）: 右下広告を停止中。全画面広告はlayoutのローダーで継続
const AD_PAUSED = true;

export function AdUnit({ lang = "ja" }: { lang?: "ja" | "en" }) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [closed, setClosed] = useState(false);
  const isEn = lang === "en";

  useEffect(() => {
    if (AD_PAUSED || pushed.current) return;
    pushed.current = true;
    try {
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
    } catch {
      // AdSense未ロード時は無視
    }
  }, []);

  if (AD_PAUSED) return null;

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
