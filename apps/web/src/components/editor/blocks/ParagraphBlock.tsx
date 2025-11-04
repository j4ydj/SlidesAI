// Paragraph block component
import { SlideBlock } from "@/lib/slides/schema";

interface ParagraphBlockProps {
  block: SlideBlock;
  theme?: any;
}

export const ParagraphBlock = ({ block, theme }: ParagraphBlockProps) => {
  const content = typeof block.content === "string" ? block.content : block.content?.join(" ") || "";
  const fontSize = block.style?.fontSize || 18;
  const color = block.style?.color || theme?.palette?.foreground || "hsl(var(--foreground))";
  const alignment = block.style?.alignment || "left";

  return (
    <p
      style={{
        fontSize: `${fontSize}px`,
        color,
        textAlign: alignment as any,
      }}
    >
      {content}
    </p>
  );
};

