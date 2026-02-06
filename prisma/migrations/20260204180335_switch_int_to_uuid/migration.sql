-- DropForeignKey
ALTER TABLE "KeyResult" DROP CONSTRAINT "KeyResult_objective_id_fkey";

-- AddForeignKey
ALTER TABLE "KeyResult" ADD CONSTRAINT "KeyResult_objective_id_fkey" FOREIGN KEY ("objective_id") REFERENCES "Objective"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE EXTENSION IF NOT EXISTS citext;
