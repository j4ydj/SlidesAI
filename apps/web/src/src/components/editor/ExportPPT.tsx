import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Slide } from "@/lib/slides/schema";
import { exportSlidesToPPTX } from "@/lib/ppt/export";

type ExportPPTProps = {
  slides: Slide[];
  presentationTitle: string;
  brandSettings?: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    logo_url: string | null;
    heading_font?: string;
    body_font?: string;
    font_family?: string;
  };
};

export const ExportPPT = ({ slides, presentationTitle, brandSettings }: ExportPPTProps) => {
  const handleExport = async () => {
    try {
      await exportSlidesToPPTX(slides, presentationTitle, brandSettings);
      toast.success("Presentation exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export presentation");
    }
  };

  return (
    <Button onClick={handleExport} variant="outline">
      <Download className="w-4 h-4 mr-2" />
      Export PPT
    </Button>
  );
};
