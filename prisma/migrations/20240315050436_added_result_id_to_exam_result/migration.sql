/*
  Warnings:

  - Added the required column `result_id` to the `exam_result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exam_result" ADD COLUMN     "result_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "exam_result" ADD CONSTRAINT "exam_result_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
