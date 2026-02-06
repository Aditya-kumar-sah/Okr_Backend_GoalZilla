/*
  Warnings:

  - The primary key for the `KeyResult` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Objective` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "KeyResult" DROP CONSTRAINT "KeyResult_objective_id_fkey";

-- AlterTable
ALTER TABLE "KeyResult" DROP CONSTRAINT "KeyResult_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "objective_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "KeyResult_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "KeyResult_id_seq";

-- AlterTable
ALTER TABLE "Objective" DROP CONSTRAINT "Objective_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Objective_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Objective_id_seq";

-- AddForeignKey
ALTER TABLE "KeyResult" ADD CONSTRAINT "KeyResult_objective_id_fkey" FOREIGN KEY ("objective_id") REFERENCES "Objective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
