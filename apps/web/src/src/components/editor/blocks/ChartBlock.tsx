// Chart block component
import { SlideBlock } from "@/lib/slides/schema";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartBlockProps {
  block: SlideBlock;
  theme?: any;
}

export const ChartBlock = ({ block, theme }: ChartBlockProps) => {
  if (!block.chart) return null;

  const { type, labels, datasets, title } = block.chart;
  const primaryColor = theme?.palette?.primary || "#0066cc";
  const accentColor = theme?.palette?.accent || "#00aaff";

  // Transform data for recharts
  const chartData = labels.map((label, idx) => {
    const dataPoint: any = { name: label };
    datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[idx];
    });
    return dataPoint;
  });

  const colors = [primaryColor, accentColor, "#ff6b6b", "#4ecdc4", "#ffe66d"];

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {datasets.map((dataset, idx) => (
                <Bar
                  key={dataset.label}
                  dataKey={dataset.label}
                  fill={dataset.color || colors[idx % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {datasets.map((dataset, idx) => (
                <Line
                  key={dataset.label}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={dataset.color || colors[idx % colors.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey={datasets[0]?.label || "value"}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {datasets.map((dataset, idx) => (
                <Area
                  key={dataset.label}
                  type="monotone"
                  dataKey={dataset.label}
                  stackId="1"
                  stroke={dataset.color || colors[idx % colors.length]}
                  fill={dataset.color || colors[idx % colors.length]}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: primaryColor }}>
          {title}
        </h3>
      )}
      <div className="w-full" style={{ height: "400px" }}>
        {renderChart()}
      </div>
    </div>
  );
};

