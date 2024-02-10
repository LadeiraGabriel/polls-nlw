import { FastifyInstance } from "fastify";
import z from "zod";
import { prismaService } from "../../../lib/prisma/prisma.service";
import { randomUUID } from "crypto";
import { Redis } from "ioredis";
import { redis } from "../../../lib/redis/redis";
import { voting } from "../../../utils/voting-pub-sub";
export async function voteOnPoll(app: FastifyInstance) {
  app.post("/polls/:pollId/vote", async (req, reply) => {
    const requestSafeParam = z.object({
      pollId: z.string().uuid(),
    });

    const requestSafeBody = z.object({
      pollOptionId: z.string().uuid(),
    });

    const { pollId } = requestSafeParam.parse(req.params);
    const { pollOptionId } = requestSafeBody.parse(req.body);
    let { sessionId } = req.cookies;
    if (sessionId) {
      const voteAlreadyExist = await prismaService.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      });
      if (voteAlreadyExist) {
        if (voteAlreadyExist.pollOptionId !== pollOptionId) {
          redis.zincrby(pollId, -1, voteAlreadyExist.pollOptionId);
          await prismaService.vote.delete({
            where: {
              id: voteAlreadyExist.id,
            },
          });
        } else {
          return reply
            .status(400)
            .send("There is already a vote from you with this option");
        }
      }
    }

    if (!sessionId) {
      sessionId = randomUUID();
      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        signed: true,
      });
    }
    redis.zincrby(pollId, 1, pollOptionId);
    await prismaService.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    });

    voting.publish(pollId, {
      pollOptionId,
      votes: 1,
    });
    return reply.status(201).send();
  });
}
