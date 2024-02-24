import { router } from '../lib/trpc';
import { examRouter } from './exam/exam.route';

export const appRouter = router({
  exam: examRouter
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
