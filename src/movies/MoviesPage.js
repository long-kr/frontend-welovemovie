import { useQuery } from 'react-query';
import ErrorAlert from '../shared/ErrorAlert';
import { Loading } from '../ui';
import { movieKeys } from '../utils/api';
import MovieInfo from './MovieInfo';

export default function MoviesPage() {
  const { error, isLoading, data } = useQuery({
    queryKey: movieKeys.lists().queryKey,
    queryFn: movieKeys.lists().queryFn,
  });

  const movies = data?.data || [];

  return (
    <main className="container">
      <ErrorAlert error={error} />

      <h2 className="font-poppins">All Movies</h2>

      <hr />

      {isLoading && <Loading />}

      {!isLoading &&
        movies.map(movie => <MovieInfo key={movie.movie_id} movie={movie} />)}
    </main>
  );
}
