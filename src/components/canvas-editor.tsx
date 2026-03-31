"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import type { Area, ShapeType } from "@/types/area";

type Props = {
  readonly imageSrc: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly areas: readonly Area[];
  readonly selectedId: string | null;
  readonly shapeType: ShapeType;
  readonly onAddArea: (area: Area) => void;
  readonly onSelectArea: (id: string | null) => void;
  readonly onUpdateAreaGeometry: (id: string, geometry: Partial<Area>) => void;
  readonly onImageResize: (width: number, height: number) => void;
};

type Interaction =
  | null
  | {
      readonly mode: "drawing";
      readonly startX: number;
      readonly startY: number;
      readonly currentX: number;
      readonly currentY: number;
    }
  | {
      readonly mode: "moving";
      readonly areaId: string;
      readonly offsetX: number;
      readonly offsetY: number;
      readonly currentX: number;
      readonly currentY: number;
    }
  | {
      readonly mode: "resizing";
      readonly areaId: string;
      readonly handleIndex: number;
      readonly originArea: Area;
      readonly currentX: number;
      readonly currentY: number;
    };

function generateId(): string {
  return `area-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getMousePos(
  e: React.MouseEvent,
  canvas: HTMLCanvasElement,
  scale: number
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) / scale,
    y: (e.clientY - rect.top) / scale,
  };
}

function isPointInArea(x: number, y: number, area: Area): boolean {
  if (area.shape === "rect") {
    return (
      x >= area.x &&
      x <= area.x + area.width &&
      y >= area.y &&
      y <= area.y + area.height
    );
  }
  const dx = x - area.cx;
  const dy = y - area.cy;
  return dx * dx + dy * dy <= area.radius * area.radius;
}

// 矩形の4隅ハンドル: 0=TL, 1=TR, 2=BL, 3=BR
function getRectHandles(area: Extract<Area, { shape: "rect" }>): readonly [number, number][] {
  return [
    [area.x, area.y],
    [area.x + area.width, area.y],
    [area.x, area.y + area.height],
    [area.x + area.width, area.y + area.height],
  ];
}

// 円のハンドル: 右端
function getCircleHandle(area: Extract<Area, { shape: "circle" }>): [number, number] {
  return [area.cx + area.radius, area.cy];
}

function findHandle(
  x: number,
  y: number,
  area: Area,
  hitRadius: number
): number | null {
  if (area.shape === "rect") {
    const handles = getRectHandles(area);
    for (let i = 0; i < handles.length; i++) {
      const dx = x - handles[i][0];
      const dy = y - handles[i][1];
      if (dx * dx + dy * dy <= hitRadius * hitRadius) return i;
    }
  } else {
    const [hx, hy] = getCircleHandle(area);
    const dx = x - hx;
    const dy = y - hy;
    if (dx * dx + dy * dy <= hitRadius * hitRadius) return 0;
  }
  return null;
}

const HANDLE_CURSORS_RECT = ["nwse-resize", "nesw-resize", "nesw-resize", "nwse-resize"];

const COLORS = {
  selected: {
    stroke: "#3a4f66",
    fill: "rgba(58, 79, 102, 0.18)",
    label: "rgba(58, 79, 102, 0.92)",
    handle: "#3a4f66",
    handleStroke: "#fffffd",
  },
  normal: {
    stroke: "#8a5a5a",
    fill: "rgba(138, 90, 90, 0.14)",
    label: "rgba(138, 90, 90, 0.92)",
    handle: "#8a5a5a",
    handleStroke: "#fffffd",
  },
  drawing: {
    stroke: "#3a7a5a",
    fill: "rgba(58, 122, 90, 0.12)",
    badge: "rgba(58, 122, 90, 0.92)",
  },
} as const;

export function CanvasEditor({
  imageSrc,
  imageWidth,
  imageHeight,
  areas,
  selectedId,
  shapeType,
  onAddArea,
  onSelectArea,
  onUpdateAreaGeometry,
  onImageResize,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [interaction, setInteraction] = useState<Interaction>(null);
  const [scale, setScale] = useState(1);
  const [cursorStyle, setCursorStyle] = useState("crosshair");
  const resizingRef = useRef<{ startX: number; startWidth: number; aspectRatio: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    const updateScale = () => {
      const container = containerRef.current;
      if (!container) return;
      const maxWidth = container.clientWidth;
      const newScale = imageWidth > maxWidth ? maxWidth / imageWidth : 1;
      setScale(newScale);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [imageWidth]);

  // インタラクション中のエリア位置を計算
  const getDisplayArea = useCallback(
    (area: Area): Area => {
      if (!interaction) return area;

      if (interaction.mode === "moving" && interaction.areaId === area.id) {
        if (area.shape === "rect") {
          return {
            ...area,
            x: Math.round(interaction.currentX - interaction.offsetX),
            y: Math.round(interaction.currentY - interaction.offsetY),
          };
        }
        return {
          ...area,
          cx: Math.round(interaction.currentX - interaction.offsetX),
          cy: Math.round(interaction.currentY - interaction.offsetY),
        };
      }

      if (interaction.mode === "resizing" && interaction.areaId === area.id) {
        const orig = interaction.originArea;
        if (orig.shape === "rect") {
          const hi = interaction.handleIndex;
          const cx = interaction.currentX;
          const cy = interaction.currentY;

          let x1 = orig.x;
          let y1 = orig.y;
          let x2 = orig.x + orig.width;
          let y2 = orig.y + orig.height;

          if (hi === 0) { x1 = cx; y1 = cy; }
          else if (hi === 1) { x2 = cx; y1 = cy; }
          else if (hi === 2) { x1 = cx; y2 = cy; }
          else { x2 = cx; y2 = cy; }

          const nx = Math.round(Math.min(x1, x2));
          const ny = Math.round(Math.min(y1, y2));
          return {
            ...area,
            x: nx,
            y: ny,
            width: Math.round(Math.abs(x2 - x1)),
            height: Math.round(Math.abs(y2 - y1)),
          } as Area;
        }
        // 円: 半径をドラッグで変更
        const dx = interaction.currentX - orig.cx;
        const dy = interaction.currentY - orig.cy;
        return {
          ...area,
          radius: Math.max(5, Math.round(Math.sqrt(dx * dx + dy * dy))),
        } as Area;
      }

      return area;
    },
    [interaction]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = imageWidth * scale;
    canvas.height = imageHeight * scale;

    ctx.save();
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, imageWidth, imageHeight);

    for (const rawArea of areas) {
      const area = getDisplayArea(rawArea);
      const isSelected = area.id === selectedId;
      const colors = isSelected ? COLORS.selected : COLORS.normal;
      const lw = 2 / scale;

      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = lw;
      ctx.fillStyle = colors.fill;

      if (area.shape === "rect") {
        ctx.fillRect(area.x, area.y, area.width, area.height);
        ctx.strokeRect(area.x, area.y, area.width, area.height);

        if (isSelected) {
          const hs = 6 / scale;
          const handles = getRectHandles(area);
          for (const [hx, hy] of handles) {
            ctx.fillStyle = colors.handle;
            ctx.strokeStyle = colors.handleStroke;
            ctx.lineWidth = 1.5 / scale;
            ctx.beginPath();
            ctx.arc(hx, hy, hs, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = lw;
        }
      } else {
        ctx.beginPath();
        ctx.arc(area.cx, area.cy, area.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (isSelected) {
          const hs = 6 / scale;
          const [hx, hy] = getCircleHandle(area);
          ctx.fillStyle = colors.handle;
          ctx.strokeStyle = colors.handleStroke;
          ctx.lineWidth = 1.5 / scale;
          ctx.beginPath();
          ctx.arc(hx, hy, hs, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // 中心点
          ctx.fillStyle = colors.handle;
          ctx.beginPath();
          ctx.arc(area.cx, area.cy, 3 / scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ラベル
      const label = area.alt || area.href;
      if (label) {
        const fontSize = Math.max(16, 13 / scale);
        ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
        const displayLabel =
          label.length > 18 ? label.slice(0, 18) + "..." : label;
        const tm = ctx.measureText(displayLabel);
        const px = 6 / scale;
        const py = 3 / scale;

        const lx =
          area.shape === "rect" ? area.x : area.cx - tm.width / 2;
        const ly =
          area.shape === "rect"
            ? area.y - py - 2 / scale
            : area.cy - area.radius - py - 2 / scale;

        ctx.fillStyle = colors.label;
        ctx.beginPath();
        ctx.roundRect(
          lx - px,
          ly - fontSize,
          tm.width + px * 2,
          fontSize + py * 2,
          3 / scale
        );
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.fillText(displayLabel, lx, ly);
      }
    }

    // 新規描画プレビュー
    if (interaction?.mode === "drawing") {
      ctx.strokeStyle = COLORS.drawing.stroke;
      ctx.lineWidth = 2 / scale;
      ctx.fillStyle = COLORS.drawing.fill;
      ctx.setLineDash([5 / scale, 3 / scale]);

      if (shapeType === "rect") {
        const x = Math.min(interaction.startX, interaction.currentX);
        const y = Math.min(interaction.startY, interaction.currentY);
        const w = Math.abs(interaction.currentX - interaction.startX);
        const h = Math.abs(interaction.currentY - interaction.startY);
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);

        if (w > 40 && h > 25) {
          const txt = `${Math.round(w)} x ${Math.round(h)}`;
          const fs = Math.max(16, 11 / scale);
          ctx.font = `500 ${fs}px system-ui, sans-serif`;
          ctx.setLineDash([]);
          const tm = ctx.measureText(txt);
          const cx = x + w / 2 - tm.width / 2;
          const cy = y + h / 2 + fs / 3;
          ctx.fillStyle = COLORS.drawing.badge;
          ctx.beginPath();
          ctx.roundRect(cx - 4 / scale, cy - fs, tm.width + 8 / scale, fs + 6 / scale, 3 / scale);
          ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.fillText(txt, cx, cy);
        }
      } else {
        const dx = interaction.currentX - interaction.startX;
        const dy = interaction.currentY - interaction.startY;
        const radius = Math.sqrt(dx * dx + dy * dy);
        ctx.beginPath();
        ctx.arc(interaction.startX, interaction.startY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (radius > 25) {
          const txt = `r=${Math.round(radius)}`;
          const fs = Math.max(16, 11 / scale);
          ctx.font = `500 ${fs}px system-ui, sans-serif`;
          ctx.setLineDash([]);
          const tm = ctx.measureText(txt);
          const cx = interaction.startX - tm.width / 2;
          const cy = interaction.startY + fs / 3;
          ctx.fillStyle = COLORS.drawing.badge;
          ctx.beginPath();
          ctx.roundRect(cx - 4 / scale, cy - fs, tm.width + 8 / scale, fs + 6 / scale, 3 / scale);
          ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.fillText(txt, cx, cy);
        }
      }
      ctx.setLineDash([]);
    }

    ctx.restore();
  }, [areas, interaction, imageWidth, imageHeight, scale, selectedId, shapeType, getDisplayArea]);

  useEffect(() => {
    const animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [draw]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = getMousePos(e, canvas, scale);
      const hitRadius = 8 / scale;

      // 選択中エリアのハンドルチェック
      if (selectedId) {
        const selectedArea = areas.find((a) => a.id === selectedId);
        if (selectedArea) {
          const handleIdx = findHandle(pos.x, pos.y, selectedArea, hitRadius);
          if (handleIdx !== null) {
            setInteraction({
              mode: "resizing",
              areaId: selectedId,
              handleIndex: handleIdx,
              originArea: selectedArea,
              currentX: pos.x,
              currentY: pos.y,
            });
            return;
          }
        }
      }

      // エリア上のクリック → 移動開始
      for (let i = areas.length - 1; i >= 0; i--) {
        if (isPointInArea(pos.x, pos.y, areas[i])) {
          const area = areas[i];
          onSelectArea(area.id);
          const offsetX = area.shape === "rect" ? pos.x - area.x : pos.x - area.cx;
          const offsetY = area.shape === "rect" ? pos.y - area.y : pos.y - area.cy;
          setInteraction({
            mode: "moving",
            areaId: area.id,
            offsetX,
            offsetY,
            currentX: pos.x,
            currentY: pos.y,
          });
          return;
        }
      }

      // 空白エリア → 新規描画
      onSelectArea(null);
      setInteraction({
        mode: "drawing",
        startX: pos.x,
        startY: pos.y,
        currentX: pos.x,
        currentY: pos.y,
      });
    },
    [areas, selectedId, onSelectArea, scale]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = getMousePos(e, canvas, scale);

      // インタラクション中
      if (interaction) {
        if (interaction.mode === "drawing") {
          setInteraction({ ...interaction, currentX: pos.x, currentY: pos.y });
        } else if (interaction.mode === "moving") {
          setInteraction({ ...interaction, currentX: pos.x, currentY: pos.y });
        } else if (interaction.mode === "resizing") {
          setInteraction({ ...interaction, currentX: pos.x, currentY: pos.y });
        }
        return;
      }

      // カーソル更新
      const hitRadius = 8 / scale;
      if (selectedId) {
        const selectedArea = areas.find((a) => a.id === selectedId);
        if (selectedArea) {
          const handleIdx = findHandle(pos.x, pos.y, selectedArea, hitRadius);
          if (handleIdx !== null) {
            if (selectedArea.shape === "rect") {
              setCursorStyle(HANDLE_CURSORS_RECT[handleIdx]);
            } else {
              setCursorStyle("ew-resize");
            }
            return;
          }
        }
      }
      for (let i = areas.length - 1; i >= 0; i--) {
        if (isPointInArea(pos.x, pos.y, areas[i])) {
          setCursorStyle("move");
          return;
        }
      }
      setCursorStyle("crosshair");
    },
    [interaction, areas, selectedId, scale]
  );

  const handleMouseUp = useCallback(() => {
    if (!interaction) return;

    if (interaction.mode === "drawing") {
      const MIN_SIZE = 5;
      if (shapeType === "rect") {
        const w = Math.abs(interaction.currentX - interaction.startX);
        const h = Math.abs(interaction.currentY - interaction.startY);
        if (w >= MIN_SIZE && h >= MIN_SIZE) {
          onAddArea({
            id: generateId(),
            shape: "rect",
            x: Math.round(Math.min(interaction.startX, interaction.currentX)),
            y: Math.round(Math.min(interaction.startY, interaction.currentY)),
            width: Math.round(w),
            height: Math.round(h),
            href: "",
            alt: "",
          });
        }
      } else {
        const dx = interaction.currentX - interaction.startX;
        const dy = interaction.currentY - interaction.startY;
        const radius = Math.sqrt(dx * dx + dy * dy);
        if (radius >= MIN_SIZE) {
          onAddArea({
            id: generateId(),
            shape: "circle",
            cx: Math.round(interaction.startX),
            cy: Math.round(interaction.startY),
            radius: Math.round(radius),
            href: "",
            alt: "",
          });
        }
      }
    }

    if (interaction.mode === "moving") {
      const area = areas.find((a) => a.id === interaction.areaId);
      if (area) {
        const moved = getDisplayArea(area);
        if (moved.shape === "rect") {
          onUpdateAreaGeometry(interaction.areaId, { x: moved.x, y: moved.y });
        } else {
          onUpdateAreaGeometry(interaction.areaId, { cx: moved.cx, cy: moved.cy });
        }
      }
    }

    if (interaction.mode === "resizing") {
      const area = areas.find((a) => a.id === interaction.areaId);
      if (area) {
        const resized = getDisplayArea(area);
        if (resized.shape === "rect") {
          onUpdateAreaGeometry(interaction.areaId, {
            x: resized.x,
            y: resized.y,
            width: resized.width,
            height: resized.height,
          });
        } else {
          onUpdateAreaGeometry(interaction.areaId, { radius: resized.radius });
        }
      }
    }

    setInteraction(null);
  }, [interaction, shapeType, onAddArea, areas, getDisplayArea, onUpdateAreaGeometry]);

  const handleResizeStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      resizingRef.current = {
        startX: e.clientX,
        startWidth: imageWidth,
        aspectRatio: imageHeight / imageWidth,
      };
    },
    [imageWidth, imageHeight]
  );

  const handleResizeMove = useCallback(
    (e: React.PointerEvent) => {
      const r = resizingRef.current;
      if (!r) return;
      const dx = e.clientX - r.startX;
      const newWidth = Math.max(100, Math.round(r.startWidth + dx / scale));
      const newHeight = Math.round(newWidth * r.aspectRatio);
      onImageResize(newWidth, newHeight);
    },
    [scale, onImageResize]
  );

  const handleResizeEnd = useCallback(() => {
    resizingRef.current = null;
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-auto flex justify-center">
      <div className="relative inline-block">
        <canvas
          ref={canvasRef}
          className="rounded-lg"
          style={{ cursor: cursorStyle }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {/* 画像リサイズハンドル */}
        <div
          onPointerDown={handleResizeStart}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeEnd}
          onPointerCancel={handleResizeEnd}
          className="absolute bottom-0.5 right-0.5 w-8 h-8 cursor-nwse-resize flex items-center justify-center group z-10 rounded-tl-md bg-accent hover:bg-accent-hover transition-colors shadow-md"
          title="ドラッグでリサイズ"
        >
          <svg
            className="w-4 h-4 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22ZM22 10H20V8H22V10ZM18 14H16V12H18V14ZM14 18H12V16H14V18ZM10 22H8V20H10V22Z" />
          </svg>
        </div>
        {/* サイズ表示 */}
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-surface/80 text-text-tertiary text-base font-mono pointer-events-none">
          {imageWidth} x {imageHeight}
        </div>
      </div>
    </div>
  );
}
