-- CreateTable
CREATE TABLE "sessions" (
    "id" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL,
    "expiration" TIMESTAMP NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);
