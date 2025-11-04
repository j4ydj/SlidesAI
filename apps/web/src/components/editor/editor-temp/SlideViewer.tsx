import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Slide } from "@/lib/slides/schema";
import { generateLayoutFrames } from "@/lib/slides/layoutEngine";
import { BlockRenderer } from "./blocks/BlockRenderer";
import { createBrandTheme } from "@/lib/theme/theme";
import { normalizeLegacySlide } from "@/lib/slides/normalize";

type SlideViewerProps = {
  slides: Slide[];
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  brandSettings?: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    logo_url: string | null;
    heading_font?: string;
    body_font?: string;
    font_family?: string;
    theme?: any;
  };
};

export const SlideViewer = ({
  slides,
  currentSlideIndex,
  onSlideChange,
  brandSettings,
}: SlideViewerProps) => {
  if (slides.length === 0) {
    return (
      <div className="flex-1 flex flex-col p-6">
        <Card className="flex-1 flex items-center justify-center bg-muted/30">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">No slides yet</p>
            <p className="text-sm mt-2">Use the AI assistant to generate slides</p>
          </div>
        </Card>
      </div>
    );
  }

  // Normalize current slide if needed
  const currentSlide = normalizeLegacySlide(slides[currentSlideIndex]);
  
  // Create theme from brand settings
  const theme = brandSettings?.theme || (brandSettings
    ? createBrandTheme(
        brandSettings.primary_color,
        brandSettings.secondary_color,
        brandSettings.accent_color,
        brandSettings.heading_font || brandSettings.font_family || "Inter",
        brandSettings.body_font || brandSettings.font_family || "Inter",
        brandSettings.logo_url
      )
    : undefined);

  // Generate layout frames
  const layoutFrames = generateLayoutFrames(currentSlide, theme);

  return (
    <div className="flex-1 flex flex-col p-6">
      <Card className="flex-1 bg-gradient-to-br from-background via-background to-muted/20 shadow-xl relative overflow-hidden">
        {/* Background image for full-image layout */}
        {layoutFrames.background?.image && (
          <div className="absolute inset-0">
            <img
              src={layoutFrames.background.image}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        )}

        {/* Render blocks using layout frames */}
        <div className="relative h-full" style={{ aspectRatio: "16/9" }}>
          {layoutFrames.frames.map((frame) => {
            const left = `${frame.x}%`;
            const top = `${frame.y}%`;
            const width = `${frame.width}%`;
            const height = `${frame.height}%`;

            return (
              <div
                key={frame.id}
                className="absolute"
                style={{
                  left,
                  top,
                  width,
                  height,
                  zIndex: frame.zIndex || 1,
                }}
              >
                <BlockRenderer block={frame.block} theme={theme} />
              </div>
            );
          })}

          {/* Logo overlay */}
          {brandSettings?.logo_url && (
            <img
              src={brandSettings.logo_url}
              alt="Logo"
              className="absolute bottom-8 right-8 h-12 object-contain opacity-50"
            />
          )}
        </div>

        {/* Speaker notes */}
        {currentSlide.notes && (
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/70 backdrop-blur-sm rounded-lg">
            <p className="text-xs text-white/80">
              <span className="font-semibold">Notes: </span>
              {currentSlide.notes}
            </p>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-center gap-4 mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onSlideChange(Math.max(0, currentSlideIndex - 1))}
          disabled={currentSlideIndex === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentSlideIndex + 1} / {slides.length}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            onSlideChange(Math.min(slides.length - 1, currentSlideIndex + 1))
          }
          disabled={currentSlideIndex === slides.length - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
