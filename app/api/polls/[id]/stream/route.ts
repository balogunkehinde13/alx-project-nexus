import prisma from "@/app/lib/prisma";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  let lastCount = 0;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode("data: connected\n\n"));

      const interval = setInterval(async () => {
        const poll = await prisma.poll.findUnique({
          where: { id },
          include: { options: true },
        });

        if (!poll) return;

        const totalVotes = poll.options.reduce(
          (sum, opt) => sum + opt.votes,
          0
        );

        if (totalVotes !== lastCount) {
          lastCount = totalVotes;
          controller.enqueue(encoder.encode("data: update\n\n"));
        }
      }, 1000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    },
  });
}
