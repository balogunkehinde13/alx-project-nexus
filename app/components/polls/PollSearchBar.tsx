"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setFilteredPolls } from "@/app/redux/slices/pollsSlice";

export default function PollSearchBar() {
  const dispatch = useAppDispatch();
  // guard against undefined store slice
  const pollsFromStore = useAppSelector((s) => (s?.polls ? s.polls.polls : []));
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const polls = Array.isArray(pollsFromStore) ? pollsFromStore : [];

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "open" | "closed">("all");

  const filtered = useMemo(() => {
    // operate on a local copy so we never mutate store data
    let result = polls;

    // text search
    if (query.trim()) {
      const lower = query.toLowerCase();
      result = result.filter(
        (p) =>
          String(p.title ?? "").toLowerCase().includes(lower) ||
          String(p.creatorName ?? "").toLowerCase().includes(lower)
      );
    }

    // status filter
    if (status === "open") {
      result = result.filter((p) => !p.isClosed);
    } else if (status === "closed") {
      result = result.filter((p) => !!p.isClosed);
    }

    return result;
  }, [polls, query, status]);

  // Sync filtered list into Redux (only when filters change)
  useEffect(() => {
    if (!Array.isArray(filtered)) return;
    dispatch(setFilteredPolls(filtered));
  }, [filtered, dispatch]);

  return (
    <div className="space-y-4 gap-10 md:mx-16 flex flex-col md:flex-row md:items-center md:justify-between">
      {/* Search Field */}
      <input
        type="text"
        placeholder="Search polls by title or creator…"
        className="w-full p-5 shadow-md bg-white rounded-lg"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Status Filter */}
      <div className="flex gap-3 self-start bg-white p-3 rounded-lg shadow-md">
        <button
          className={`px-4 py-2 rounded-lg ${
            status === "all" ? "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-white" : "bg-gray-200"
          }`}
          onClick={() => setStatus("all")}
        >
          All
        </button>

        <button
          className={`px-4 py-2 rounded-lg ${
            status === "open" ? "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-white" : "bg-gray-200"
          }`}
          onClick={() => setStatus("open")}
        >
          Open
        </button>

        <button
          className={`px-4 py-2 rounded-lg ${
            status === "closed" ? "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-white" : "bg-gray-200"
          }`}
          onClick={() => setStatus("closed")}
        >
          Closed
        </button>
      </div>
    </div>
  );
}
