// Layout engine - produces positioned frames for blocks from template + theme

import { Slide, SlideBlock, SlideLayout } from "./schema";
import { BrandTheme } from "../theme/theme";

export interface Frame {
  id: string;
  x: number; // percentage of slide width (0-100)
  y: number; // percentage of slide height (0-100)
  width: number; // percentage of slide width (0-100)
  height: number; // percentage of slide height (0-100)
  block: SlideBlock;
  zIndex?: number;
}

export interface LayoutFrames {
  layout: SlideLayout;
  frames: Frame[];
  background?: {
    color?: string;
    image?: string;
  };
}

const SLIDE_WIDTH = 1920; // 16:9 aspect ratio
const SLIDE_HEIGHT = 1080;
const MARGIN_X = 120; // 6.25% margin
const MARGIN_Y = 80; // 7.4% margin
const CONTENT_WIDTH = SLIDE_WIDTH - MARGIN_X * 2;
const CONTENT_HEIGHT = SLIDE_HEIGHT - MARGIN_Y * 2;

export function generateLayoutFrames(
  slide: Slide,
  theme?: BrandTheme
): LayoutFrames {
  const frames: Frame[] = [];
  let background: { color?: string; image?: string } | undefined;

  switch (slide.layout) {
    case "title":
      frames.push(...generateTitleLayout(slide, theme));
      break;
    case "content":
      frames.push(...generateContentLayout(slide, theme));
      break;
    case "section":
      frames.push(...generateSectionLayout(slide, theme));
      break;
    case "two-column":
      frames.push(...generateTwoColumnLayout(slide, theme));
      break;
    case "comparison":
      frames.push(...generateComparisonLayout(slide, theme));
      break;
    case "quote":
      frames.push(...generateQuoteLayout(slide, theme));
      break;
    case "kpi":
      frames.push(...generateKPILayout(slide, theme));
      break;
    case "chart":
      frames.push(...generateChartLayout(slide, theme));
      break;
    case "table":
      frames.push(...generateTableLayout(slide, theme));
      break;
    case "timeline":
      frames.push(...generateTimelineLayout(slide, theme));
      break;
    case "image-left":
      frames.push(...generateImageLeftLayout(slide, theme));
      break;
    case "image-right":
      frames.push(...generateImageRightLayout(slide, theme));
      break;
    case "full-image":
      const fullImageResult = generateFullImageLayout(slide, theme);
      frames.push(...fullImageResult.frames);
      if (fullImageResult.background) {
        background = fullImageResult.background;
      }
      break;
    default:
      frames.push(...generateContentLayout(slide, theme));
  }

  return {
    layout: slide.layout,
    frames,
    background,
  };
}

function percentToPixels(percent: number, dimension: number): number {
  return (percent / 100) * dimension;
}

function pixelsToPercent(pixels: number, dimension: number): number {
  return (pixels / dimension) * 100;
}

function generateTitleLayout(slide: Slide, theme?: BrandTheme): Frame[] {
  const frames: Frame[] = [];
  const titleBlock = slide.blocks.find((b) => b.type === "title");
  const subtitleBlock = slide.blocks.find((b) => b.type === "paragraph");

  if (titleBlock) {
    frames.push({
      id: titleBlock.id,
      x: 50,
      y: 35,
      width: 80,
      height: 15,
      block: titleBlock,
      zIndex: 1,
    });
  }

  if (subtitleBlock) {
    frames.push({
      id: subtitleBlock.id,
      x: 50,
      y: 55,
      width: 70,
      height: 10,
      block: subtitleBlock,
      zIndex: 1,
    });
  }

  return frames;
}

function generateContentLayout(slide: Slide, theme?: BrandTheme): Frame[] {
  const frames: Frame[] = [];
  const titleBlock = slide.blocks.find((b) => b.type === "title");
  const contentBlocks = slide.blocks.filter(
    (b) => b.type === "bullet" || b.type === "paragraph"
  );

  if (titleBlock) {
    frames.push({
      id: titleBlock.id,
      x: (MARGIN_X / SLIDE_WIDTH) * 100,
      y: (MARGIN_Y / SLIDE_HEIGHT) * 100,
      width: (CONTENT_WIDTH / SLIDE_WIDTH) * 100,
      height: 8,
      block: titleBlock,
    });
  }

  let yOffset = MARGIN_Y + (titleBlock ? 100 : 0);
  contentBlocks.forEach((block, idx) => {
    const contentLines = Array.isArray(block.content) ? block.content.length : 1;
    const blockHeight = Math.min(contentLines * 40, CONTENT_HEIGHT - yOffset);

    frames.push({
      id: block.id,
      x: (MARGIN_X / SLIDE_WIDTH) * 100,
      y: pixelsToPercent(yOffset, SLIDE_HEIGHT),
      width: (CONTENT_WIDTH / SLIDE_WIDTH) * 100,
      height: pixelsToPercent(blockHeight, SLIDE_HEIGHT),
      block,
    });

    yOffset += blockHeight + 20;
  });

  return frames;
}

function generateSectionLayout(slide: Slide, theme?: BrandTheme): Frame[] {
  const frames: Frame[] = [];
  const titleBlock = slide.blocks.find((b) => b.type === "title");

  if (titleBlock) {
    frames.push({
      id: titleBlock.id,
      x: 50,
      y: 45,
      width: 80,
      height: 15,
      block: titleBlock,
    });
  }

  return frames;
}

function generateTwoColumnLayout(slide: Slide, theme?: BrandTheme): Frame[] {
  const frames: Frame[] = [];
  const titleBlock = slide.blocks.find((b) => b.type === "title");
  const contentBlocks = slide.blocks.filter(
    (b) => b.type === "bullet" || b.type === "paragraph"
  );

  if (titleBlock) {
    frames.push({
      id: titleBlock.id,
      x: (MARGIN_X / SLIDE_WIDTH) * 100,
      y: (MARGIN_Y / SLIDE_HEIGHT) * 100,
      width: (CONTENT_WIDTH / SLIDE_WIDTH) * 100,
      height: 8,
      block: titleBlock,
    });
  }

  const columnWidth = (CONTENT_WIDTH / SLIDE_WIDTH) * 100 * 0.45;
  const leftX = (MARGIN_X / SLIDE_WIDTH) * 100;
  const rightX = 55;
  const startY = pixelsToPercent(MARGIN_Y + (titleBlock ? 100 : 0), SLIDE_HEIGHT);

  contentBlocks.forEach((block, idx) => {
    const isLeft = idx % 2 === 0;
    frames.push({
      id: block.id,
      x: isLeft ? leftX : rightX,
      y: startY + (Math.floor(idx / 2) * 20),
      width: columnWidth,
      height: 15,
      block,
    });
  });

  return frames;
}

function generateComparisonLayout(slide: Slide, theme?: BrandTheme): Frame[] {
  const frames: Frame[] = [];
  const titleBlock = slide.blocks.find((b) => b.type === "title");
  const leftBlocks = slide.blocks.filter((b) => b.id.includes("left") || b.id.includes("comparison-left"));
  const rightBlocks = slide.blocks.filter((b) => b.id.includes("right") || b.id.includes("comparison-right"));

  if (titleBlock) {
    frames.push({
      id: titleBlock.id,
      x: 50,
      y: (MARGIN_Y / SLIDE_HEIGHT) * 100,
      width: (CONTENT_WIDTH / SLIDE_WIDTH) * 100,
      height: 8,
      block: titleBlock,
    });
  }

  const columnWidth = 40;
  const leftX = 10;
  const rightX = 50;
  const startY = pixelsToPercent(MARGIN_Y + (titleBlock ? 100 : 0), SLIDE_HEIGHT);

  [...leftBlocks, ...rightBlocks].forEach((block, idx) => {
    const isLeft = leftBlocks.includes(block);
    frames.push({
      id: block.id,
      x: isLeft ? leftX : rightX,
      y: startY + (idx * 12),
      width: columnWidth,
      height: 10,
      block,
    });
  });

  return frames;
}

function generateQuoteLayout(slide: Slide, theme?: BrandTheme): Frame[] {
  const frames: Frame[] = [];
  const quoteBlock = slide.blocks.find((b) => b.type === "quote");
  const authorBlock = slide.blocks.find((b) => b.type === "paragraph");

  if (quoteBlock) {
    frames.push({
      id: quoteBlock.id,
      x: 50,
      y: 40,
      width: 75,
      height: 20,
      block: quoteBlock,
    });
  }

  if (authorBlock) {
    frames.push({
      id: authorBlock.id,
      x: 50,
      y: 65,
      width: 50,
      height: 5,
      block: authorBlock,
    });
  }

  return frames;
}

function generateKPILayout(slide: Slide, theme?: BrandTheme): Frame[] {
  const frames: Frame[] = [];
  const titleBlock = slide.blocks.find((b) => b.type === "title");
  const kpiBlock = slide.blocks.find((b) => b.type === "kpi");

  if (titleBlock) {
    frames.push({
      id: titleBlock.id,
      x: (MARGIN_X / SLIDE_WIDTH) * 100,
      y: (MARGIN_Y / SLIDE_HEIGHT) * 100,
      width: (CONTENT_WIDTH / SLIDE_WIDTH) * 100,
      height: 8,
      block: titleBlock,
    });
  }

  if (kpiBlock && kpiBlock.kpis) {
    const kpiCount = kpiBlock.kpis.length;
    const kpiWidth = 25;
    const spacing = (100 - kpiWidth * kpiCount) / (kpiCount + 1);

    kpiBlock.kpis.forEach((kpi, idx) => {
      frames.push({
        id: `${kpiBlock.id}-kpi-${idx}`,
        x: spacing + idx * (kpiWidth + spacing),
        y: 50,
        width: kpiWidth,
        height: 20,
        block: {
          ...kpiBlock,
          kpis: [kpi], // Single KPI per frame
        },
      });
    });
  }

  return frames;
}

function generateChartLayout(slide: Slide, theme?: BrandTheme): Frame[] {
  const frames: Frame[] = [];
  const titleBlock = slide.blocks.find((b) => b.type === "title");
  const chartBlock = slide.blocks.find((b) => b.type === "chart");

  if (titleBlock) {
    frames.push({
      id: titleBlock.id,
      x: (MARGIN_X / SLIDE_WIDTH) * 100,
      y: (MARGIN_Y / SLIDE_HEIGHT) * 100,
      width: (CONTENT_WIDTH / SLIDE_WIDTH) * 100,
      height: 8,
      block: titleBlock,
    });
  }

  if (chartBlock) {
    frames.push({
      id: chartBlock.id,
      x: 10,
      y: 25,
      width: 80,
      height: 60,
      block: chartBlock,
    });
  }

  return frames;
}

function generateTableLayout(slide: Slide, theme?: BrandTheme): Frame[] {
  const frames: Frame[] = [];
  const titleBlock = slide.blocks.find((b) => b.type === "title");
  const tableBlock = slide.blocks.find((b) => b.type === "table");

  if (titleBlock) {
    frames.push({
      id: titleBlock.id,
      x: (MARGIN_X / SLIDE_WIDTH) * 100,
      y: (MARGIN_Y / SLIDE_HEIGHT) * 100,
      width: (CONTENT_WIDTH / SLIDE_WIDTH) * 100,
      height: 8,
      block: titleBlock,
    });
  }

  if (tableBlock) {
    frames.push({
      id: tableBlock.id,
      x: 10,
      y: 25,
      width: 80,
      height: 60,
      block: tableBlock,
    });
  }

  return frames;
}

function generateTimelineLayout(slide: Slide, theme?: BrandTheme): Frame[] {
  return generateContentLayout(slide, theme);
}

function generateImageLeftLayout(slide: Slide, theme?: BrandTheme): Frame[] {
  const frames: Frame[] = [];
  const titleBlock = slide.blocks.find((b) => b.type === "title");
  const mediaBlock = slide.blocks.find((b) => b.type === "media");
  const contentBlocks = slide.blocks.filter(
    (b) => b.type === "bullet" || b.type === "paragraph"
  );

  if (titleBlock) {
    frames.push({
      id: titleBlock.id,
      x: 55,
      y: (MARGIN_Y / SLIDE_HEIGHT) * 100,
      width: 40,
      height: 8,
      block: titleBlock,
    });
  }

  if (mediaBlock) {
    frames.push({
      id: mediaBlock.id,
      x: 5,
      y: 20,
      width: 45,
      height: 70,
      block: mediaBlock,
    });
  }

  let yOffset = MARGIN_Y + (titleBlock ? 100 : 0);
  contentBlocks.forEach((block, idx) => {
    frames.push({
      id: block.id,
      x: 55,
      y: pixelsToPercent(yOffset, SLIDE_HEIGHT),
      width: 40,
      height: 15,
      block,
    });
    yOffset += 80;
  });

  return frames;
}

function generateImageRightLayout(slide: Slide, theme?: BrandTheme): Frame[] {
  const frames: Frame[] = [];
  const titleBlock = slide.blocks.find((b) => b.type === "title");
  const mediaBlock = slide.blocks.find((b) => b.type === "media");
  const contentBlocks = slide.blocks.filter(
    (b) => b.type === "bullet" || b.type === "paragraph"
  );

  if (titleBlock) {
    frames.push({
      id: titleBlock.id,
      x: (MARGIN_X / SLIDE_WIDTH) * 100,
      y: (MARGIN_Y / SLIDE_HEIGHT) * 100,
      width: 40,
      height: 8,
      block: titleBlock,
    });
  }

  if (mediaBlock) {
    frames.push({
      id: mediaBlock.id,
      x: 55,
      y: 20,
      width: 45,
      height: 70,
      block: mediaBlock,
    });
  }

  let yOffset = MARGIN_Y + (titleBlock ? 100 : 0);
  contentBlocks.forEach((block, idx) => {
    frames.push({
      id: block.id,
      x: (MARGIN_X / SLIDE_WIDTH) * 100,
      y: pixelsToPercent(yOffset, SLIDE_HEIGHT),
      width: 40,
      height: 15,
      block,
    });
    yOffset += 80;
  });

  return frames;
}

function generateFullImageLayout(
  slide: Slide,
  theme?: BrandTheme
): { frames: Frame[]; background?: { image?: string } } {
  const frames: Frame[] = [];
  const mediaBlock = slide.blocks.find((b) => b.type === "media");
  const titleBlock = slide.blocks.find((b) => b.type === "title");
  const contentBlocks = slide.blocks.filter(
    (b) => b.type === "paragraph" || b.type === "quote"
  );

  if (mediaBlock && mediaBlock.media) {
    // Background image
  }

  if (titleBlock) {
    frames.push({
      id: titleBlock.id,
      x: 50,
      y: 35,
      width: 80,
      height: 15,
      block: titleBlock,
      zIndex: 10,
    });
  }

  if (contentBlocks.length > 0) {
    frames.push({
      id: contentBlocks[0].id,
      x: 50,
      y: 55,
      width: 70,
      height: 15,
      block: contentBlocks[0],
      zIndex: 10,
    });
  }

  return {
    frames,
    background: mediaBlock?.media?.url ? { image: mediaBlock.media.url } : undefined,
  };
}

