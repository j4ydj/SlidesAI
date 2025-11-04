// Comprehensive PPTX export using layout engine
import PptxGenJS from "pptxgenjs";
import { Slide } from "../slides/schema";
import { generateLayoutFrames } from "../slides/layoutEngine";
import { normalizeLegacySlide } from "../slides/normalize";
import { setupPptxTheme, getTextStyle } from "./theme";
import { frameToPptxPosition } from "./layouts";
import { createBrandTheme } from "../theme/theme";
import { hexToPptxColor } from "../theme/palette";

type BrandSettings = {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string | null;
  heading_font?: string;
  body_font?: string;
  font_family?: string;
};

export async function exportSlidesToPPTX(
  slides: Slide[],
  presentationTitle: string,
  brandSettings?: BrandSettings
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.author = "SlidesAI";
  pptx.title = presentationTitle;

  // Create theme from brand settings
  const theme = brandSettings
    ? createBrandTheme(
        brandSettings.primary_color,
        brandSettings.secondary_color,
        brandSettings.accent_color,
        brandSettings.heading_font || brandSettings.font_family || "Inter",
        brandSettings.body_font || brandSettings.font_family || "Inter",
        brandSettings.logo_url
      )
    : undefined;

  // Setup theme and masters
  const pptxTheme = setupPptxTheme(pptx, theme);

  // Process each slide
  for (const rawSlide of slides) {
    // Normalize slide if needed
    const slide = normalizeLegacySlide(rawSlide);
    
    // Generate layout frames
    const layoutFrames = generateLayoutFrames(slide, theme);
    
    // Create slide
    const pptSlide = pptx.addSlide();

    // Set background
    if (layoutFrames.background?.image) {
      try {
        pptSlide.background = { data: layoutFrames.background.image };
      } catch {
        pptSlide.background = { color: "FFFFFF" };
      }
    } else if (layoutFrames.background?.color) {
      pptSlide.background = { color: hexToPptxColor(layoutFrames.background.color) };
    }

    // Render each frame
    for (const frame of layoutFrames.frames) {
      const pos = frameToPptxPosition(frame);
      const block = frame.block;

      switch (block.type) {
        case "title":
          const titleContent = typeof block.content === "string" ? block.content : block.content?.[0] || "";
          pptSlide.addText(titleContent, {
            ...pos,
            ...getTextStyle(block, theme, { fontSize: 36, bold: true }),
          });
          break;

        case "paragraph":
          const paraContent = typeof block.content === "string" ? block.content : block.content?.join(" ") || "";
          pptSlide.addText(paraContent, {
            ...pos,
            ...getTextStyle(block, theme, { fontSize: 18 }),
          });
          break;

        case "bullet":
          const bulletItems = Array.isArray(block.content) ? block.content : [block.content || ""];
          const bulletTexts = bulletItems.map((item) => ({
            text: item,
            options: {
              bullet: true,
              ...getTextStyle(block, theme, { fontSize: 18 }),
            },
          }));
          pptSlide.addText(bulletTexts, {
            ...pos,
          });
          break;

        case "quote":
          const quoteContent = typeof block.content === "string" ? block.content : block.content?.join(" ") || "";
          pptSlide.addText(`"${quoteContent}"`, {
            ...pos,
            ...getTextStyle(block, theme, { fontSize: 28, bold: true }),
          });
          break;

        case "media":
          if (block.media?.url) {
            try {
              if (block.media.position === "background") {
                // Already handled above
              } else {
                pptSlide.addImage({
                  data: block.media.url,
                  ...pos,
                });
              }
              if (block.media.caption) {
                pptSlide.addText(block.media.caption, {
                  x: pos.x,
                  y: pos.y + pos.h + 0.1,
                  w: pos.w,
                  h: 0.3,
                  fontSize: 12,
                  color: "666666",
                });
              }
            } catch (error) {
              console.error("Failed to add image:", error);
            }
          }
          break;

        case "chart":
          if (block.chart) {
            try {
              const chartData = block.chart.labels.map((label, idx) => {
                const dataPoint: any = { name: label };
                block.chart!.datasets.forEach((dataset) => {
                  dataPoint[dataset.label] = dataset.data[idx];
                });
                return dataPoint;
              });

              pptSlide.addChart(pptx.ChartType.bar, chartData, {
                ...pos,
                chartArea: { fill: { color: "F5F5F5" } },
                title: block.chart.title || "",
              });
            } catch (error) {
              console.error("Failed to add chart:", error);
              // Fallback to text representation
              pptSlide.addText(
                `Chart: ${block.chart.title || "Data Visualization"}`,
                {
                  ...pos,
                  ...getTextStyle(block, theme),
                }
              );
            }
          }
          break;

        case "table":
          if (block.table) {
            try {
              const tableRows = [
                    block.table.headers.map((h) => ({ text: h, options: { bold: true } })),
                    ...block.table.rows.map((row) =>
                      row.map((cell) => ({ text: String(cell) }))
                    ),
                  ];

              pptSlide.addTable(tableRows, {
                ...pos,
                border: { type: "solid", color: "CCCCCC" },
                fill: { color: "FFFFFF" },
                color: "000000",
              });
            } catch (error) {
              console.error("Failed to add table:", error);
            }
          }
          break;

        case "kpi":
          if (block.kpis && block.kpis.length > 0) {
            // Create a grid layout for KPIs
            const kpiCount = block.kpis.length;
            const kpiWidth = pos.w / kpiCount;
            const spacing = 0.2;

            block.kpis.forEach((kpi, idx) => {
              const kpiX = pos.x + idx * (kpiWidth + spacing);
              const kpiPos = {
                x: kpiX,
                y: pos.y,
                w: kpiWidth,
                h: pos.h,
              };

              // KPI value
              pptSlide.addText(String(kpi.value), {
                ...kpiPos,
                y: kpiPos.y,
                h: kpiPos.h * 0.4,
                fontSize: 32,
                bold: true,
                color: pptxTheme.colors.primary,
              });

              // KPI label
              pptSlide.addText(kpi.label, {
                ...kpiPos,
                y: kpiPos.y + kpiPos.h * 0.4,
                h: kpiPos.h * 0.3,
                fontSize: 14,
                color: "666666",
              });

              // Change indicator
              if (kpi.change) {
                const changeText =
                  kpi.change.trend === "up"
                    ? `+${kpi.change.value}%`
                    : kpi.change.trend === "down"
                    ? `${kpi.change.value}%`
                    : `${kpi.change.value}%`;
                const changeColor =
                  kpi.change.trend === "up"
                    ? "00AA00"
                    : kpi.change.trend === "down"
                    ? "AA0000"
                    : "666666";

                pptSlide.addText(changeText, {
                  ...kpiPos,
                  y: kpiPos.y + kpiPos.h * 0.7,
                  h: kpiPos.h * 0.3,
                  fontSize: 12,
                  color: changeColor,
                });
              }
            });
          }
          break;
      }
    }

    // Add logo if available
    if (brandSettings?.logo_url) {
      try {
        pptSlide.addImage({
          data: brandSettings.logo_url,
          x: 8.5,
          y: 5.0,
          w: 1,
          h: 0.5,
        });
      } catch {
        console.log("Could not add logo to slide");
      }
    }

    // Add speaker notes
    if (slide.notes) {
      pptSlide.addNotes(slide.notes);
    }
  }

  // Save the presentation
  await pptx.writeFile({ fileName: `${presentationTitle}.pptx` });
}

