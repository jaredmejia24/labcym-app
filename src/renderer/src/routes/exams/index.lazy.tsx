import { Button } from '@renderer/@/components/ui/button';
import trpcReact from '@renderer/lib/trpc';
import { Link, createLazyFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

export const Route = createLazyFileRoute('/exams/')({
  component: ConfigExams
});

function ConfigExams() {
  return (
    <section className="flex-grow p-8">
      <h1 className="text-3xl">Configuracion</h1>
      <ConfigExamContent />
    </section>
  );
}

function ConfigExamContent() {
  const { data, isLoading } = trpcReact.exam.getExams.useQuery();

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
          params={{ examId: exam.id.toString() }}
        >
          <Button className="text-base">{exam.name}</Button>
        </Link>
      ))}
    </div>
  );
}
