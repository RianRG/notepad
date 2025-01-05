/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_sessionId_key" ON "Student"("sessionId");
