import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prismaService } from "../../lib/prisma/prisma.service";
import z from "zod";

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:pollId", async (request, reply) => {
    const requestSafe = z.object({
      pollId: z.string().uuid(),
    });
    const { pollId } = requestSafe.parse(request.params);
    const poll = await prismaService.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        pollOptions: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return reply.send({ poll });
  });
}
