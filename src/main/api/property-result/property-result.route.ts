import { publicProcedure, router } from './../../lib/trpc';
import { updateOrCreatePropertyResultSchema } from './property-result.schemas';
import { updateOrCreateResultProperty } from './property-result.service';

export const examRouter = router({
  updateOrCreateResultProperty: publicProcedure
    .input(updateOrCreatePropertyResultSchema)
    .mutation(async (opts) => {
      return await updateOrCreateResultProperty(opts.input);
    })
});

export type ExamRouter = typeof examRouter;
