import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: Request, { params }: any) {
  const { optionId } = await req.json();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updatedOption = await prisma.option.update({
    where: { id: optionId },
    data: { votes: { increment: 1 } },
  });

  const poll = await prisma.poll.findUnique({
    where: { id: params.id },
    include: { options: true },
  });

  return NextResponse.json({
    pollId: params.id,
    results: poll?.options || [],
  });
}
