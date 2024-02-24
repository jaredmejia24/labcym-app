-- CreateTable
CREATE TABLE "exam" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_division" (
    "id" SERIAL NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "exam_division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qualitative_property" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "exam_division_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "qualitative_property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quantitative_property" (
    "id" SERIAL NOT NULL,
    "exam_division_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "unity" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "quantitative_property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_reference_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "value_reference_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_reference_types_quantitative_properties" (
    "value_reference_type_id" INTEGER NOT NULL,
    "quantitative_property_id" INTEGER NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "value_reference_types_quantitative_properties_pkey" PRIMARY KEY ("value_reference_type_id","quantitative_property_id")
);

-- CreateTable
CREATE TABLE "exam_result" (
    "id" SERIAL NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "note" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "exam_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quantitative_property_result" (
    "id" SERIAL NOT NULL,
    "quantitative_property_id" INTEGER NOT NULL,
    "exam_result_id" INTEGER NOT NULL,
    "result" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "quantitative_property_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qualitative_property_result" (
    "id" SERIAL NOT NULL,
    "qualitative_property_id" INTEGER NOT NULL,
    "exam_result_id" INTEGER NOT NULL,
    "result" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "qualitative_property_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exam_division" ADD CONSTRAINT "exam_division_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualitative_property" ADD CONSTRAINT "qualitative_property_exam_division_id_fkey" FOREIGN KEY ("exam_division_id") REFERENCES "exam_division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quantitative_property" ADD CONSTRAINT "quantitative_property_exam_division_id_fkey" FOREIGN KEY ("exam_division_id") REFERENCES "exam_division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_reference_types_quantitative_properties" ADD CONSTRAINT "value_reference_types_quantitative_properties_value_refere_fkey" FOREIGN KEY ("value_reference_type_id") REFERENCES "value_reference_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_reference_types_quantitative_properties" ADD CONSTRAINT "value_reference_types_quantitative_properties_quantitative_fkey" FOREIGN KEY ("quantitative_property_id") REFERENCES "quantitative_property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_result" ADD CONSTRAINT "exam_result_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_result" ADD CONSTRAINT "exam_result_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quantitative_property_result" ADD CONSTRAINT "quantitative_property_result_quantitative_property_id_fkey" FOREIGN KEY ("quantitative_property_id") REFERENCES "quantitative_property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quantitative_property_result" ADD CONSTRAINT "quantitative_property_result_exam_result_id_fkey" FOREIGN KEY ("exam_result_id") REFERENCES "exam_result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualitative_property_result" ADD CONSTRAINT "qualitative_property_result_qualitative_property_id_fkey" FOREIGN KEY ("qualitative_property_id") REFERENCES "qualitative_property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualitative_property_result" ADD CONSTRAINT "qualitative_property_result_exam_result_id_fkey" FOREIGN KEY ("exam_result_id") REFERENCES "exam_result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
