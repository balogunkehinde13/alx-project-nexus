import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;  // ← FIXED
  const pollId = id;

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: true },
  });

  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  return NextResponse.json(poll);
}
