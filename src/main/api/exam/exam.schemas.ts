import { z } from 'zod';

export const getExamByIdSchema = z.object({
  idExam: z.number().int().min(1)
});
