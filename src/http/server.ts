import fastify from "fastify";
import { createPoll } from "./routes/poll/create-poll";
import { getPoll } from "./routes/poll/get-poll";
import cookie from "@fastify/cookie";
import { voteOnPoll } from "./routes/poll/vote-on-poll";
const app = fastify();
app.register(cookie, {
  secret: "my-secret", // for cookies signature
  hook: "onRequest", // options for parsing cookies
});
app.register(getPoll);
app.register(createPoll);
app.register(voteOnPoll);
app.listen({ port: 3333 }).then(() => {
  console.log("server running!");
});
