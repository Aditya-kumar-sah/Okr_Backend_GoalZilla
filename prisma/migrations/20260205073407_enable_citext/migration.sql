/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Objective` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Objective" ALTER COLUMN "title" SET DATA TYPE CITEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Objective_title_key" ON "Objective"("title");
