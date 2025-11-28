import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const polls = await prisma.poll.findMany({
    include: { options: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(polls, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store',
    }
  });
}

export async function POST(req: Request) {
  const data = await req.json();

  const poll = await prisma.poll.create({
    data: {
      title: data.title,
      description: data.description,
      createdBy: data.createdBy,
      creatorName: data.creatorName,
      options: {
        create: data.options.map((text: string) => ({
          text,
        })),
      },
    },
    include: { options: true },
  });

  return NextResponse.json(poll);
}
