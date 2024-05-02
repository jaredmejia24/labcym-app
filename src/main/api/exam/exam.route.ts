import { publicProcedure, router } from './../../lib/trpc';
import { getAllExams } from './exam.service';

export const examRouter = router({
  getExams: publicProcedure.query(async () => {
    const exams = await getAllExams();

    return exams;
  })
});

export type ExamRouter = typeof examRouter;
