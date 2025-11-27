"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setFilteredPolls } from "@/app/redux/slices/pollsSlice";
import { Poll } from "@/app/interface";

export default function PollSearchBar() {
  const dispatch = useAppDispatch();

  // We pull polls directly from Redux
  const polls = useAppSelector((s) => s.polls.polls);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    let result: Poll[] = polls;

    // Text search
    if (query.trim() !== "") {
      const lower = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.creatorName.toLowerCase().includes(lower)
      );
    }

    // Status filter
    if (status === "open") {
      result = result.filter((p) => !p.isClosed);
    } else if (status === "closed") {
      result = result.filter((p) => p.isClosed);
    }

    dispatch(setFilteredPolls(result));
  }, [polls, query, status, dispatch]);

  return (
    <div className="space-y-4">
      {/* Search Field */}
      <input
        type="text"
        placeholder="filter polls by title or creator…"
        className="w-full p-3 border rounded-lg"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Status Filter */}
      <div className="flex gap-3">
        <button
          className={`px-4 py-2 rounded-lg ${
            status === "all" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setStatus("all")}
        >
          All
        </button>

        <button
          className={`px-4 py-2 rounded-lg ${
            status === "open" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setStatus("open")}
        >
          Open
        </button>

        <button
          className={`px-4 py-2 rounded-lg ${
            status === "closed" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setStatus("closed")}
        >
          Closed
        </button>
      </div>
    </div>
  );
}
