import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(_: Request, { params }: any) {
  const poll = await prisma.poll.findUnique({
    where: { id: params.id },
    include: { options: true },
  });

  return NextResponse.json(poll);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(_: Request, { params }: any) {
  const updated = await prisma.poll.update({
    where: { id: params.id },
    data: { isClosed: true },
  });

  return NextResponse.json(updated);
}
