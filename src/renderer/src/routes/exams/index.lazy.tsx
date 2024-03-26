import { Button } from '@renderer/@/components/ui/button';
import trpcReact from '@renderer/lib/trpc';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

export const searchItemExamSchema = z.object({
  idResult: z.number().int().min(1).optional(),
  page: z.number().int().min(1).optional().catch(1)
});

export const Route = createFileRoute('/exams/')({
  component: ConfigExams,
  validateSearch: (search) => {
    return searchItemExamSchema.parse(search);
  }
});

function ConfigExams() {
  return (
    <section className="flex-grow p-8">
      <h1 className="text-3xl">Examenes</h1>
      <ConfigExamContent />
    </section>
  );
}

function ConfigExamContent() {
  const { data, isLoading } = trpcReact.exam.getExams.useQuery();

  const { idResult } = Route.useSearch();

  if (isLoading) {
    return (
      <div className="mt-8 grid  place-items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
      {data?.map((exam) => (
        <Link
          key={exam.id}
          className="inline-grid"
          to="/exams/$examId"
          search={{
            idResult: idResult
          }}
          params={{ examId: exam.id.toString() }}
        >
          <Button className="text-base">{exam.name}</Button>
        </Link>
      ))}
    </div>
  );
}
