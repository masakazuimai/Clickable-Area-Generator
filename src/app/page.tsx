"use client";

import { useState, useCallback } from "react";
import type { Area, ShapeType } from "@/types/area";
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

export default function Home() {
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
            Clickable Area Generator
          </h1>
          <p className="text-base text-text-secondary mt-1">
            画像にクリッカブルエリアを設定してHTMLコードを生成
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1">
        {!image ? (
          <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text mb-3">
                画像マップを作成
              </h2>
              <p className="text-lg text-text-secondary">
                画像をアップロードして、クリッカブルなエリアを描画しましょう
              </p>
            </div>
            <ImageUploader onImageLoad={handleImageLoad} />

            {/* ステップ説明 */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "画像をアップロード",
                  desc: "PNG, JPG, SVG など",
                },
                {
                  step: "02",
                  title: "エリアを描画",
                  desc: "矩形・円形で指定",
                },
                {
                  step: "03",
                  title: "コードを取得",
                  desc: "コピーして貼り付け",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <span className="inline-block text-base font-mono font-medium text-accent mb-2">
                    {step}
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
                    />
                  </div>
                </div>

                {areas.length > 0 && (
                  <CodeOutput
                    areas={areas}
                    imageWidth={image.width}
                    imageHeight={image.height}
                  />
                )}
              </div>

              {/* サイドパネル */}
              <aside className="w-80 shrink-0 sticky top-6">
                <div className="rounded-xl border border-border bg-bg-secondary overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <h2 className="text-base font-semibold text-text">
                      エリア一覧
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
                    />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>

      {/* 広告 */}
      <div
        className="max-w-[1440px] mx-auto px-6 py-6 text-center"
        dangerouslySetInnerHTML={{
          __html: `<ins class="adsbygoogle" style="display:block;text-align:center" data-ad-client="ca-pub-4871781946658288" data-ad-slot="7493033745" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`,
        }}
      />

      {/* フッター */}
      <footer className="border-t border-border py-4 mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
          <p className="text-base text-text-tertiary">
            © 2026 Clickable Area Generator | Created by <a href="https://codequest.work/" target="_blank" rel="noopener" className="hover:text-accent transition-colors">CodeQuest</a>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://seo.codequest.work/ja"
              target="_blank"
              rel="noopener"
              className="text-base text-text-secondary hover:text-accent transition-colors"
            >
              SEO CHECKはこちら →
            </a>
            <a
              href="https://codequest.work/tag/generator/"
              target="_blank"
              rel="noopener"
              className="text-base text-text-secondary hover:text-accent transition-colors"
            >
              その他のジェネレーター →
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
