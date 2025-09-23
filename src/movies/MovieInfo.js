import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../shared/OptimizedImage';

export default function MovieInfo({ movie }) {
  const {
    title,
    image_url,
    description,
    runtime_in_minutes,
    is_showing,
    rating,
    movie_id,
  } = movie;

  return (
    <section className="row mt-4">
      <article className="col-sm-12 col-md-6 col-lg-3">
        <OptimizedImage
          alt={`${title} Poster`}
          className="rounded"
          src={image_url}
        />
      </article>

      <aside className="col-sm-12 col-md-6 col-lg-9">
        <h3 className="font-poppins-heading mb-4">{title}</h3>

        <p>{description}</p>

        <p>
          <strong>Runtime:</strong> {runtime_in_minutes} minutes
        </p>

        <p>
          <strong>Is Showing:</strong> {is_showing ? 'Yes' : 'No'}
        </p>

        <p>
          <strong>Rating:</strong> {rating}
        </p>

        <Link to={`/movies/${movie_id}`} className="btn btn-primary">
          See More
        </Link>
      </aside>
    </section>
  );
}
