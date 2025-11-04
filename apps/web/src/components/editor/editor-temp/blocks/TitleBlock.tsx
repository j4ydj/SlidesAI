// Title block component
import { SlideBlock } from "@/lib/slides/schema";

interface TitleBlockProps {
  block: SlideBlock;
  theme?: any;
}

export const TitleBlock = ({ block, theme }: TitleBlockProps) => {
  const content = typeof block.content === "string" ? block.content : block.content?.[0] || "";
  const fontSize = block.style?.fontSize || 36;
  const color = block.style?.color || theme?.palette?.primary || "hsl(var(--primary))";
  const alignment = block.style?.alignment || "left";
  const fontWeight = block.style?.fontWeight === "bold" ? "bold" : "normal";

  return (
    <h1
      className="font-bold"
      style={{
        fontSize: `${fontSize}px`,
        color,
        textAlign: alignment as any,
        fontWeight,
      }}
    >
      {content}
    </h1>
  );
};

