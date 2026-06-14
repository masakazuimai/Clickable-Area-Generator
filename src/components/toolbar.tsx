"use client";

import { useState, useCallback, useEffect } from "react";
import type { ShapeType } from "@/types/area";
import type { Dict } from "@/i18n/messages";

type Props = {
  readonly shapeType: ShapeType;
  readonly onShapeChange: (shape: ShapeType) => void;
  readonly onReset: () => void;
  readonly areaCount: number;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly aspectRatio: number;
  readonly onImageResize: (width: number, height: number) => void;
  readonly dict: Dict;
};

const shapeIcons = {
  rect: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="1" strokeWidth={2} />
    </svg>
  ),
  circle: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" strokeWidth={2} />
    </svg>
  ),
} as const;

export function Toolbar({
  shapeType,
  onShapeChange,
  onReset,
  imageWidth,
  imageHeight,
  aspectRatio,
  onImageResize,
  dict,
}: Props) {
  const shapes = [
    { type: "rect" as const, label: dict.toolbar.rect, icon: shapeIcons.rect },
    { type: "circle" as const, label: dict.toolbar.circle, icon: shapeIcons.circle },
  ];
  const [widthInput, setWidthInput] = useState(String(imageWidth));
  const [heightInput, setHeightInput] = useState(String(imageHeight));

  useEffect(() => {
    setWidthInput(String(imageWidth));
    setHeightInput(String(imageHeight));
  }, [imageWidth, imageHeight]);

  const handleWidthChange = useCallback(
    (value: string) => {
      setWidthInput(value);
      const w = parseInt(value, 10);
      if (!isNaN(w) && w >= 10) {
        const h = Math.round(w / aspectRatio);
        setHeightInput(String(h));
        onImageResize(w, h);
      }
    },
    [aspectRatio, onImageResize]
  );

  const handleHeightChange = useCallback(
    (value: string) => {
      setHeightInput(value);
      const h = parseInt(value, 10);
      if (!isNaN(h) && h >= 10) {
        const w = Math.round(h * aspectRatio);
        setWidthInput(String(w));
        onImageResize(w, h);
      }
    },
    [aspectRatio, onImageResize]
  );

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* シェイプ切り替え */}
      <div className="flex bg-surface rounded-lg p-1 gap-0.5">
        {shapes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => onShapeChange(type)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-base font-medium transition-all ${
              shapeType === type
                ? "bg-accent text-white shadow-sm"
                : "text-text-secondary hover:text-text hover:bg-surface-hover"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-border" />

      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-base font-medium text-text-secondary hover:text-text hover:bg-surface transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {dict.toolbar.changeImage}
      </button>

      <div className="w-px h-6 bg-border" />

      {/* 画像サイズ変更 */}
      <div className="flex items-center gap-2">
        <span className="text-base font-medium text-text-secondary">{dict.toolbar.imageSize}</span>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={10}
            value={widthInput}
            onChange={(e) => handleWidthChange(e.target.value)}
            className="w-20 rounded-md border border-border bg-surface px-2 py-1.5 text-base text-text text-center font-mono tabular-nums focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent-ring transition-all"
          />
          <span className="text-base text-text-tertiary">x</span>
          <input
            type="number"
            min={10}
            value={heightInput}
            onChange={(e) => handleHeightChange(e.target.value)}
            className="w-20 rounded-md border border-border bg-surface px-2 py-1.5 text-base text-text text-center font-mono tabular-nums focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent-ring transition-all"
          />
          <span className="text-base text-text-tertiary">px</span>
          {/* アスペクト比固定アイコン */}
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
      </div>
    </div>
  );
}
