import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prismaService } from "../../../lib/prisma/prisma.service";

export async function createPoll(app: FastifyInstance) {
  app.post("/polls", async (request: FastifyRequest, reply: FastifyReply) => {
    const requestSafe = z.object({
      title: z.string(),
      pollOptions: z.array(z.string()),
    });

    const { title, pollOptions } = requestSafe.parse(request.body);

    const poll = await prismaService.poll.create({
      data: {
        title,
        pollOptions: {
          createMany: {
            data: pollOptions.map((option) => ({ title: option })),
          },
        },
      },
    });

    return reply.status(201).send({
      pollId: poll.id,
    });
  });
}
