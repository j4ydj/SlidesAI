// Media block component
import { SlideBlock } from "@/lib/slides/schema";

interface MediaBlockProps {
  block: SlideBlock;
  theme?: any;
}

export const MediaBlock = ({ block, theme }: MediaBlockProps) => {
  if (!block.media) return null;

  const { url, alt, caption, position, mask } = block.media;

  const maskClasses = {
    rounded: "rounded-lg",
    circle: "rounded-full",
    square: "rounded-none",
  };

  const maskClass = mask ? maskClasses[mask] : maskClasses.rounded;

  if (position === "background") {
    return (
      <div className="absolute inset-0">
        <img
          src={url}
          alt={alt || ""}
          className={`w-full h-full object-cover ${maskClass}`}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={url}
        alt={alt || ""}
        className={`w-full h-full object-cover ${maskClass}`}
      />
      {caption && (
        <p className="text-sm text-muted-foreground mt-2 text-center">{caption}</p>
      )}
    </div>
  );
};

