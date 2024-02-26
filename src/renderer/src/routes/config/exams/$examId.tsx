import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/config/exams/$examId')({
  component: ItemExam
});

function ItemExam() {
  const { examId } = Route.useParams();
  return (
    <section className="flex-grow p-8">
      <h1>exam id {examId}</h1>
    </section>
  );
}
