/*
  Warnings:

  - You are about to drop the `_ProblemToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProblemToUser" DROP CONSTRAINT "_ProblemToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProblemToUser" DROP CONSTRAINT "_ProblemToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'Add your description',
ADD COLUMN     "image" TEXT NOT NULL DEFAULT 'https://image.com';

-- DropTable
DROP TABLE "_ProblemToUser";

-- CreateTable
CREATE TABLE "Topics" (
    "id" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "Topics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Topics" ADD CONSTRAINT "Topics_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
