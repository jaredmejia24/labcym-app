/*
  Warnings:

  - A unique constraint covering the columns `[identification]` on the table `patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birth_date` to the `patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identification` to the `patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patient" ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "identification" VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "patient_identification_key" ON "patient"("identification");

-- CreateIndex
CREATE INDEX "patient_identification_idx" ON "patient"("identification");
