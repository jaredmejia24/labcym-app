import { z } from 'zod';

// todo recieve this type and add to the db
// `quantitative-${number}` | `qualitative-${number}`
const propertyResultSchema = z.object({
  examResultId: z.number().int().min(1)
});

const typeQualitativeSchema = propertyResultSchema.extend({
  type: z.literal('qualitative'),
  propertyOptionId: z.number().int().min(1).optional(),
  result: z.string().optional().default(''),
  qualitativePropertyId: z.number().int().min(1)
});

const typeQuantitativeSchema = propertyResultSchema.extend({
  type: z.literal('quantitative'),
  value: z.number().int().min(1),
  quantitativePropertyId: z.number().int().min(1)
});

export const updateOrCreatePropertyResultSchema = z.union([
  typeQualitativeSchema,
  typeQuantitativeSchema
]);
