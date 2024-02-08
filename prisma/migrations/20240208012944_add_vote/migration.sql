-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "pollOptionId" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_pollOptionId_key" ON "Vote"("pollOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_pollOptionId_sessionId_key" ON "Vote"("pollOptionId", "sessionId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollOptionId_fkey" FOREIGN KEY ("pollOptionId") REFERENCES "PollOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;