/*
  Warnings:

  - The primary key for the `qualitative_property_result` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deleted_at` on the `qualitative_property_result` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `qualitative_property_result` table. All the data in the column will be lost.
  - The primary key for the `quantitative_property_result` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deleted_at` on the `quantitative_property_result` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `quantitative_property_result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "qualitative_property_result" DROP CONSTRAINT "qualitative_property_result_pkey",
DROP COLUMN "deleted_at",
DROP COLUMN "id",
ADD CONSTRAINT "qualitative_property_result_pkey" PRIMARY KEY ("qualitative_property_id", "exam_result_id");

-- AlterTable
ALTER TABLE "quantitative_property_result" DROP CONSTRAINT "quantitative_property_result_pkey",
DROP COLUMN "deleted_at",
DROP COLUMN "id",
ADD CONSTRAINT "quantitative_property_result_pkey" PRIMARY KEY ("quantitative_property_id", "exam_result_id");
