import { PatientExam } from '@renderer/@/components/patient/components/patient-exam';
import { PropertyExam } from '@renderer/@/components/properties/exam-properties';
import { Button } from '@renderer/@/components/ui/button';
import trpcReact from '@renderer/lib/trpc';
import { Link, createFileRoute } from '@tanstack/react-router';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { searchItemExamSchema } from '.';
import { Pagination } from '@renderer/@/components/pagination/components/pagination';

export const Route = createFileRoute('/exams/$examId')({
  component: ItemExam,
  validateSearch: (search) => {
    return searchItemExamSchema.parse(search);
  }
});

function ItemExam() {
  const { examId } = Route.useParams();
  const { idResult, page } = Route.useSearch();

  const { data, error } = trpcReact.result.getExamResultsPagination.useQuery(
    {
      examId: Number(examId),
      resultId: idResult,
      page
    },
    {
      retry: (failureCount, error) => {
        if (error.message === 'Resultado no encontrado') {
          return false;
        }

        return failureCount <= 3;
      }
    }
  );

  return (
    <div className="mt-2 flex flex-grow flex-col gap-4 p-8">
      <Link to="/">
        <Button className="size-12 rounded-full p-1">
          <ChevronLeft className="text-white" />
        </Button>
      </Link>
      {error?.message === 'Resultado no encontrado' ? (
        <div className="grid flex-grow place-items-center">No hay Resultados</div>
      ) : (
        <>
          <LoaderContainer examId={Number(examId)} />
          <PaginationContainer count={data?.count || 0} />
        </>
      )}
    </div>
  );
}

function LoaderContainer({ examId }: { examId: number }) {
  const { idResult, page } = Route.useSearch();

  const { data: examsData, isLoading: examsIsLoading } = trpcReact.exam.getExamById.useQuery({
    idExam: Number(examId)
  });

  const { data, isLoading } = trpcReact.result.getExamResultsPagination.useQuery({
    examId: Number(examId),
    resultId: idResult,
    page
  });

  console.log(data);

  if (isLoading || !data || !examsData || examsIsLoading) {
    return (
      <div className="grid flex-grow place-items-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PatientExam patient={data.examResult.result.patient} />
      <PropertyExam exams={examsData} />
    </>
  );
}

type PaginationContainerProps = {
  count?: number;
};
function PaginationContainer({ count = 0 }: PaginationContainerProps) {
  const { page } = Route.useSearch();

  let activePage: number;
  if (!page) {
    activePage = count;
  } else {
    activePage = page;
  }

  return <Pagination activePage={activePage} totalPages={count} />;
}
