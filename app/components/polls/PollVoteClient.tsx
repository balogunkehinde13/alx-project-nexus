"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { submitVote, fetchLiveResults } from "@/app/redux/slices/votesSlice";
import { closePoll } from "@/app/redux/slices/pollsSlice";
import { getOrCreateGuestId } from "@/app/lib/utils/guest";
import PollResultsChart from "./PollResultsChart";
import { Poll } from "@/app/interface";

export default function PollVoteClient({ poll }: { poll: Poll }) {
  const dispatch = useAppDispatch();

  // Combined client-only state
  const [clientState, setClientState] = useState({
    hydrated: false,
    userId: null as string | null,
    hasVoted: false,
  });

  // ⬅️ MUST COME BEFORE ANY EFFECTS
  const { hydrated, userId, hasVoted } = clientState;

  // Hydration effect
  useEffect(() => {
    const id = getOrCreateGuestId();
    const voted = localStorage.getItem(`voted_${poll.id}`);

    Promise.resolve().then(() => {
      setClientState({
        hydrated: true,
        userId: id,
        hasVoted: !!voted,
      });
    });
  }, [poll.id]);

  // 🔥 SSE LISTENER (runs only once hydration is ready)
  useEffect(() => {
    if (!hydrated) return;

    const sse = new EventSource(`/api/polls/${poll.id}/stream`);

    sse.onmessage = (event) => {
      if (event.data === "update") {
        dispatch(fetchLiveResults(poll.id));
      }
    };

    return () => sse.close();
  }, [hydrated, poll.id, dispatch]);

  // Live results
  const liveResults =
    useAppSelector((s) => s.votes.liveResults[poll.id]) || poll.options;

  const isCreator = hydrated && userId === poll.createdBy;

  if (!hydrated || !userId) {
    return <div className="p-8">Loading…</div>;
  }

  const handleVote = async (optionId: string) => {
    if (poll.isClosed || hasVoted) return;

    await dispatch(
      submitVote({ pollId: poll.id, optionId, voterId: userId })
    );

    Promise.resolve().then(() => {
      setClientState((prev) => ({ ...prev, hasVoted: true }));
    });

    localStorage.setItem(`voted_${poll.id}`, userId);
  };

  const handleClosePoll = () => {
    dispatch(closePoll(poll.id));
  };

 return (
  <div className="space-y-8">

    {/* STATUS BANNER */}
    {poll.isClosed && (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg font-medium">
        This poll is closed.
      </div>
    )}

    {!poll.isClosed && hasVoted && (
      <div className="p-4 bg-green-100 text-green-700 rounded-lg font-medium">
        You have already voted. see results below results below.
      </div>
    )}

    {/* CLOSE BUTTON (creator only) */}
    {isCreator && !poll.isClosed && (
      <button
        onClick={handleClosePoll}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Close Poll
      </button>
    )}

    {/* VOTING OPTIONS */}
    {!poll.isClosed && !hasVoted && (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Choose an option</h2>

        {poll.options.map((opt) => (
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


    {/* RESULTS CHART */}
    <div className="pt-6">
      <PollResultsChart
        options={liveResults.map((opt) => ({
          name: opt.text,
          value: opt.votes,
        }))}
      />
    </div>
  </div>
);
}
