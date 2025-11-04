// PPTX theme and slide masters
import PptxGenJS from "pptxgenjs";
import { BrandTheme } from "../theme/theme";
import { getPptxFont } from "../theme/typography";
import { hexToPptxColor } from "../theme/palette";

export function setupPptxTheme(pptx: PptxGenJS, theme?: BrandTheme) {
  // Set slide layout to 16:9
  pptx.layout = "LAYOUT_16x9";

  // Define color scheme
  const primaryColor = theme?.palette?.primary || "000000";
  const secondaryColor = theme?.palette?.secondary || "666666";
  const accentColor = theme?.palette?.accent || "0066CC";

  // Define slide masters
  const titleMaster = pptx.defineSlideMaster({
    title: "Title Master",
    background: { color: "FFFFFF" },
    objects: [
      {
        rect: {
          x: 0,
          y: 0,
          w: "100%",
          h: "100%",
          fill: { color: "FFFFFF" },
        },
      },
    ],
  });

  const contentMaster = pptx.defineSlideMaster({
    title: "Content Master",
    background: { color: "FFFFFF" },
    objects: [
      {
        rect: {
          x: 0,
          y: 0,
          w: "100%",
          h: "100%",
          fill: { color: "FFFFFF" },
        },
      },
    ],
  });

  // Define text styles
  pptx.defineLayout({
    name: "LAYOUT_16x9",
    width: 10,
    height: 5.625,
  });

  return {
    titleMaster,
    contentMaster,
    colors: {
      primary: hexToPptxColor(primaryColor),
      secondary: hexToPptxColor(secondaryColor),
      accent: hexToPptxColor(accentColor),
    },
    fonts: {
      heading: theme ? getPptxFont(theme.fonts.heading) : "Calibri",
      body: theme ? getPptxFont(theme.fonts.body) : "Calibri",
    },
  };
}

export function getTextStyle(
  block: any,
  theme?: BrandTheme,
  defaults?: { fontSize?: number; color?: string; alignment?: string; bold?: boolean }
) {
  const fontSize = block.style?.fontSize || defaults?.fontSize || 18;
  const color = block.style?.color || defaults?.color || theme?.palette?.primary || "000000";
  const alignment = block.style?.alignment || defaults?.alignment || "left";
  const bold = block.style?.fontWeight === "bold" || defaults?.bold || false;
  const fontFace = theme ? getPptxFont(theme.fonts.body) : "Calibri";

  return {
    fontSize,
    color: hexToPptxColor(color),
    align: alignment as "left" | "center" | "right",
    bold,
    fontFace,
  };
}

