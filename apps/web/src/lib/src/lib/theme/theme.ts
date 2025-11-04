// Brand theme system - palette, fonts, typography scale

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
}

export interface TypographyScale {
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  "2xl": number;
  "3xl": number;
  "4xl": number;
  "5xl": number;
  "6xl": number;
}

export interface FontConfig {
  heading: string;
  body: string;
  monospace?: string;
}

export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
}

export interface BrandTheme {
  palette: ColorPalette;
  fonts: FontConfig;
  typography: TypographyScale;
  spacing: Spacing;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  logo?: {
    url: string;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    size: "small" | "medium" | "large";
  };
}

export const DEFAULT_TYPOGRAPHY_SCALE: TypographyScale = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
};

export const DEFAULT_SPACING: Spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
};

export function createBrandTheme(
  primaryColor: string,
  secondaryColor: string,
  accentColor: string,
  headingFont: string = "Inter",
  bodyFont: string = "Inter",
  logoUrl?: string | null
): BrandTheme {
  // Generate complementary colors from primary
  const palette: ColorPalette = {
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    background: "#FFFFFF",
    foreground: "#000000",
    muted: "#F5F5F5",
    mutedForeground: "#737373",
    border: "#E5E5E5",
  };

  return {
    palette,
    fonts: {
      heading: headingFont,
      body: bodyFont,
      monospace: "monospace",
    },
    typography: DEFAULT_TYPOGRAPHY_SCALE,
    spacing: DEFAULT_SPACING,
    borderRadius: {
      sm: "0.125rem",
      md: "0.375rem",
      lg: "0.5rem",
      full: "9999px",
    },
    logo: logoUrl
      ? {
          url: logoUrl,
          position: "bottom-right",
          size: "small",
        }
      : undefined,
  };
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

