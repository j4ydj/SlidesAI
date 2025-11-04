// Structured slide schema with blocks and data visualization support

export type SlideLayout = 
  | "title" 
  | "content" 
  | "section" 
  | "two-column" 
  | "comparison" 
  | "quote" 
  | "kpi" 
  | "chart" 
  | "table" 
  | "timeline"
  | "image-left"
  | "image-right"
  | "full-image";

export type BlockType = 
  | "title"
  | "paragraph"
  | "bullet"
  | "media"
  | "chart"
  | "table"
  | "kpi"
  | "quote"
  | "icon";

export type ChartType = "bar" | "line" | "pie" | "area";

export type MediaType = "image" | "icon";

export interface ChartData {
  type: ChartType;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    color?: string;
  }>;
  title?: string;
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
  title?: string;
}

export interface KPIData {
  value: string | number;
  label: string;
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
  icon?: string;
}

export interface MediaBlock {
  type: MediaType;
  url: string;
  alt?: string;
  caption?: string;
  position?: "left" | "right" | "center" | "background";
  mask?: "rounded" | "circle" | "square";
}

export interface SlideBlock {
  id: string;
  type: BlockType;
  content?: string | string[];
  media?: MediaBlock;
  chart?: ChartData;
  table?: TableData;
  kpis?: KPIData[];
  style?: {
    fontSize?: number;
    color?: string;
    alignment?: "left" | "center" | "right";
    fontWeight?: "normal" | "bold";
  };
}

export interface Slide {
  id: string;
  title: string;
  layout: SlideLayout;
  blocks: SlideBlock[];
  notes?: string;
  imageUrl?: string; // Legacy support
  imagePrompt?: string; // Legacy support
  content?: string[]; // Legacy support - will be normalized to blocks
}

export interface SlideTemplate {
  id: string;
  name: string;
  layout: SlideLayout;
  description: string;
  defaultBlocks: (theme?: any) => SlideBlock[];
  requiredBlocks: BlockType[];
}

