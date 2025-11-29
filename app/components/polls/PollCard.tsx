import Link from "next/link";
import Card from "../ui/Card";
import { Poll } from "@/app/interface";
import CopyLinkButton from "../ui/CopyLinkButton";

export default function PollCard({ poll }: { poll: Poll }) {
  return (
    <Link href={`/poll/${poll.id}`} className="block">
      <Card className="p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:-translate-y-0.5 bg-white">
        <div className="space-y-3">

          {/* Title Row */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg md:text-2xl font-bold text-slate-900 leading-tight">
              {poll.title}
            </h3>
            <CopyLinkButton pollId={poll.id} />
          </div>

          {/* Description */}
          <p className="text-slate-600 font-medium line-clamp-2">
           <span className="italic">Description: </span> 
           {poll.description || "No description provided."}
          </p>

          {/* Status + Meta */}
          <div className="flex items-center justify-between text-slate-500 pt-1">
            <span>
              {poll.options.length} options ·{" "}
              <span
                className={
                  poll.isClosed
                    ? "text-red-600 "
                    : "text-green-600 "
                }
              >
                {poll.isClosed ? "Closed" : "Open"}
              </span>
            </span>

            <span>By {poll.creatorName}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
