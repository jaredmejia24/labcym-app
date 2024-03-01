import { publicProcedure, router } from './../../lib/trpc';
import { createResultSchema } from './result.schemas';
import { createResult } from './result.service';

export const resultRouter = router({
  create: publicProcedure.input(createResultSchema).mutation(async (opts) => {
    return createResult(opts.input);
  })
});

export type ResultRouter = typeof resultRouter;
