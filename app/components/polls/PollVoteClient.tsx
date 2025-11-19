"use client";

import { useState, useEffect } from "react";
import { Poll, Option } from "@/app/interface";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { submitVote } from "@/app/redux/slices/votesSlice";
import { getOrCreateGuestId } from "@/app/lib/utils/guest";
import PollResultsChart from "./PollResultsChart";

export default function PollVoteClient({ poll }: { poll: Poll }) {
  const dispatch = useAppDispatch();
  const liveResults = useAppSelector(
    (state) => state.votes.liveResults[poll.id]
  );

  // Hydration flag: ensures we don't render client-only state changes
  // that would mismatch the server HTML.
  const [isHydrated, setIsHydrated] = useState(false);

  // Keep your localStorage initializer (runs only on client)
  const [hasVoted, setHasVoted] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(`voted_${poll.id}`);
    }
    return false;
  });

  useEffect(() => {
  Promise.resolve().then(() => setIsHydrated(true));
}, []);

  const handleVote = async (optionId: string) => {
    if (poll.isClosed || hasVoted) return;

    const guestId = getOrCreateGuestId();
    localStorage.setItem(`voted_${poll.id}`, guestId);

    // dispatch vote
    await dispatch(submitVote({ pollId: poll.id, optionId }));
    setHasVoted(true);
  };

  const results = liveResults || poll.options;

  // Render a stable placeholder until hydration completes to avoid mismatch.
  if (!isHydrated) {
    return (
      <div className="text-center text-gray-400 py-10">
        Loading poll…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{poll.title}</h1>
        {poll.description && (
          <p className="text-gray-600 mt-2">{poll.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Created by {poll.creatorName}
        </p>
      </div>

      {/* Voting Options */}
      {!poll.isClosed && !hasVoted && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Choose an option</h2>
          {poll.options.map((opt: Option) => (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              className="block w-full text-left border rounded-lg p-4 hover:bg-gray-100 transition"
            >
              {opt.text}
            </button>
          ))}
        </div>
      )}

      {/* Vote Confirmation */}
      {hasVoted && (
        <p className="text-green-600 font-medium">
          You have voted! See live results below.
        </p>
      )}

      {/* Chart */}
      <div className="mt-10">
        <PollResultsChart
          options={results.map((opt) => ({
            name: opt.text,
            value: opt.votes,
          }))}
        />
      </div>

      {/* Closed Poll */}
      {poll.isClosed && (
        <p className="text-red-600 font-medium mt-4">This poll is closed.</p>
      )}
    </div>
  );
}
