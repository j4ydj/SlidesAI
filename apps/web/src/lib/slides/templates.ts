import { SlideTemplate, SlideBlock, BlockType } from "./schema";

// Registry of slide templates with default block structures
export const SLIDE_TEMPLATES: SlideTemplate[] = [
  {
    id: "title",
    name: "Title Slide",
    layout: "title",
    description: "Opening slide with title and subtitle",
    requiredBlocks: ["title"],
    defaultBlocks: () => [
      {
        id: "title-1",
        type: "title",
        content: "Presentation Title",
        style: {
          fontSize: 60,
          alignment: "center",
          fontWeight: "bold",
        },
      },
      {
        id: "subtitle-1",
        type: "paragraph",
        content: "Subtitle or tagline",
        style: {
          fontSize: 24,
          alignment: "center",
        },
      },
    ],
  },
  {
    id: "content",
    name: "Content Slide",
    layout: "content",
    description: "Standard slide with title and bullet points",
    requiredBlocks: ["title"],
    defaultBlocks: () => [
      {
        id: "title-1",
        type: "title",
        content: "Slide Title",
        style: {
          fontSize: 36,
          fontWeight: "bold",
        },
      },
      {
        id: "bullets-1",
        type: "bullet",
        content: ["First point", "Second point", "Third point"],
        style: {
          fontSize: 18,
        },
      },
    ],
  },
  {
    id: "section",
    name: "Section Header",
    layout: "section",
    description: "Section divider slide",
    requiredBlocks: ["title"],
    defaultBlocks: () => [
      {
        id: "title-1",
        type: "title",
        content: "Section Title",
        style: {
          fontSize: 48,
          alignment: "center",
          fontWeight: "bold",
        },
      },
    ],
  },
  {
    id: "two-column",
    name: "Two Column",
    layout: "two-column",
    description: "Content split into two columns",
    requiredBlocks: ["title"],
    defaultBlocks: () => [
      {
        id: "title-1",
        type: "title",
        content: "Slide Title",
        style: {
          fontSize: 36,
          fontWeight: "bold",
        },
      },
      {
        id: "column-1",
        type: "bullet",
        content: ["Left column point 1", "Left column point 2"],
        style: {
          fontSize: 18,
        },
      },
      {
        id: "column-2",
        type: "bullet",
        content: ["Right column point 1", "Right column point 2"],
        style: {
          fontSize: 18,
        },
      },
    ],
  },
  {
    id: "comparison",
    name: "Comparison",
    layout: "comparison",
    description: "Side-by-side comparison",
    requiredBlocks: ["title"],
    defaultBlocks: () => [
      {
        id: "title-1",
        type: "title",
        content: "Comparison Title",
        style: {
          fontSize: 36,
          fontWeight: "bold",
        },
      },
      {
        id: "comparison-left",
        type: "bullet",
        content: ["Option A: Point 1", "Option A: Point 2"],
        style: {
          fontSize: 18,
        },
      },
      {
        id: "comparison-right",
        type: "bullet",
        content: ["Option B: Point 1", "Option B: Point 2"],
        style: {
          fontSize: 18,
        },
      },
    ],
  },
  {
    id: "quote",
    name: "Quote Slide",
    layout: "quote",
    description: "Highlighted quote or testimonial",
    requiredBlocks: ["quote"],
    defaultBlocks: () => [
      {
        id: "quote-1",
        type: "quote",
        content: "This is an inspiring quote that captures the essence of your message.",
        style: {
          fontSize: 32,
          alignment: "center",
          fontWeight: "bold",
        },
      },
      {
        id: "quote-author",
        type: "paragraph",
        content: "— Author Name",
        style: {
          fontSize: 18,
          alignment: "center",
        },
      },
    ],
  },
  {
    id: "kpi",
    name: "KPI Dashboard",
    layout: "kpi",
    description: "Key performance indicators",
    requiredBlocks: ["title", "kpi"],
    defaultBlocks: () => [
      {
        id: "title-1",
        type: "title",
        content: "Key Metrics",
        style: {
          fontSize: 36,
          fontWeight: "bold",
        },
      },
      {
        id: "kpis-1",
        type: "kpi",
        kpis: [
          {
            value: "100",
            label: "Metric 1",
            change: { value: 10, trend: "up" },
          },
          {
            value: "250",
            label: "Metric 2",
            change: { value: 5, trend: "down" },
          },
          {
            value: "75%",
            label: "Metric 3",
            change: { value: 0, trend: "neutral" },
          },
        ],
      },
    ],
  },
  {
    id: "chart",
    name: "Chart Slide",
    layout: "chart",
    description: "Data visualization",
    requiredBlocks: ["title", "chart"],
    defaultBlocks: () => [
      {
        id: "title-1",
        type: "title",
        content: "Chart Title",
        style: {
          fontSize: 36,
          fontWeight: "bold",
        },
      },
      {
        id: "chart-1",
        type: "chart",
        chart: {
          type: "bar",
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [
            {
              label: "Sales",
              data: [100, 150, 200, 180],
            },
          ],
        },
      },
    ],
  },
  {
    id: "table",
    name: "Table Slide",
    layout: "table",
    description: "Data table",
    requiredBlocks: ["title", "table"],
    defaultBlocks: () => [
      {
        id: "title-1",
        type: "title",
        content: "Table Title",
        style: {
          fontSize: 36,
          fontWeight: "bold",
        },
      },
      {
        id: "table-1",
        type: "table",
        table: {
          headers: ["Column 1", "Column 2", "Column 3"],
          rows: [
            ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
            ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
          ],
        },
      },
    ],
  },
  {
    id: "timeline",
    name: "Timeline",
    layout: "timeline",
    description: "Chronological timeline",
    requiredBlocks: ["title"],
    defaultBlocks: () => [
      {
        id: "title-1",
        type: "title",
        content: "Timeline Title",
        style: {
          fontSize: 36,
          fontWeight: "bold",
        },
      },
      {
        id: "timeline-1",
        type: "bullet",
        content: [
          "2024 Q1: Milestone 1",
          "2024 Q2: Milestone 2",
          "2024 Q3: Milestone 3",
        ],
        style: {
          fontSize: 18,
        },
      },
    ],
  },
  {
    id: "image-left",
    name: "Image Left",
    layout: "image-left",
    description: "Image on left, content on right",
    requiredBlocks: ["title"],
    defaultBlocks: () => [
      {
        id: "title-1",
        type: "title",
        content: "Slide Title",
        style: {
          fontSize: 36,
          fontWeight: "bold",
        },
      },
      {
        id: "media-1",
        type: "media",
        media: {
          type: "image",
          url: "",
          position: "left",
        },
      },
      {
        id: "bullets-1",
        type: "bullet",
        content: ["Point 1", "Point 2", "Point 3"],
        style: {
          fontSize: 18,
        },
      },
    ],
  },
  {
    id: "image-right",
    name: "Image Right",
    layout: "image-right",
    description: "Image on right, content on left",
    requiredBlocks: ["title"],
    defaultBlocks: () => [
      {
        id: "title-1",
        type: "title",
        content: "Slide Title",
        style: {
          fontSize: 36,
          fontWeight: "bold",
        },
      },
      {
        id: "bullets-1",
        type: "bullet",
        content: ["Point 1", "Point 2", "Point 3"],
        style: {
          fontSize: 18,
        },
      },
      {
        id: "media-1",
        type: "media",
        media: {
          type: "image",
          url: "",
          position: "right",
        },
      },
    ],
  },
  {
    id: "full-image",
    name: "Full Image",
    layout: "full-image",
    description: "Full background image with overlay text",
    requiredBlocks: ["title"],
    defaultBlocks: () => [
      {
        id: "media-1",
        type: "media",
        media: {
          type: "image",
          url: "",
          position: "background",
        },
      },
      {
        id: "title-1",
        type: "title",
        content: "Slide Title",
        style: {
          fontSize: 48,
          alignment: "center",
          fontWeight: "bold",
        },
      },
    ],
  },
];

export function getTemplateById(id: string): SlideTemplate | undefined {
  return SLIDE_TEMPLATES.find((t) => t.id === id);
}

export function getTemplateByLayout(layout: string): SlideTemplate | undefined {
  return SLIDE_TEMPLATES.find((t) => t.id === layout || t.layout === layout);
}

export function createSlideFromTemplate(
  templateId: string,
  overrides?: Partial<SlideBlock[]>
): SlideBlock[] {
  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }
  const blocks = template.defaultBlocks();
  if (overrides) {
    return blocks.map((block, idx) => ({
      ...block,
      ...(overrides[idx] || {}),
    }));
  }
  return blocks;
}

