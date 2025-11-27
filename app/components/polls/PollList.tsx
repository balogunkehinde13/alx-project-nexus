"use client";

import PollCard from "./PollCard";
import { useAppSelector } from "@/app/redux/hooks";

export default function PollList() {
  const filtered = useAppSelector((s) => s.polls.filtered);

  return (
    <div className="grid gap-4">
      {filtered.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
