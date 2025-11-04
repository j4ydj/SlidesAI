// PPTX layout utilities - convert percentage-based frames to inches
import { Frame } from "../slides/layoutEngine";

// PPTX uses inches, 16:9 = 10" x 5.625"
const PPTX_WIDTH = 10;
const PPTX_HEIGHT = 5.625;

export function percentToInches(percent: number, dimension: "width" | "height"): number {
  const total = dimension === "width" ? PPTX_WIDTH : PPTX_HEIGHT;
  return (percent / 100) * total;
}

export function frameToPptxPosition(frame: Frame): {
  x: number;
  y: number;
  w: number;
  h: number;
} {
  return {
    x: percentToInches(frame.x, "width"),
    y: percentToInches(frame.y, "height"),
    w: percentToInches(frame.width, "width"),
    h: percentToInches(frame.height, "height"),
  };
}

