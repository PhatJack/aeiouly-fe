import { useCallback } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationCustomProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  isDisplayNumber?: boolean;
}

const PaginationCustom = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  isDisplayNumber = true,
}: PaginationCustomProps) => {
  // Function to handle page click
  const handlePageClick = useCallback(
    (page: number) => {
      if (page > 0 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    },
    [currentPage, totalPages, onPageChange]
  );

  return (
    <Pagination>
      <PaginationContent>
        {totalPages > 0 && (
          <PaginationItem>
            <PaginationPrevious
              rel="nofollow"
              aria-disabled={currentPage === 1}
              className={`cursor-pointer ${
                currentPage === 1 ? 'pointer-events-none opacity-50' : ''
              }`}
              onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
            />
          </PaginationItem>
        )}
        {isDisplayNumber
          ? [...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <PaginationItem
                  key={page}
                  className={`cursor-pointer ${
                    page === currentPage ? 'bg-primary rounded-md' : ''
                  }`}
                >
                  <PaginationLink onClick={() => handlePageClick(page)}>{page}</PaginationLink>
                </PaginationItem>
              );
            })
          : null}

        {totalPages > 0 && (
          <PaginationItem>
            <PaginationNext
              rel="nofollow"
              aria-disabled={currentPage === totalPages}
              className={`cursor-pointer ${
                currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
              }`}
              onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationCustom;
