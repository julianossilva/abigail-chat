/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Message";

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "fromId" UUID NOT NULL,
    "toId" UUID NOT NULL,
    "date" TIMESTAMP NOT NULL,
    "content" VARCHAR(255) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "messages_id_key" ON "messages"("id");
