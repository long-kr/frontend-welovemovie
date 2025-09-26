import PropTypes from 'prop-types';
import React from 'react';

export default function Pagination({
  pagination,
  onPageChange,
  onLimitChange,
}) {
  if (!pagination) return null;

  const { page, limit, totalPages, totalCount, hasNextPage, hasPreviousPage } =
    pagination;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value);
    onLimitChange(newLimit);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Show pages around current page
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

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

  return (
    <div className="d-flex justify-content-between align-items-center mt-4">
      {/* Results info */}
      <div className="text-muted">
        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)}{' '}
        of {totalCount} movies
      </div>

      {/* Pagination controls */}
      <div className="d-flex align-items-center">
        {/* Items per page selector */}
        <div className="d-flex align-items-center mr-3">
          <label htmlFor="limit-select" className="mb-0 mr-2">
            Show:
          </label>
          <select
            id="limit-select"
            className="form-control form-control-sm"
            style={{ width: 'auto' }}
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Page navigation */}
        <nav aria-label="Movies pagination">
          <ul className="pagination pagination-sm mb-0">
            {/* Previous button */}
            <li className={`page-item ${!hasPreviousPage ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page - 1)}
                disabled={!hasPreviousPage}
                aria-label="Previous page"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>

            {/* Page numbers */}
            {getPageNumbers().map((pageNum, index) => (
              <li
                key={pageNum === '...' ? `ellipsis-${index}` : pageNum}
                className={`page-item ${pageNum === page ? 'active' : ''} ${pageNum === '...' ? 'disabled' : ''}`}
              >
                {pageNum === '...' ? (
                  <span className="page-link">...</span>
                ) : (
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNum)}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={pageNum === page ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                )}
              </li>
            ))}

            {/* Next button */}
            <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page + 1)}
                disabled={!hasNextPage}
                aria-label="Next page"
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    hasNextPage: PropTypes.bool.isRequired,
    hasPreviousPage: PropTypes.bool.isRequired,
  }),
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
};
