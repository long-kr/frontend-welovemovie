import Review from './Review';

export default function ReviewList({
  reviews = [],
  onUpdateScore,
  isUpdating,
}) {
  return (
    <section className="mt-4">
      <h3>Reviews</h3>

      {reviews.length ? (
        reviews
          .sort((leftReview, rightReview) => {
            return leftReview.critic.preferred_name.localeCompare(
              rightReview.critic.preferred_name
            );
          })
          .map(review => (
            <Review
              key={review.review_id}
              review={review}
              onUpdateScore={onUpdateScore}
              isLoading={isUpdating}
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
