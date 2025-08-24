import React from "react";
import Review from "./Review";

function ReviewList({ reviews = [], setReviewScore }) {
	return (
		<section className='mt-4'>
			<h3>Reviews</h3>

			{reviews.length ? (
				reviews
					.sort((leftReview, rightReview) => {
						return leftReview.critic.preferred_name.localeCompare(
							rightReview.critic.preferred_name
						);
					})
					.map((review) => (
						<Review
							key={review.review_id}
							review={review}
							setReviewScore={setReviewScore}
						/>
					))
			) : (
				<div>
					<p>No reviews yet!</p>
				</div>
			)}
		</section>
	);
}

export default ReviewList;
