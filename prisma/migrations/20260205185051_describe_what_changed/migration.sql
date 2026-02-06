/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `KeyResult` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "KeyResult" ALTER COLUMN "description" SET DATA TYPE CITEXT;

-- CreateIndex
CREATE UNIQUE INDEX "KeyResult_description_key" ON "KeyResult"("description");
