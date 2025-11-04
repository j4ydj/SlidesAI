import { Slide, SlideBlock } from "./schema";

/**
 * Normalize legacy slide format (title/content) to new structured format
 */
export function normalizeLegacySlide(legacySlide: any): Slide {
  // If already in new format, return as-is
  if (legacySlide.blocks && Array.isArray(legacySlide.blocks)) {
    return {
      id: legacySlide.id || `slide-${Date.now()}-${Math.random()}`,
      title: legacySlide.title || "",
      layout: legacySlide.layout || "content",
      blocks: legacySlide.blocks,
      notes: legacySlide.notes,
      imageUrl: legacySlide.imageUrl,
      imagePrompt: legacySlide.imagePrompt,
    };
  }

  // Convert legacy format
  const blocks: SlideBlock[] = [];
  
  // Title block
  if (legacySlide.title) {
    blocks.push({
      id: "title-1",
      type: "title",
      content: legacySlide.title,
      style: {
        fontSize: legacySlide.layout === "title" ? 60 : 36,
        fontWeight: "bold",
        alignment: legacySlide.layout === "title" ? "center" : "left",
      },
    });
  }

  // Content blocks
  if (legacySlide.content && Array.isArray(legacySlide.content)) {
    if (legacySlide.layout === "title") {
      // Subtitle for title slides
      blocks.push({
        id: "subtitle-1",
        type: "paragraph",
        content: legacySlide.content.join(" • "),
        style: {
          fontSize: 24,
          alignment: "center",
        },
      });
    } else {
      // Bullet points for content slides
      blocks.push({
        id: "bullets-1",
        type: "bullet",
        content: legacySlide.content,
        style: {
          fontSize: 18,
        },
      });
    }
  }

  // Media block if image exists
  if (legacySlide.imageUrl) {
    const mediaPosition = 
      legacySlide.layout === "image-left" ? "left" :
      legacySlide.layout === "image-right" ? "right" :
      legacySlide.layout === "full-image" ? "background" :
      "center";

    blocks.push({
      id: "media-1",
      type: "media",
      media: {
        type: "image",
        url: legacySlide.imageUrl,
        position: mediaPosition as any,
      },
    });
  }

  return {
    id: legacySlide.id || `slide-${Date.now()}-${Math.random()}`,
    title: legacySlide.title || "",
    layout: legacySlide.layout || "content",
    blocks,
    notes: legacySlide.notes,
    imageUrl: legacySlide.imageUrl, // Keep for backward compatibility
    imagePrompt: legacySlide.imagePrompt,
    content: legacySlide.content, // Keep for backward compatibility
  };
}

/**
 * Normalize array of slides (legacy or new format)
 */
export function normalizeSlides(slides: any[]): Slide[] {
  return slides.map(normalizeLegacySlide);
}

