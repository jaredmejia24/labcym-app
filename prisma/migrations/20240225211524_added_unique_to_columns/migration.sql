/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `exam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `exam_division` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number]` on the table `invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `property_option` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `qualitative_property` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `quantitative_property` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `value_reference_type` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "exam_name_key" ON "exam"("name");

-- CreateIndex
CREATE INDEX "exam_name_idx" ON "exam"("name");

-- CreateIndex
CREATE UNIQUE INDEX "exam_division_name_key" ON "exam_division"("name");

-- CreateIndex
CREATE INDEX "exam_division_name_idx" ON "exam_division"("name");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_number_key" ON "invoice"("number");

-- CreateIndex
CREATE INDEX "invoice_number_idx" ON "invoice"("number");

-- CreateIndex
CREATE UNIQUE INDEX "property_option_name_key" ON "property_option"("name");

-- CreateIndex
CREATE INDEX "property_option_name_idx" ON "property_option"("name");

-- CreateIndex
CREATE UNIQUE INDEX "qualitative_property_name_key" ON "qualitative_property"("name");

-- CreateIndex
CREATE INDEX "qualitative_property_name_idx" ON "qualitative_property"("name");

-- CreateIndex
CREATE UNIQUE INDEX "quantitative_property_name_key" ON "quantitative_property"("name");

-- CreateIndex
CREATE INDEX "quantitative_property_name_idx" ON "quantitative_property"("name");

-- CreateIndex
CREATE UNIQUE INDEX "value_reference_type_name_key" ON "value_reference_type"("name");

-- CreateIndex
CREATE INDEX "value_reference_type_name_idx" ON "value_reference_type"("name");
