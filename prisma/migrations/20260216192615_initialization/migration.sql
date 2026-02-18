/*
  Warnings:

  - You are about to drop the column `objective_id` on the `KeyResult` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `KeyResult` table. All the data in the column will be lost.
  - You are about to drop the column `target_progress` on the `KeyResult` table. All the data in the column will be lost.
  - Added the required column `currentProgress` to the `KeyResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectiveId` to the `KeyResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "KeyResult" DROP CONSTRAINT "KeyResult_objective_id_fkey";

-- AlterTable
ALTER TABLE "KeyResult" DROP COLUMN "objective_id",
DROP COLUMN "progress",
DROP COLUMN "target_progress",
ADD COLUMN     "currentProgress" INTEGER NOT NULL,
ADD COLUMN     "objectiveId" TEXT NOT NULL,
ADD COLUMN     "targetProgress" INTEGER NOT NULL DEFAULT 100;

-- AddForeignKey
ALTER TABLE "KeyResult" ADD CONSTRAINT "KeyResult_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE CASCADE ON UPDATE CASCADE;
