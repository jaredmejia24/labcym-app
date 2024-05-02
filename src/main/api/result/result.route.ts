import { publicProcedure, router } from './../../lib/trpc';
import { createResultSchema, getExamResultsPaginationSchema } from './result.schemas';
import { createResult, getExamResultsPagination } from './result.service';

export const resultRouter = router({
  create: publicProcedure.input(createResultSchema).mutation(async (opts) => {
    return createResult(opts.input);
  }),

  getExamResultsPagination: publicProcedure
    .input(getExamResultsPaginationSchema)
    .query(async (opts) => {
      const something = await getExamResultsPagination(opts.input);
      return JSON.stringify(something);
    })
});

export type ResultRouter = typeof resultRouter;
