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

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-center text-gray-600 font-medium text-sm sm:text-base">
          No votes yet
        </p>
        <p className="text-center text-gray-500 text-xs sm:text-sm mt-1">
          Be the first to vote!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Chart container with responsive height */}
      <div className="w-full" style={{ height: "280px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={options}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              innerRadius="45%"
              paddingAngle={2}
              isAnimationActive={true}
              animationDuration={800}
            >
              {options.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value} votes`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                padding: "8px 12px",
                fontSize: "14px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend below chart */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-4 sm:mt-6 px-2">
        {options.map((option, index) => {
          const percent = ((option.value / total) * 100).toFixed(1);
          return (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg text-xs sm:text-sm"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                {option.name}
              </span>
              <span className="text-gray-600">
                {percent}% ({option.value})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}