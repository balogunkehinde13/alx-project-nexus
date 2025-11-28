"use client";

import PollCard from "./PollCard";
import { useAppSelector } from "@/app/redux/hooks";

export default function PollList() {
  const filtered = useAppSelector((s) => s.polls.filtered);

  if (!filtered || filtered.length === 0) {
    return (
      <p className="text-gray-500 text-center py-6">
        No polls found.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {filtered.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
