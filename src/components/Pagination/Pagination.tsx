import { ChevronLeft, ChevronRight } from 'lucide-react';
import './styles/Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
  itemsPerPage?: number;
  totalItems?: number;
}

export const Pagination = ({ currentPage, totalPages, maxVisiblePages = 5, itemsPerPage = 7, totalItems }: PaginationProps) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage <= halfVisible + 1) {
      endPage = Math.min(totalPages, maxVisiblePages);
    } else if (currentPage >= totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();
  const displayTotal = totalItems || itemsPerPage * totalPages;

  return (
    <nav className="pagination" aria-label="Pagination">
      <div className="pagination-controls">
        <button className="pagination-btn pagination-arrow" disabled={isFirstPage} aria-label="Previous page">
          <ChevronLeft className="pagination-icon" aria-hidden="true" strokeWidth={2} />
        </button>

        <div className="pagination-numbers">
          {pages.map((page, idx) => (
            <div key={`${page}-${idx}`}>
              {page === '...' ? (
                <span className="pagination-ellipsis">{page}</span>
              ) : (
                <button className={`pagination-btn pagination-number ${page === currentPage ? 'active' : ''}`} disabled={page === currentPage}>
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="pagination-btn pagination-arrow" disabled={isLastPage} aria-label="Next page">
          <ChevronRight className="pagination-icon" aria-hidden="true" strokeWidth={2} />
        </button>
      </div>

      <div className="pagination-info">
        Showing {displayTotal} of {displayTotal} results
      </div>
    </nav>
  );
};
