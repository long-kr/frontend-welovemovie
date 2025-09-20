import { useParams } from 'react-router-dom';
import { useMovies, useReviews } from '../hooks';
import ErrorAlert from '../shared/ErrorAlert';
import Loading from '../ui/Loading';
import Details from './Details';
import ReviewList from './ReviewList';
import TheaterList from './TheaterList';

export default function MoviePage() {
  const { movieId } = useParams();
  const { isLoading, error, movie } = useMovies(movieId);

  const { mutate, isUpdating } = useReviews();

  const updateScoreHandler = async ({ movie_id, review_id }, score) => {
    mutate({ reviewId: review_id, score, movieId: movie_id });
  };

  return (
    <div className="container">
      <ErrorAlert error={error} />

      {isLoading && <Loading />}

      {!isLoading && !error && (
        <section className="row mt-4">
          <article className="col-sm-12 col-md-6 col-lg-3">
            <img
              alt={`${movie.title} Poster`}
              className="rounded"
              src={movie.image_url}
              style={{ width: '100%' }}
            />
          </article>

          <aside className="col-sm-12 col-md-6 col-lg-9">
            <Details movie={movie} />

            <TheaterList theaters={movie.theaters} />

            <ReviewList
              reviews={movie.reviews}
              setReviewScore={updateScoreHandler}
              isUpdating={isUpdating}
            />
          </aside>
        </section>
      )}
    </div>
  );
}
