/*
  Warnings:

  - A unique constraint covering the columns `[pollId,sessionId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Vote_pollOptionId_key";

-- DropIndex
DROP INDEX "Vote_pollOptionId_sessionId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Vote_pollId_sessionId_key" ON "Vote"("pollId", "sessionId");
