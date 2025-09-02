import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Details from "./Details";
import ReviewList from "./ReviewList";
import TheaterList from "./TheaterList";
import { readMovie, updateReview } from "../utils/api";
import ErrorAlert from "../shared/ErrorAlert";
import Loading from "../ui/Loading";

function FullMovie() {
	const { movieId } = useParams();
	const [movie, setMovie] = useState({});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	async function loadMovie(movieId, signal) {
		setError(null);
		try {
			const data = await readMovie(movieId, signal);
			setMovie(data);
		} catch (error) {
			setError(error);
		}
		setLoading(false);
	}

	async function updateScoreHandler({ movie_id, review_id }, score) {
		await updateReview(review_id, { score });
		loadMovie(movie_id);
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

			{!loading && <Loading />}

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
							setReviewScore={updateScoreHandler}
						/>
					</aside>
				</section>
			)}
		</div>
	);
}

export default FullMovie;
