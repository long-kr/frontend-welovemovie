import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ErrorAlert from '../shared/ErrorAlert';
import { Loading } from '../ui';
import { movieKeys } from '../utils/api';

function HomePage() {
  const { isLoading, error, data } = useQuery({
    queryKey: movieKeys.lists().queryKey,
    queryFn: movieKeys.lists().queryFn,
  });

  const movies = data?.data || [];

  return (
    <main className="container">
      <ErrorAlert error={error} />

      <h2 className="font-poppins">Now Showing</h2>

      <hr />

      {isLoading ? (
        <Loading />
      ) : (
        <div className="row">
          {movies.map(movie => (
            <article
              key={movie.movie_id}
              className="col-sm-12 col-md-6 col-lg-3 my-2"
            >
              <img
                alt={`${movie.title} Poster`}
                className="rounded"
                src={movie.image_url}
                style={{ width: '100%' }}
              />

              <Link
                to={`/movies/${movie.movie_id}`}
                className="stretched-link text-dark"
              >
                <h3 className="font-poppins-heading text-center mt-2">
                  {movie.title}
                </h3>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default HomePage;
