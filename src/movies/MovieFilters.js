import PropTypes from 'prop-types';
import React, { useState, useCallback, useRef } from 'react';

export default function MovieFilters({
  filters,
  onFiltersChange,
  onSortChange,
}) {
  const [localFilters, setLocalFilters] = useState(filters || {});
  const debounceTimer = useRef(null);

  // Use useCallback with proper dependency handling
  const debouncedFilterChange = useCallback((key, value) => {
    // Clear the previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Update local state immediately for better UX
    const newLocalFilters = { ...localFilters, [key]: value };
    setLocalFilters(newLocalFilters);

    // Debounce the parent callback
    debounceTimer.current = setTimeout(() => {
      onFiltersChange(newLocalFilters);
    }, 500);
  }, [localFilters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    debouncedFilterChange(key, value);
  };

  const handleSortChange = (sortBy, sortOrder) => {
    onSortChange({ sortBy, sortOrder });
  };

  const clearFilters = () => {
    // Clear any pending debounced calls
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(
    (value) => value !== '' && value !== null && value !== undefined
  );

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="card-title mb-0">Filter & Sort Movies</h5>
      </div>
      <div className="card-body">
        <div className="row">
          {/* Title filter */}
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="form-group">
              <label htmlFor="title-filter" className="form-control-label">
                Title
              </label>
              <input
                type="text"
                id="title-filter"
                className="form-control"
                placeholder="Search by title..."
                value={localFilters.title || ''}
                onChange={(e) => handleFilterChange('title', e.target.value)}
              />
            </div>
          </div>

          {/* Rating filter */}
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="form-group">
              <label htmlFor="rating-filter" className="form-control-label">
                Rating
              </label>
              <select
                id="rating-filter"
                className="form-control"
                value={localFilters.rating || ''}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="">All Ratings</option>
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
                <option value="NC-17">NC-17</option>
              </select>
            </div>
          </div>

          {/* Runtime range */}
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="form-group">
              <label htmlFor="min-runtime" className="form-control-label">
                Min Runtime (min)
              </label>
              <input
                type="number"
                id="min-runtime"
                className="form-control"
                placeholder="0"
                min="0"
                value={localFilters.minRuntime || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'minRuntime',
                    e.target.value ? parseInt(e.target.value) : ''
                  )
                }
              />
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-3">
            <div className="form-group">
              <label htmlFor="max-runtime" className="form-control-label">
                Max Runtime (min)
              </label>
              <input
                type="number"
                id="max-runtime"
                className="form-control"
                placeholder="300"
                min="0"
                value={localFilters.maxRuntime || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'maxRuntime',
                    e.target.value ? parseInt(e.target.value) : ''
                  )
                }
              />
            </div>
          </div>

          {/* Showing status */}
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="form-group">
              <label htmlFor="showing-filter" className="form-control-label">
                Showing Status
              </label>
              <select
                id="showing-filter"
                className="form-control"
                value={
                  localFilters.is_showing !== undefined
                    ? localFilters.is_showing.toString()
                    : ''
                }
                onChange={(e) =>
                  handleFilterChange(
                    'is_showing',
                    e.target.value === ''
                      ? undefined
                      : e.target.value === 'true'
                  )
                }
              >
                <option value="">All Movies</option>
                <option value="true">Currently Showing</option>
                <option value="false">Not Showing</option>
              </select>
            </div>
          </div>

          {/* Sort options */}
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="form-group">
              <label htmlFor="sort-by" className="form-control-label">
                Sort By
              </label>
              <select
                id="sort-by"
                className="form-control"
                value={filters?.sortBy || 'title'}
                onChange={(e) =>
                  handleSortChange(e.target.value, filters?.sortOrder || 'asc')
                }
              >
                <option value="title">Title</option>
                <option value="runtime_in_minutes">Runtime</option>
                <option value="rating">Rating</option>
                <option value="created_at">Date Added</option>
                <option value="updated_at">Last Updated</option>
              </select>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-3">
            <div className="form-group">
              <label htmlFor="sort-order" className="form-control-label">
                Sort Order
              </label>
              <select
                id="sort-order"
                className="form-control"
                value={filters?.sortOrder || 'asc'}
                onChange={(e) =>
                  handleSortChange(filters?.sortBy || 'title', e.target.value)
                }
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {/* Clear filters button */}
          <div className="col-md-6 col-lg-3 mb-3 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

MovieFilters.propTypes = {
  filters: PropTypes.shape({
    sortBy: PropTypes.string,
    sortOrder: PropTypes.string,
  }),
  onFiltersChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};