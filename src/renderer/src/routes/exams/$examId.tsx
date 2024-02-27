import trpcReact, { RouterOutputs } from '@renderer/lib/trpc';
import { createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/exams/$examId')({
  component: ItemExam
});

function ItemExam() {
  const { examId } = Route.useParams();

  return (
    <div className="flex flex-grow p-8">
      <ItemExamContainer examId={Number(examId)} />
    </div>
  );
}

function ItemExamContainer(props: { examId: number }) {
  const { data, isLoading } = trpcReact.exam.getExamById.useQuery({ idExam: props.examId });

  if (isLoading) {
    return (
      <div className="mt-8 grid flex-grow place-items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  console.log(data);
  return (
    <div>
      <h1 className="text-3xl">{data?.name}</h1>
      <div className="mt-6 grid grid-cols-3">
        {data?.examDivision.map((examDivision) => (
          <section className="text-xl" key={examDivision.id}>
            <h2>{examDivision.name}</h2>
            <PropertySection division={examDivision} />
          </section>
        ))}
      </div>
    </div>
  );
}

type Division = RouterOutputs['exam']['getExamById']['examDivision'][number];

function PropertySection(props: { division: Division }) {
  const { division } = props;

  return (
    <>
      {/* {division.quantitativeProperty.map((property) => (
      
      ))} */}
    </>
  );
}
