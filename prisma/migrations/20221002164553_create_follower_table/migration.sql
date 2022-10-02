-- CreateTable
CREATE TABLE "follower" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "follower" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follower_pkey" PRIMARY KEY ("id")
);
