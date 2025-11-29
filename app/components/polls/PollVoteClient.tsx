"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { submitVote, fetchLiveResults } from "@/app/redux/slices/votesSlice";
import { closePoll, deletePoll } from "@/app/redux/slices/pollsSlice";
import { getOrCreateGuestId } from "@/app/lib/utils/guest";
import PollResultsChart from "./PollResultsChart";
import { Poll } from "@/app/interface";
import { useRouter } from "next/navigation";

export default function PollVoteClient({ poll }: { poll: Poll }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

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
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const handleVote = async (optionId: string) => {
    if (poll.isClosed || hasVoted) return;

    await dispatch(submitVote({ pollId: poll.id, optionId, voterId: userId }));

    Promise.resolve().then(() => {
      setClientState((prev) => ({ ...prev, hasVoted: true }));
    });

    localStorage.setItem(`voted_${poll.id}`, userId);
  };

  // DELETE POLL HANDLER
  const handleDeletePoll = async () => {
    await dispatch(deletePoll({ pollId: poll.id, requesterId: userId }));
    router.push("/");
    router.refresh(); // ⭐ Force server re-fetch
  };

  return (
    <div className="md:max-w-3xl md:mx-auto py-4 sm:py-8 px-4 sm:px-6 space-y-4 sm:space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {poll.title}
            </h1>
            {poll.description && (
              <p className="text-sm sm:text-base text-gray-600">
                {poll.description}
              </p>
            )}
          </div>
          
          {/* Live indicator */}
          {!poll.isClosed && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </div>
          )}
        </div>

        {/* Creator info */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Created by <span className="font-medium text-gray-700">{poll.creatorName || "Anonymous"}</span>
        </div>
      </div>

      {/* STATUS BANNERS */}
      {poll.isClosed && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 sm:p-5 flex items-start gap-3">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 f-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-red-800 font-semibold text-sm sm:text-base">Poll Closed</p>
            <p className="text-red-700 text-xs sm:text-sm mt-0.5">This poll is no longer accepting votes.</p>
          </div>
        </div>
      )}

      {!poll.isClosed && hasVoted && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4 sm:p-5 flex items-start gap-3">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 f-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-green-800 font-semibold text-sm sm:text-base">Vote Recorded</p>
            <p className="text-green-700 text-xs sm:text-sm mt-0.5">You have already voted. See results below.</p>
          </div>
        </div>
      )}

      {/* CREATOR ACTIONS */}
      {isCreator && (
        <div className="bg-indigo-50 rounded-xl sm:rounded-2xl border border-indigo-100 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="text-sm font-semibold text-indigo-900 uppercase tracking-wide">
              Poll Management
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {!poll.isClosed && (
              <button
                onClick={() => setShowCloseModal(true)}
                className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Close Poll
              </button>
            )}
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Poll
            </button>
          </div>
        </div>
      )}

      {/* VOTING OPTIONS */}
      {!poll.isClosed && !hasVoted && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Choose your answer
          </h2>

          <div className="space-y-2 sm:space-y-3">
            {poll.options.map((opt, index) => (
              <button
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                className="group w-full text-left border-2 border-gray-200 rounded-xl p-4 sm:p-5 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3 sm:gap-4"
              >
                <div className="f-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base shadow-sm group-hover:shadow-md transition-shadow">
                  {index + 1}
                </div>
                <span className="text-sm sm:text-base text-gray-900 font-medium group-hover:text-indigo-900">
                  {opt.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS CHART */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Live Results
          </h2>
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {liveResults.reduce((sum, opt) => sum + opt.votes, 0)} votes
          </span>
        </div>
        
        <PollResultsChart
          options={liveResults.map((opt) => ({
            name: opt.text,
            value: opt.votes,
          }))}
        />
      </div>

      {/* CLOSE POLL CONFIRMATION MODAL */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center f-0">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Close Poll?</h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Closing this poll will prevent additional votes. You can still delete it later if you want.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
              <button
                onClick={() => setShowCloseModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  const result = await dispatch(closePoll(poll.id));

                  // Only redirect if successful
                  if (result.meta.requestStatus === "fulfilled") {
                    setShowCloseModal(false);
                    router.push("/");
                    router.refresh(); // ⭐ Force server re-fetch
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition font-medium shadow-lg hover:shadow-xl"
              >
                Close Poll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Delete Poll?</h2>
                <p className="text-sm sm:text-base text-gray-600">
                  This action cannot be undone. Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-gray-900">&apos;{poll.title}&apos;</span>?
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleDeletePoll}
                className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium shadow-lg hover:shadow-xl"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}