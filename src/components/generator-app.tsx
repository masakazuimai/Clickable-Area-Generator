"use client";

import { useState, useCallback } from "react";
import type { Area, ShapeType } from "@/types/area";
import type { Dict } from "@/i18n/messages";
import { ImageUploader } from "@/components/image-uploader";
import { CanvasEditor } from "@/components/canvas-editor";
import { AreaList } from "@/components/area-list";
import { CodeOutput } from "@/components/code-output";
import { Toolbar } from "@/components/toolbar";

type ImageState = {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly originalWidth: number;
  readonly originalHeight: number;
};

type Props = {
  readonly dict: Dict;
};

export function GeneratorApp({ dict }: Props) {
  const [image, setImage] = useState<ImageState | null>(null);
  const [areas, setAreas] = useState<readonly Area[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shapeType, setShapeType] = useState<ShapeType>("rect");

  const handleImageLoad = useCallback(
    (src: string, width: number, height: number) => {
      setImage({ src, width, height, originalWidth: width, originalHeight: height });
      setAreas([]);
      setSelectedId(null);
    },
    []
  );

  const handleAddArea = useCallback((area: Area) => {
    setAreas((prev) => [...prev, area]);
    setSelectedId(area.id);
  }, []);

  const handleUpdateArea = useCallback(
    (id: string, updates: { href?: string; alt?: string }) => {
      setAreas((prev) =>
        prev.map((area) => {
          if (area.id !== id) return area;
          return { ...area, ...updates } as Area;
        })
      );
    },
    []
  );

  const handleUpdateAreaGeometry = useCallback(
    (id: string, geometry: Partial<Area>) => {
      setAreas((prev) =>
        prev.map((area) => {
          if (area.id !== id) return area;
          return { ...area, ...geometry } as Area;
        })
      );
    },
    []
  );

  const handleDeleteArea = useCallback(
    (id: string) => {
      setAreas((prev) => prev.filter((area) => area.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
      }
    },
    [selectedId]
  );

  const handleImageResize = useCallback(
    (newWidth: number, newHeight: number) => {
      if (!image) return;
      const scaleX = newWidth / image.width;
      const scaleY = newHeight / image.height;
      setImage({ ...image, width: newWidth, height: newHeight });
      setAreas((prev) =>
        prev.map((area) => {
          if (area.shape === "rect") {
            return {
              ...area,
              x: area.x * scaleX,
              y: area.y * scaleY,
              width: area.width * scaleX,
              height: area.height * scaleY,
            };
          }
          return {
            ...area,
            cx: area.cx * scaleX,
            cy: area.cy * scaleY,
            radius: area.radius * Math.min(scaleX, scaleY),
          };
        })
      );
    },
    [image]
  );

  const handleReset = useCallback(() => {
    setImage(null);
    setAreas([]);
    setSelectedId(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="border-b border-border bg-bg-secondary">
        <div className="max-w-[1440px] mx-auto px-6 py-5 text-center">
          <h1 className="text-2xl font-bold text-text">
            {dict.header.title}
          </h1>
          <p className="text-base text-text-secondary mt-1">
            {dict.header.subtitle}
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1">
        {!image ? (
          <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text mb-3">
                {dict.intro.title}
              </h2>
              <p className="text-lg text-text-secondary">
                {dict.intro.subtitle}
              </p>
            </div>
            <ImageUploader onImageLoad={handleImageLoad} dict={dict} />

            {/* ステップ説明 */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              {dict.intro.steps.map(({ title, desc }, i) => (
                <div key={title} className="text-center">
                  <span className="inline-block text-base font-mono font-medium text-accent mb-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base font-semibold text-text">{title}</p>
                  <p className="text-base text-text-tertiary mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-[1440px] mx-auto px-6 py-6">
            {/* ツールバー */}
            <div className="mb-5">
              <Toolbar
                shapeType={shapeType}
                onShapeChange={setShapeType}
                onReset={handleReset}
                areaCount={areas.length}
                imageWidth={image.width}
                imageHeight={image.height}
                aspectRatio={image.originalWidth / image.originalHeight}
                onImageResize={handleImageResize}
                dict={dict}
              />
            </div>

            <div className="flex gap-5 items-start">
              {/* キャンバス */}
              <div className="flex-1 min-w-0 space-y-5">
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="checkerboard p-1">
                    <CanvasEditor
                      imageSrc={image.src}
                      imageWidth={image.width}
                      imageHeight={image.height}
                      areas={areas}
                      selectedId={selectedId}
                      shapeType={shapeType}
                      onAddArea={handleAddArea}
                      onSelectArea={setSelectedId}
                      onUpdateAreaGeometry={handleUpdateAreaGeometry}
                      onImageResize={handleImageResize}
                      dict={dict}
                    />
                  </div>
                </div>

                {areas.length > 0 && (
                  <CodeOutput
                    areas={areas}
                    imageWidth={image.width}
                    imageHeight={image.height}
                    dict={dict}
                  />
                )}
              </div>

              {/* サイドパネル */}
              <aside className="w-80 shrink-0 sticky top-6">
                <div className="rounded-xl border border-border bg-bg-secondary overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <h2 className="text-base font-semibold text-text">
                      {dict.areaList.title}
                    </h2>
                    <span className="text-base tabular-nums font-medium text-text-tertiary bg-surface px-2 py-0.5 rounded-md">
                      {areas.length}
                    </span>
                  </div>
                  <div className="p-3 max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
                    <AreaList
                      areas={areas}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                      onUpdate={handleUpdateArea}
                      onDelete={handleDeleteArea}
                      dict={dict}
                    />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
