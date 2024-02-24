/*
  Warnings:

  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `invoice_id` to the `exam_result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "exam_result" DROP CONSTRAINT "exam_result_patient_id_fkey";

-- AlterTable
ALTER TABLE "exam_result" ADD COLUMN     "invoice_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "qualitative_property_result" ADD COLUMN     "property_option_id" INTEGER;

-- DropTable
DROP TABLE "Patient";

-- CreateTable
CREATE TABLE "patient" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_option" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "property_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qualitative_property_option" (
    "propertyOptionId" INTEGER NOT NULL,
    "qualitativePropertyId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qualitative_property_option_pkey" PRIMARY KEY ("propertyOptionId","qualitativePropertyId")
);

-- AddForeignKey
ALTER TABLE "exam_result" ADD CONSTRAINT "exam_result_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_result" ADD CONSTRAINT "exam_result_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualitative_property_result" ADD CONSTRAINT "qualitative_property_result_property_option_id_fkey" FOREIGN KEY ("property_option_id") REFERENCES "property_option"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualitative_property_option" ADD CONSTRAINT "qualitative_property_option_propertyOptionId_fkey" FOREIGN KEY ("propertyOptionId") REFERENCES "property_option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualitative_property_option" ADD CONSTRAINT "qualitative_property_option_qualitativePropertyId_fkey" FOREIGN KEY ("qualitativePropertyId") REFERENCES "qualitative_property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
