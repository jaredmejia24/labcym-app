import { publicProcedure, router } from './../../lib/trpc';
import { getExamsService } from './exam.service';

export const examRouter = router({
  getExams: publicProcedure.query(async () => {
    const exams = await getExamsService();

    return exams;
  })
});

export type ExamRouter = typeof examRouter;
