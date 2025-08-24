import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../shared/ErrorAlert";
import { listMovies } from "../utils/api";
import { Loading } from "../ui";

function MoviesList() {
	const [movies, setMovies] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		setError(null);
		const abortController = new AbortController();
		listMovies(abortController.signal)
			.then(setMovies)
			.catch(setError)
			.finally(() => setLoading(false));

		return () => abortController.abort();
	}, []);

	return (
		<main className='container'>
			<ErrorAlert error={error} />

			<h2 className='font-poppins'>Now Showing</h2>

			<hr />

			{loading ? (
				<Loading />
			) : (
				<div className='row'>
					{movies.map((movie) => (
						<article
							key={movie.movie_id}
							className='col-sm-12 col-md-6 col-lg-3 my-2'
						>
							<img
								alt={`${movie.title} Poster`}
								className='rounded'
								src={movie.image_url}
								style={{ width: "100%" }}
							/>

							<Link
								to={`/movies/${movie.movie_id}`}
								className='stretched-link text-dark'
							>
								<h3 className='font-poppins-heading text-center mt-2'>
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

export default MoviesList;
