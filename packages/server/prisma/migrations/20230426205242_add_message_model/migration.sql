-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "fromId" UUID NOT NULL,
    "toId" UUID NOT NULL,
    "date" TIMESTAMP NOT NULL,
    "content" VARCHAR(255) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");
