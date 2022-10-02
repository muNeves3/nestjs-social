/*
  Warnings:

  - You are about to drop the column `follower` on the `follower` table. All the data in the column will be lost.
  - Added the required column `followerId` to the `follower` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "follower" DROP COLUMN "follower",
ADD COLUMN     "followerId" INTEGER NOT NULL;
