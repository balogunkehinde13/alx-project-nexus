import Link from "next/link";
import Card from "../ui/Card";
import { Poll } from "@/app/interface";
import CopyLinkButton from "../ui/CopyLinkButton";

export default function PollCard({ poll }: { poll: Poll }) {
  return (
    <Link href={`/poll/${poll.id}`}>
      <Card>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{poll.title}</h3>
          <CopyLinkButton pollId={poll.id} />

          <p className="text-gray-600 text-sm line-clamp-2">
            {poll.description || "No description provided."}
          </p>
          <p className="text-xs text-gray-500">
            {poll.options.length} options · {poll.isClosed ? "Closed" : "Open"}
          </p>
          <p className="text-xs text-gray-500">
            Created by {poll.creatorName}
          </p>
        </div>
      </Card>
    </Link>
  );
}
