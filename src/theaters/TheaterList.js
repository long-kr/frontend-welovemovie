import React, { useEffect, useState } from "react";
import Theater from "./Theater";
import ErrorAlert from "../shared/ErrorAlert";
import { listTheaters } from "../utils/api";
import { Loading } from "../ui";

function TheaterList() {
	const [theaters, setTheaters] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const abortController = new AbortController();
		setLoading(true);
		setError(null);

		listTheaters(abortController.signal)
			.then(setTheaters)
			.catch(setError)
			.finally(() => setLoading(false));

		return () => abortController.abort();
	}, []);

	const list = theaters.map((theater) => (
		<Theater key={theater.theater_id} theater={theater} />
	));

	return (
		<main className='container'>
			<ErrorAlert error={error} />
			<h2 className='font-poppins'>All Theaters</h2>
			<hr />
			{loading ? <Loading /> : <section className='row'>{list}</section>}
		</main>
	);
}

export default TheaterList;
