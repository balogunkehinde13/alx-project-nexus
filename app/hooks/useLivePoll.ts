"use client";

import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { fetchLiveResults } from "../redux/slices/votesSlice";

export function useLivePoll(pollId: string) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const url = `/api/polls/${pollId}/stream`;
    const es = new EventSource(url);

    es.onmessage = (event) => {
      if (event.data === "update") {
        dispatch(fetchLiveResults(pollId));
      }
    };

    return () => es.close();
  }, [pollId, dispatch]);
}
