import { Button } from '@renderer/@/components/ui/button';
import trpcReact from '@renderer/lib/trpc';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Index
});

function Index() {
  const { data, isLoading } = trpcReact.exam.getExams.useQuery();

  if (isLoading) {
    return (
      <div className="grid flex-grow place-items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <section className="grid flex-grow grid-cols-3 items-center gap-6 px-8">
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
      <Link className="inline-grid" to="/results">
        <Button>Crear Resultado</Button>
      </Link>
    </section>
  );
}
