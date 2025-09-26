import React, { useState } from 'react';
import { useMoviesList } from '../hooks/useMovies';
import ErrorAlert from '../shared/ErrorAlert';
import { Loading, Pagination } from '../ui';
import MovieFilters from './MovieFilters';
import MovieInfo from './MovieInfo';

export default function MoviesPage() {
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    sortBy: 'title',
    sortOrder: 'asc',
  });

  const queryParams = { ...filters, ...pagination };
  const {
    error,
    isLoading,
    movies,
    pagination: paginationData,
  } = useMoviesList(queryParams);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (sortOptions) => {
    setPagination((prev) => ({ ...prev, ...sortOptions, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  return (
    <main className="container">
      <ErrorAlert error={error} />

      <h2 className="font-poppins">All Movies</h2>

      <hr />

      {/* Filters and sorting */}
      <MovieFilters
        filters={queryParams}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
      />

      {/* Loading state */}
      {isLoading && <Loading />}

      {/* Movies list */}
      {!isLoading && (
        <>
          {movies.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No movies found matching your criteria.
            </div>
          ) : (
            <>
              {movies.map((movie) => (
                <MovieInfo key={movie.movie_id} movie={movie} />
              ))}

              {/* Pagination */}
              <Pagination
                pagination={paginationData}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            </>
          )}
        </>
      )}
    </main>
  );
}
