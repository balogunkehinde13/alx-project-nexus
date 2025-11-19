"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4F46E5", "#F59E0B", "#10B981", "#EF4444", "#6366F1", "#8B5CF6"];

export default function PollResultsChartClient({
  options,
}: {
  options: { name: string; value: number }[];
}) {

  const total = options.reduce((sum, o) => sum + o.value, 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLabel = (entry: any) => {
    if (total === 0) return ""; 
    const percent = ((entry.value / total) * 100).toFixed(0);
    return `${entry.name}: ${percent}%`;
  };

  if (total === 0) {
    return (
      <div className="text-center text-gray-500 mt-6">
        No votes yet. Be the first to vote!
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={options}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={130}
            innerRadius={60}
            paddingAngle={2}
            label={renderLabel}
            isAnimationActive={true}
            animationDuration={800}
          >
            {options.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} votes`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
