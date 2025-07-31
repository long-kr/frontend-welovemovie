import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Details from "./Details";
import ReviewList from "./ReviewList";
import TheaterList from "./TheaterList";
import { deleteReview, readMovie, updateReview } from "../utils/api";
import ErrorAlert from "../shared/ErrorAlert";

function FullMovie() {
	const { movieId } = useParams();
	const [movie, setMovie] = useState({});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	function loadMovie(movieId, signal) {
		setError(null);

		readMovie(movieId, signal)
			.then(setMovie)
			.catch(setError)
			.finally(() => setLoading(false));
	}

	function deleteReviewHandler({ movie_id, review_id }) {
		deleteReview(review_id).then(() => loadMovie(movie_id));
	}

	function updateScoreHandler({ movie_id, review_id }, score) {
		updateReview(review_id, { score }).then(() => loadMovie(movie_id));
	}

	useEffect(() => {
		const abortController = new AbortController();
		setLoading(true);
		loadMovie(movieId, abortController.signal);

		return () => {
			abortController.abort();
		};
	}, [movieId]);

	return (
		<div className='container'>
			<ErrorAlert error={error} />

			{loading && <p>Loading...</p>}

			{!loading && !error && (
				<section className='row mt-4'>
					<article className='col-sm-12 col-md-6 col-lg-3'>
						<img
							alt={`${movie.title} Poster`}
							className='rounded'
							src={movie.image_url}
							style={{ width: "100%" }}
						/>
					</article>
					<aside className='col-sm-12 col-md-6 col-lg-9'>
						<Details movie={movie} />
						<TheaterList theaters={movie.theaters} />
						<ReviewList
							reviews={movie.reviews}
							deleteReview={deleteReviewHandler}
							setReviewScore={updateScoreHandler}
						/>
					</aside>
				</section>
			)}
		</div>
	);
}

export default FullMovie;
