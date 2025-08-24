import React, { useEffect, useState } from "react";
import DetailedMovie from "./DetailedMovie";
import ErrorAlert from "../shared/ErrorAlert";
import { listMovies } from "../utils/api";
import { Loading } from "../ui";

function DetailedMoviesList() {
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

	const list = movies.map((movie) => (
		<DetailedMovie key={movie.movie_id} movie={movie} />
	));

	return (
		<main className='container'>
			<ErrorAlert error={error} />

			<h2 className='font-poppins'>All Movies</h2>
			<hr />
			{loading ? <Loading /> : list}
		</main>
	);
}

export default DetailedMoviesList;
