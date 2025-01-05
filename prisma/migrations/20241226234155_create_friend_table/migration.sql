/*
  Warnings:

  - You are about to drop the `_Friendship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Friendship" DROP CONSTRAINT "_Friendship_A_fkey";

-- DropForeignKey
ALTER TABLE "_Friendship" DROP CONSTRAINT "_Friendship_B_fkey";

-- DropTable
DROP TABLE "_Friendship";

-- CreateTable
CREATE TABLE "Friend" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friend_studentId_key" ON "Friend"("studentId");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
