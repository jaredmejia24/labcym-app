import { publicProcedure, router } from './../../lib/trpc';
import { createResultSchema, getExamResultsPaginationSchema } from './result.schemas';
import { createResult, getExamResultsPagination } from './result.service';

export const resultRouter = router({
  create: publicProcedure.input(createResultSchema).mutation(async (opts) => {
    return createResult(opts.input);
  }),

  getExamResultsPagination: publicProcedure.input(getExamResultsPaginationSchema).query((opts) => {
    return getExamResultsPagination(opts.input);
  })
});

export type ResultRouter = typeof resultRouter;
