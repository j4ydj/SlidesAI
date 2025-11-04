// Bullet block component
import { SlideBlock } from "@/lib/slides/schema";

interface BulletBlockProps {
  block: SlideBlock;
  theme?: any;
}

export const BulletBlock = ({ block, theme }: BulletBlockProps) => {
  const items = Array.isArray(block.content) ? block.content : [block.content || ""];
  const fontSize = block.style?.fontSize || 18;
  const color = block.style?.color || theme?.palette?.foreground || "hsl(var(--foreground))";
  const accentColor = theme?.palette?.accent || "hsl(var(--accent))";

  return (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-4">
          <span
            className="text-2xl font-bold"
            style={{ color: accentColor }}
          >
            •
          </span>
          <span
            style={{
              fontSize: `${fontSize}px`,
              color,
            }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
};

