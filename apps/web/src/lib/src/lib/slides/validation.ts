import { z } from "zod";
import { Slide, SlideLayout, BlockType, ChartType } from "./schema";

// Validation schemas using Zod
export const ChartDataSchema = z.object({
  type: z.enum(["bar", "line", "pie", "area"]),
  labels: z.array(z.string()),
  datasets: z.array(
    z.object({
      label: z.string(),
      data: z.array(z.number()),
      color: z.string().optional(),
    })
  ),
  title: z.string().optional(),
});

export const TableDataSchema = z.object({
  headers: z.array(z.string()),
  rows: z.array(z.array(z.union([z.string(), z.number()]))),
  title: z.string().optional(),
});

export const KPIDataSchema = z.object({
  value: z.union([z.string(), z.number()]),
  label: z.string(),
  change: z
    .object({
      value: z.number(),
      trend: z.enum(["up", "down", "neutral"]),
    })
    .optional(),
  icon: z.string().optional(),
});

export const MediaBlockSchema = z.object({
  type: z.enum(["image", "icon"]),
  url: z.string().url(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  position: z.enum(["left", "right", "center", "background"]).optional(),
  mask: z.enum(["rounded", "circle", "square"]).optional(),
});

export const SlideBlockSchema = z.object({
  id: z.string(),
  type: z.enum([
    "title",
    "paragraph",
    "bullet",
    "media",
    "chart",
    "table",
    "kpi",
    "quote",
    "icon",
  ]),
  content: z.union([z.string(), z.array(z.string())]).optional(),
  media: MediaBlockSchema.optional(),
  chart: ChartDataSchema.optional(),
  table: TableDataSchema.optional(),
  kpis: z.array(KPIDataSchema).optional(),
  style: z
    .object({
      fontSize: z.number().optional(),
      color: z.string().optional(),
      alignment: z.enum(["left", "center", "right"]).optional(),
      fontWeight: z.enum(["normal", "bold"]).optional(),
    })
    .optional(),
});

export const SlideSchema = z.object({
  id: z.string(),
  title: z.string(),
  layout: z.enum([
    "title",
    "content",
    "section",
    "two-column",
    "comparison",
    "quote",
    "kpi",
    "chart",
    "table",
    "timeline",
    "image-left",
    "image-right",
    "full-image",
  ]),
  blocks: z.array(SlideBlockSchema),
  notes: z.string().optional(),
  imageUrl: z.string().optional(), // Legacy
  imagePrompt: z.string().optional(), // Legacy
  content: z.array(z.string()).optional(), // Legacy
});

export function validateSlide(slide: unknown): Slide {
  return SlideSchema.parse(slide);
}

export function validateSlides(slides: unknown[]): Slide[] {
  return slides.map(validateSlide);
}

