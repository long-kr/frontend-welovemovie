import { useQuery } from 'react-query';
import { movieKeys } from '../utils/api';
/**
 * A custom hook that fetches movie details including reviews and theaters.
 * @param {number} movieId - The ID of the movie to fetch details for.
 * data is structured as { data: movie } where movie includes reviews and theaters.
 */

export const useMovies = movieId => {
  const { isLoading, error, data } = useQuery({
    queryKey: movieKeys.detail(movieId).queryKey,
    queryFn: movieKeys.detail(movieId).queryFn,
  });

  return { isLoading, error, movie: data };
};
