"use client";

import type { Area } from "@/types/area";

type Props = {
  readonly areas: readonly Area[];
  readonly selectedId: string | null;
  readonly onSelect: (id: string) => void;
  readonly onUpdate: (id: string, updates: { href?: string; alt?: string }) => void;
  readonly onDelete: (id: string) => void;
};

function AreaItem({
  area,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}: {
  readonly area: Area;
  readonly index: number;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
  readonly onUpdate: (updates: { href?: string; alt?: string }) => void;
  readonly onDelete: () => void;
}) {
  const isRect = area.shape === "rect";

  return (
    <div
      onClick={onSelect}
      className={`rounded-lg border transition-all duration-150 cursor-pointer ${
        isSelected
          ? "border-accent bg-accent-muted ring-1 ring-accent-ring"
          : "border-border hover:border-border-hover hover:bg-surface"
      }`}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base tabular-nums font-mono font-medium text-text-tertiary w-5 text-center">
            {index + 1}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-base font-medium px-1.5 py-0.5 rounded ${
              isRect
                ? "bg-accent-muted text-accent"
                : "bg-orange-muted text-orange"
            }`}
          >
            {isRect ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="1" strokeWidth={2.5} />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" strokeWidth={2.5} />
              </svg>
            )}
            {isRect ? "矩形" : "円形"}
          </span>
          <span className="text-base text-text-tertiary font-mono">
            {isRect
              ? `${Math.round((area as Extract<Area, { shape: "rect" }>).width)}x${Math.round((area as Extract<Area, { shape: "rect" }>).height)}`
              : `r${Math.round((area as Extract<Area, { shape: "circle" }>).radius)}`}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded text-text-tertiary hover:text-red hover:bg-red-muted transition-all"
          title="削除"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 入力フィールド */}
      <div className="px-3 pb-3 space-y-2">
        <input
          type="url"
          value={area.href}
          onChange={(e) => onUpdate({ href: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          placeholder="URL を入力..."
          className="w-full rounded-md border border-border bg-bg px-3 py-1.5 text-base text-text placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent-ring transition-all"
        />
        <input
          type="text"
          value={area.alt}
          onChange={(e) => onUpdate({ alt: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          placeholder="Alt テキスト..."
          className="w-full rounded-md border border-border bg-bg px-3 py-1.5 text-base text-text placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent-ring transition-all"
        />
      </div>
    </div>
  );
}

export function AreaList({
  areas,
  selectedId,
  onSelect,
  onUpdate,
  onDelete,
}: Props) {
  if (areas.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center mx-auto mb-3">
          <svg className="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
          </svg>
        </div>
        <p className="text-base text-text-secondary">
          画像上でドラッグしてエリアを作成
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {areas.map((area, index) => (
        <AreaItem
          key={area.id}
          area={area}
          index={index}
          isSelected={area.id === selectedId}
          onSelect={() => onSelect(area.id)}
          onUpdate={(updates) => onUpdate(area.id, updates)}
          onDelete={() => onDelete(area.id)}
        />
      ))}
    </div>
  );
}
