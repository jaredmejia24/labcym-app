import { router } from '../lib/trpc';
import { examRouter } from './exam/exam.route';
import { patientRouter } from './patient/patient.route';

export const appRouter = router({
  exam: examRouter,
  patient: patientRouter
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
