/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Friend_username_key" ON "Friend"("username");
