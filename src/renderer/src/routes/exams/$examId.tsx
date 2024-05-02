import { getExamResultsPagination } from '@main/api/result/result.service';
import { Pagination } from '@renderer/@/components/pagination/components/pagination';
import { PatientExam } from '@renderer/@/components/patient/components/patient-exam';
import { PropertyExam } from '@renderer/@/components/properties/exam-properties';
import { GoBack } from '@renderer/@/components/ui/go-back';
import trpcReact from '@renderer/lib/trpc';
import { createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { searchItemExamSchema } from '.';

export const Route = createFileRoute('/exams/$examId')({
  component: ItemExam,
  validateSearch: (search) => {
    return searchItemExamSchema.parse(search);
  }
});

export type DataResult = Awaited<ReturnType<typeof getExamResultsPagination>> | null;

function ItemExam() {
  const { examId } = Route.useParams();
  const { page } = Route.useSearch();
  const [totalPages, setTotalPages] = useState(0);

  const {
    error,
    data: unformattedData,
    isLoading
  } = trpcReact.result.getExamResultsPagination.useQuery(
    {
      examId: Number(examId),
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

  const data = JSON.parse(unformattedData || 'null') as DataResult;

  if (data && data.totalPages !== totalPages) {
    setTotalPages(data.totalPages);
  }

  console.log(data);

  return (
    <div className="mt-2 flex flex-grow flex-col gap-4 p-8">
      <GoBack params to="/" />
      {error?.message === 'Resultado no encontrado' ? (
        <div className="grid flex-grow place-items-center">No hay Resultados</div>
      ) : (
        <>
          <LoaderContainer examId={Number(examId)} data={data} isLoading={isLoading} />
          <PaginationContainer count={totalPages} />
        </>
      )}
    </div>
  );
}

function LoaderContainer({
  data,
  isLoading
}: {
  examId: number;
  data: DataResult;
  isLoading: boolean;
}) {
  if (isLoading || !data) {
    return (
      <div className="grid flex-grow place-items-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PatientExam patient={data.examResult.result.patient} />
      <PropertyExam exams={data.examResult.exam} />
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
