// Block renderer component
import { SlideBlock } from "@/lib/slides/schema";
import { TitleBlock } from "./TitleBlock";
import { ParagraphBlock } from "./ParagraphBlock";
import { BulletBlock } from "./BulletBlock";
import { MediaBlock } from "./MediaBlock";
import { QuoteBlock } from "./QuoteBlock";
import { ChartBlock } from "./ChartBlock";
import { TableBlock } from "./TableBlock";
import { KPIBlock } from "./KPIBlock";

interface BlockRendererProps {
  block: SlideBlock;
  theme?: any;
}

export const BlockRenderer = ({ block, theme }: BlockRendererProps) => {
  switch (block.type) {
    case "title":
      return <TitleBlock block={block} theme={theme} />;
    case "paragraph":
      return <ParagraphBlock block={block} theme={theme} />;
    case "bullet":
      return <BulletBlock block={block} theme={theme} />;
    case "media":
      return <MediaBlock block={block} theme={theme} />;
    case "quote":
      return <QuoteBlock block={block} theme={theme} />;
    case "chart":
      return <ChartBlock block={block} theme={theme} />;
    case "table":
      return <TableBlock block={block} theme={theme} />;
    case "kpi":
      return <KPIBlock block={block} theme={theme} />;
    default:
      return null;
  }
};

