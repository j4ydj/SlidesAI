// Table block component
import { SlideBlock } from "@/lib/slides/schema";

interface TableBlockProps {
  block: SlideBlock;
  theme?: any;
}

export const TableBlock = ({ block, theme }: TableBlockProps) => {
  if (!block.table) return null;

  const { headers, rows, title } = block.table;
  const primaryColor = theme?.palette?.primary || "#0066cc";
  const borderColor = theme?.palette?.border || "#e5e5e5";

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: primaryColor }}>
          {title}
        </h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: primaryColor, color: "white" }}>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left font-semibold border"
                  style={{ borderColor }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={rowIdx % 2 === 0 ? "bg-white" : "bg-muted/30"}
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="px-4 py-3 border"
                    style={{ borderColor }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

