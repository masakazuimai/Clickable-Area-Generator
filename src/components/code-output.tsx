"use client";

import { useState, useCallback } from "react";
import type { Area } from "@/types/area";

type OutputMode = "css" | "map";

type Props = {
  readonly areas: readonly Area[];
  readonly imageWidth: number;
  readonly imageHeight: number;
};

function toPercent(value: number, base: number): string {
  return (value / base * 100).toFixed(2) + "%";
}

function generateCssHtml(
  areas: readonly Area[],
  imageWidth: number,
  imageHeight: number
): string {
  const links = areas
    .map((area, i) => {
      const href = area.href || "#";
      const alt = area.alt || `area-${i + 1}`;

      if (area.shape === "rect") {
        const left = toPercent(area.x, imageWidth);
        const top = toPercent(area.y, imageHeight);
        const width = toPercent(area.width, imageWidth);
        const height = toPercent(area.height, imageHeight);
        return `  <a href="${href}" aria-label="${alt}" style="position: absolute; left: ${left}; top: ${top}; width: ${width}; height: ${height};"></a>`;
      }

      const left = toPercent(area.cx - area.radius, imageWidth);
      const top = toPercent(area.cy - area.radius, imageHeight);
      const width = toPercent(area.radius * 2, imageWidth);
      const height = toPercent(area.radius * 2, imageHeight);
      return `  <a href="${href}" aria-label="${alt}" style="position: absolute; left: ${left}; top: ${top}; width: ${width}; height: ${height}; border-radius: 50%;"></a>`;
    })
    .join("\n");

  return `<div style="position: relative; display: inline-block;">
  <img src="YOUR_IMAGE_URL" alt="" style="width: 100%; height: auto; display: block;" />
${links}
</div>`;
}

function generateMapHtml(
  areas: readonly Area[],
  imageWidth: number,
  imageHeight: number
): string {
  const mapName = "image-map";
  const areaLines = areas
    .map((area) => {
      const href = area.href || "#";
      const alt = area.alt || "";
      if (area.shape === "rect") {
        const coords = `${Math.round(area.x)},${Math.round(area.y)},${Math.round(area.x + area.width)},${Math.round(area.y + area.height)}`;
        return `  <area shape="rect" coords="${coords}" href="${href}" alt="${alt}" />`;
      }
      const coords = `${Math.round(area.cx)},${Math.round(area.cy)},${Math.round(area.radius)}`;
      return `  <area shape="circle" coords="${coords}" href="${href}" alt="${alt}" />`;
    })
    .join("\n");

  return `<img src="YOUR_IMAGE_URL" width="${Math.round(imageWidth)}" height="${Math.round(imageHeight)}" usemap="#${mapName}" alt="" />
<map name="${mapName}">
${areaLines}
</map>`;
}

const modes = [
  { value: "css" as const, label: "CSS（レスポンシブ）" },
  { value: "map" as const, label: "HTML Map" },
] as const;

export function CodeOutput({ areas, imageWidth, imageHeight }: Props) {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<OutputMode>("css");

  const code =
    mode === "css"
      ? generateCssHtml(areas, imageWidth, imageHeight)
      : generateMapHtml(areas, imageWidth, imageHeight);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <div className="rounded-xl border border-border bg-bg-secondary overflow-hidden">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <div className="flex bg-surface rounded-md p-0.5 gap-0.5">
            {modes.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => {
                  setMode(value);
                  setCopied(false);
                }}
                className={`px-3 py-1 rounded text-base font-medium transition-all ${
                  mode === value
                    ? "bg-accent text-white shadow-sm"
                    : "text-text-secondary hover:text-text hover:bg-surface-hover"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-base font-medium transition-all duration-200 ${
            copied
              ? "bg-accent text-white"
              : "bg-surface text-text-secondary hover:bg-surface-hover hover:text-text"
          }`}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* コード */}
      <pre className="p-4 overflow-x-auto text-base leading-relaxed font-mono text-text custom-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  );
}
