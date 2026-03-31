"use client";

import { useCallback, useRef, useState } from "react";

type Props = {
  readonly onImageLoad: (src: string, width: number, height: number) => void;
};

export function ImageUploader({ onImageLoad }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const img = new Image();
        img.onload = () =>
          onImageLoad(src, img.naturalWidth, img.naturalHeight);
        img.src = src;
      };
      reader.readAsDataURL(file);
    },
    [onImageLoad]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => inputRef.current?.click()}
      className={`group relative flex flex-col items-center justify-center gap-5 rounded-xl border-2 border-dashed p-16 cursor-pointer transition-all duration-200 ${
        isDragging
          ? "border-accent bg-accent-muted scale-[1.01]"
          : "border-border bg-bg-secondary hover:border-accent/50 hover:bg-surface"
      }`}
    >
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
          isDragging
            ? "bg-accent-muted scale-110"
            : "bg-surface group-hover:bg-accent-muted"
        }`}
      >
        <svg
          className={`w-7 h-7 transition-colors ${
            isDragging
              ? "text-accent"
              : "text-text-tertiary group-hover:text-accent"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-text mb-1">
          {isDragging ? "ここにドロップ" : "画像をアップロード"}
        </p>
        <p className="text-base text-text-secondary">
          ドラッグ&ドロップ、または
          <span className="text-accent font-medium"> ファイルを選択</span>
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
