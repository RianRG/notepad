/*
  Warnings:

  - You are about to drop the `Friend` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusTypes" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_studentId_fkey";

-- AlterTable
ALTER TABLE "FriendRequest" ADD COLUMN     "status" "StatusTypes" NOT NULL;

-- DropTable
DROP TABLE "Friend";
