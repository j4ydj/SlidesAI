// Quote block component
import { SlideBlock } from "@/lib/slides/schema";

interface QuoteBlockProps {
  block: SlideBlock;
  theme?: any;
}

export const QuoteBlock = ({ block, theme }: QuoteBlockProps) => {
  const content = typeof block.content === "string" ? block.content : block.content?.join(" ") || "";
  const fontSize = block.style?.fontSize || 32;
  const color = block.style?.color || theme?.palette?.primary || "hsl(var(--primary))";
  const alignment = block.style?.alignment || "center";

  return (
    <blockquote
      className="border-l-4 pl-6 py-4"
      style={{
        fontSize: `${fontSize}px`,
        color,
        textAlign: alignment as any,
        fontWeight: "bold",
        borderColor: theme?.palette?.accent || "hsl(var(--accent))",
      }}
    >
      "{content}"
    </blockquote>
  );
};

