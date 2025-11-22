import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const pollId = id;

  const body = await req.json();
  const { optionId, voterId } = body;

  if (!optionId || !voterId) {
    return NextResponse.json(
      { error: "Missing optionId or voterId" },
      { status: 400 }
    );
  }

  // Validate poll exists
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: true },
  });

  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  // Validate option belongs to poll
  const option = poll.options.find((o) => o.id === optionId);
  if (!option) {
    return NextResponse.json({ error: "Invalid optionId" }, { status: 400 });
  }

  // Record the vote
  await prisma.vote.create({
    data: {
      pollId,
      optionId,
      voterId, // must be a REAL STRING
    },
  });

  // Increase vote count
  await prisma.option.update({
    where: { id: optionId },
    data: { votes: { increment: 1 } },
  });

  return NextResponse.json({ success: true });
}
