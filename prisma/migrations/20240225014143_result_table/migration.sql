/*
  Warnings:

  - You are about to drop the column `invoice_id` on the `exam_result` table. All the data in the column will be lost.
  - You are about to drop the column `patient_id` on the `exam_result` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "exam_result" DROP CONSTRAINT "exam_result_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_result" DROP CONSTRAINT "exam_result_patient_id_fkey";

-- AlterTable
ALTER TABLE "exam_result" DROP COLUMN "invoice_id",
DROP COLUMN "patient_id",
ALTER COLUMN "note" DROP NOT NULL;

-- CreateTable
CREATE TABLE "result" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "result_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
