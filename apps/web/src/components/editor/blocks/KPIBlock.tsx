// KPI block component
import { SlideBlock } from "@/lib/slides/schema";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPIBlockProps {
  block: SlideBlock;
  theme?: any;
}

export const KPIBlock = ({ block, theme }: KPIBlockProps) => {
  if (!block.kpis || block.kpis.length === 0) return null;

  const primaryColor = theme?.palette?.primary || "#0066cc";
  const accentColor = theme?.palette?.accent || "#00aaff";

  return (
    <div className="grid grid-cols-3 gap-6">
      {block.kpis.map((kpi, idx) => (
        <div
          key={idx}
          className="p-6 rounded-lg border-2"
          style={{
            borderColor: primaryColor,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <div className="text-4xl font-bold mb-2" style={{ color: primaryColor }}>
            {kpi.value}
          </div>
          <div className="text-sm text-muted-foreground mb-2">{kpi.label}</div>
          {kpi.change && (
            <div className="flex items-center gap-1 text-sm">
              {kpi.change.trend === "up" && (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">+{kpi.change.value}%</span>
                </>
              )}
              {kpi.change.trend === "down" && (
                <>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">{kpi.change.value}%</span>
                </>
              )}
              {kpi.change.trend === "neutral" && (
                <>
                  <Minus className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600">{kpi.change.value}%</span>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

