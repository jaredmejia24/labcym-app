import { z } from 'zod';

// todo recieve this type and add to the db
// `quantitative-${number}` | `qualitative-${number}`
const typeQualitativeSchema = z.object({
  type: z.literal('qualitative'),
  propertyOptionId: z.number().int().min(1)
});

const typeQuantitativeSchema = z.object({
  type: z.literal('quantitative'),
  value: z.number().int().min(1)
});

export const createPropertyResultSchema = z.union([typeQualitativeSchema, typeQuantitativeSchema]);
