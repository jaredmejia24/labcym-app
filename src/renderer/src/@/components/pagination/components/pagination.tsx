import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@renderer/@/components/ui/pagination';
import { usePagination } from '../hooks/use-pagination.hooks';

export type PaginationProps = {
  activePage: number;
  totalPages: number;
  siblingCount?: number;
};
export function Pagination({ activePage, totalPages, siblingCount }: PaginationProps) {
  const pages = usePagination({ currentPage: activePage, totalPages, siblingCount });
  console.log(pages);
  return (
    <PaginationComponent className="flex-grow items-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious search={{ page: activePage - 1 }} disabled={activePage <= 1} params />
        </PaginationItem>
        {pages.map((page) => {
          if (page === 'dots') {
            return <PaginationEllipsis />;
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink search={{ page }} params isActive={activePage === page}>
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            search={{ page: activePage + 1 }}
            disabled={activePage >= totalPages}
            params
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  );
}
