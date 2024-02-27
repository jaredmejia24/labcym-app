import { publicProcedure, router } from './../../lib/trpc';
import { getExamByIdSchema } from './exam.schemas';
import { getAllExams, getExamById } from './exam.service';

export const examRouter = router({
  getExams: publicProcedure.query(async () => {
    const exams = await getAllExams();

    return exams;
  }),
  getExamById: publicProcedure.input(getExamByIdSchema).query(async (queries) => {
    const exam = await getExamById(queries.input);

    return exam;
  })
});

export type ExamRouter = typeof examRouter;
