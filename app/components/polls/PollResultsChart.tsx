"use client";

import dynamic from "next/dynamic";

const PollResultsChart = dynamic(() => import("./PollResultsChart.client"), {
  ssr: false,
  loading: () => (
    <div className="text-center text-gray-400 py-10">Loading chart…</div>
  ),
});

export default PollResultsChart;
