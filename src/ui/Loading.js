import { useState, useEffect } from "react";

function Loading() {
	const [data, setData] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setData((data) => (data.length < 3 ? data + "." : ""));
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			Spinning up low budge serverless instance, please be patient 😜 {data}
		</div>
	);
}
export default Loading;
