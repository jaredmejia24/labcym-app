import { PatientExam } from '@renderer/@/components/patient/patient-exam';
import { PropertyExam } from '@renderer/@/components/properties/exam-properties';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@renderer/@/components/ui/pagination';
import trpcReact from '@renderer/lib/trpc';
import { createFileRoute } from '@tanstack/react-router';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { searchItemExamSchema } from './index.lazy';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@renderer/@/components/ui/button';

export const Route = createFileRoute('/exams/$examId')({
  component: ItemExam,
  validateSearch: (search) => {
    return searchItemExamSchema.parse(search);
  }
});

function ItemExam() {
  const { examId } = Route.useParams();
  const { idResult, page } = Route.useSearch();
  const [count, setCount] = useState(0);

  const { data } = trpcReact.result.getExamResultsPagination.useQuery(
    {
      examId: Number(examId),
      resultId: idResult,
      page
    },
    {
      onSuccess: (data) => {
        setCount(data.count);
      }
    }
  );

  console.log(data);

  return (
    <div className="mt-2 flex flex-grow flex-col gap-4 p-8">
      <Link to="/">
        <Button className="size-12 rounded-full p-1">
          <ChevronLeft className="text-white" />
        </Button>
      </Link>
      <LoaderContainer examId={Number(examId)} />
      <PaginationContainer count={count} />
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

  return (
    <Pagination className="flex-grow items-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to="/exams/$examId"
            search={{ page: activePage - 1 }}
            disabled={activePage <= 1}
            params
          />
        </PaginationItem>
        {Array.from({ length: count }, (_, page) => (
          <PaginationItem>
            <PaginationLink
              to="/exams/$examId"
              search={{ page: page + 1 }}
              params
              isActive={activePage === page + 1}
            >
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            to="/exams/$examId"
            search={{ page: activePage + 1 }}
            disabled={activePage >= count}
            params
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
