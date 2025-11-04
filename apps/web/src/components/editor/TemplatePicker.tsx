// Template picker component for selecting slide templates
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SLIDE_TEMPLATES } from "@/lib/slides/templates";
import { Layout } from "lucide-react";

interface TemplatePickerProps {
  onTemplateSelected: (templateId: string) => void;
}

export const TemplatePicker = ({ onTemplateSelected }: TemplatePickerProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Layout className="w-5 h-5" />
        <h3 className="font-semibold">Slide Templates</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {SLIDE_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className="p-3 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => onTemplateSelected(template.id)}
          >
            <p className="font-medium text-sm">{template.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {template.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

