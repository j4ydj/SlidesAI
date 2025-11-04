// Typography utilities for theme

import { TypographyScale, FontConfig } from "./theme";

export interface TypographyStyles {
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  letterSpacing?: number;
}

export function getTypographyStyle(
  scale: TypographyScale,
  size: keyof TypographyScale,
  weight: "normal" | "bold" = "normal"
): TypographyStyles {
  const fontSize = scale[size];
  const lineHeight = fontSize * 1.5;
  const fontWeight = weight === "bold" ? 700 : 400;

  return {
    fontSize,
    lineHeight,
    fontWeight,
  };
}

export function getFontFamily(fonts: FontConfig, type: "heading" | "body"): string {
  const font = type === "heading" ? fonts.heading : fonts.body;
  // Map web fonts to safe fallbacks
  const fontMap: Record<string, string> = {
    Inter: "Inter, system-ui, -apple-system, sans-serif",
    "Roboto": "Roboto, system-ui, sans-serif",
    "Open Sans": "Open Sans, system-ui, sans-serif",
    "Lato": "Lato, system-ui, sans-serif",
    "Montserrat": "Montserrat, system-ui, sans-serif",
    "Playfair Display": "Playfair Display, serif",
    "Merriweather": "Merriweather, serif",
  };

  return fontMap[font] || `${font}, system-ui, sans-serif`;
}

export function getPptxFont(font: string): string {
  // Map web fonts to PPTX-safe fonts
  const fontMap: Record<string, string> = {
    Inter: "Calibri",
    "Roboto": "Calibri",
    "Open Sans": "Calibri",
    "Lato": "Calibri",
    "Montserrat": "Calibri",
    "Playfair Display": "Georgia",
    "Merriweather": "Georgia",
  };

  return fontMap[font] || "Calibri";
}

