import PollCard from "./PollCard";
import { Poll } from "@/app/interface";

export default function PollList({ polls }: { polls: Poll[] }) {
  return (
    <div className="grid gap-4">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
