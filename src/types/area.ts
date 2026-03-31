export type ShapeType = "rect" | "circle";

export type RectArea = {
  readonly id: string;
  readonly shape: "rect";
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly href: string;
  readonly alt: string;
};

export type CircleArea = {
  readonly id: string;
  readonly shape: "circle";
  readonly cx: number;
  readonly cy: number;
  readonly radius: number;
  readonly href: string;
  readonly alt: string;
};

export type Area = RectArea | CircleArea;
