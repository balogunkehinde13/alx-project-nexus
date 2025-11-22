import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  // Close poll
  const poll = await prisma.poll.update({
    where: { id },
    data: { isClosed: true },
    include: { options: true },
  });

  return NextResponse.json({ success: true, poll });
}
