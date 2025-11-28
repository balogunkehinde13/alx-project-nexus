"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/app/redux/hooks";
import { setPolls, setFilteredPolls } from "@/app/redux/slices/pollsSlice";
import { Poll } from "@/app/interface";

export default function PollsHydrator({ polls }: { polls: Poll[] }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPolls(polls));
    dispatch(setFilteredPolls(polls));
  }, [polls, dispatch]);

  return null;
}
