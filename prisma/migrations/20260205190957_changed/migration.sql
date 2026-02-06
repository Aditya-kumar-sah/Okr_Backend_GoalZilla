-- DropIndex
DROP INDEX "KeyResult_description_key";

-- AlterTable
ALTER TABLE "KeyResult" ALTER COLUMN "description" SET DATA TYPE TEXT;
