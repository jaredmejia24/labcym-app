import { z } from 'zod';

export const getAllPatientsSchema = z.object({
  search: z.string().min(1).default('').optional()
});
