import { publicProcedure, router } from './../../lib/trpc';
import { createResultSchema, getResultByIdOrLastSchema } from './result.schemas';
import { createResult, getResultByIdOrLast } from './result.service';

export const resultRouter = router({
  create: publicProcedure.input(createResultSchema).mutation(async (opts) => {
    return createResult(opts.input);
  }),
  getById: publicProcedure.input(getResultByIdOrLastSchema).query((opts) => {
    return getResultByIdOrLast(opts.input.resultId);
  })
});

export type ResultRouter = typeof resultRouter;
