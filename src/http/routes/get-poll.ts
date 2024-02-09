import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prismaService } from "../../lib/prisma/prisma.service";
import z, { record } from "zod";
import { redis } from "../../lib/redis/redis";

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
    const result = await redis.zrange(
      "7690c458-6c2e-43a4-9c0a-ad191641140d",
      0,
      -1,
      "WITHSCORES"
    );

    const options = result.reduce((obj, line, index) => {
      if (index % 2 === 0) {
        obj = {
          ...obj,
          [line]: +result[index + 1],
        };
      }

      return obj;
    }, {} as Record<string, number>);

    return reply.send({
      id: poll?.id,
      title: poll?.title,
      pollOptions: poll?.pollOptions.map((element) => {
        return {
          id: element.id,
          title: element.title,
          score: options[element.id] ?? 0,
        };
      }),
    });
  });
}
