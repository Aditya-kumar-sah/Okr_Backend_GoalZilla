-- AlterTable
ALTER TABLE "KeyResult" ADD COLUMN     "metric" TEXT NOT NULL DEFAULT 'Percentage',
ADD COLUMN     "target_progress" INTEGER NOT NULL DEFAULT 100;
