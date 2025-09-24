import { useQuery } from 'react-query';
import { movieKeys } from '../utils/api';

export const useMovies = (movieId) => {
  const { isLoading, error, data } = useQuery({
    queryKey: movieKeys.detail(movieId).queryKey,
    queryFn: movieKeys.detail(movieId).queryFn,
  });

  return { isLoading, error, movie: data };
};
