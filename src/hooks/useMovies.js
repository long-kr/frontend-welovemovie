import { useQuery } from 'react-query';
import { movieKeys } from '../utils/api';

export const useMovies = (movieId) => {
  const { isLoading, error, data } = useQuery({
    queryKey: movieKeys.detail(movieId).queryKey,
    queryFn: movieKeys.detail(movieId).queryFn,
  });

  return { isLoading, error, movie: data };
};

export const useMoviesList = (params = {}) => {
  const { isLoading, error, data } = useQuery({
    queryKey: movieKeys.lists(params).queryKey,
    queryFn: movieKeys.lists(params).queryFn,
  });

  return {
    isLoading,
    error,
    movies: data?.data || data || [],
    pagination: data?.pagination || null,
  };
};

export const useMoviesShowing = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: movieKeys.showing().queryKey,
    queryFn: movieKeys.showing().queryFn,
  });

  return {
    isLoading,
    error,
    movies: data?.data || data || [],
    pagination: data?.pagination || null,
  };
};
