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



export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> } // ⬅️ ctx = route context (params, searchParams, etc.)
) {
  /**
   * ⚠️ IMPORTANT NOTE ABOUT ctx.params
   *
   * In Next.js App Router, route handlers (route.ts) receive `params` wrapped
   * inside a Promise. This is different from pages/ and older versions of Next.js.
   *
   * Example:
   *    /api/polls/123/delete
   *
   * You might expect:
   *    ctx.params.id === "123"
   *
   * But actually:
   *    ctx.params is a Promise → so ctx.params.id is undefined.
   *
   * You MUST await it:
   *    const { id } = await ctx.params;
   *
   * Forgetting this causes Prisma to receive `id: undefined`,
   * which triggers the error you saw:
   *       "Route used params.id but params is a Promise"
   */
  const { id } = await ctx.params; // ⬅️ unwrap the Promise to get the actual id
  const pollId = id;

  const body = await req.json();
  const { requesterId } = body;

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
  });

  if (!poll) {
    return new Response("Poll not found", { status: 404 });
  }

  if (poll.createdBy !== requesterId) {
    return new Response("Unauthorized", { status: 403 });
  }

  await prisma.poll.delete({
    where: { id: pollId },
  });

  return Response.json({ success: true });
}


