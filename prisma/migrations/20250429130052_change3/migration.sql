/*
  Warnings:

  - You are about to drop the column `topics` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `problemId` on the `Topics` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Topics" DROP CONSTRAINT "Topics_problemId_fkey";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "topics";

-- AlterTable
ALTER TABLE "Topics" DROP COLUMN "problemId";

-- CreateTable
CREATE TABLE "_ProblemToTopics" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProblemToTopics_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProblemToTopics_B_index" ON "_ProblemToTopics"("B");

-- AddForeignKey
ALTER TABLE "_ProblemToTopics" ADD CONSTRAINT "_ProblemToTopics_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemToTopics" ADD CONSTRAINT "_ProblemToTopics_B_fkey" FOREIGN KEY ("B") REFERENCES "Topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
