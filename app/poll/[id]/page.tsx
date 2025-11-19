import prisma from "@/app/lib/prisma";
import PollVoteClient from "@/app/components/polls/PollVoteClient";

export default async function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const poll = await prisma.poll.findUnique({
    where: { id },
    include: { options: true },
  });

  if (!poll) {
    return <div className="p-8">Poll not found</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <PollVoteClient poll={poll} />
    </div>
  );
}
