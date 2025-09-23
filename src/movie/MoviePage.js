import { useParams } from 'react-router-dom';
import { useMovies, useReviews } from '../hooks';
import ErrorAlert from '../shared/ErrorAlert';
import Loading from '../ui/Loading';
import Details from './Details';
import ReviewList from './ReviewList';
import TheaterList from './TheaterList';
import { movieKeys } from '../utils/api';
import { useQueryClient } from 'react-query';

export default function MoviePage() {
  const queryClient = useQueryClient();
  const { movieId } = useParams();
  const { isLoading, error, movie } = useMovies(movieId);

  const { mutate, isUpdating } = useReviews();

  const updateScoreHandler = async ({ review_id }, score) => {
    const data = {
      reviewId: review_id,
      data: { score },
    };

    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries(movieKeys.detail(movieId).queryKey);
      },
    });
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
              onUpdateScore={updateScoreHandler}
              isUpdating={isUpdating}
            />
          </aside>
        </section>
      )}
    </div>
  );
}
