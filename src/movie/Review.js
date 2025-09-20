import { markdown } from 'markdown';

const scoreButtonStyle = {
  padding: '0 0px 5px 5px',
};

export default function Review({ review, setReviewScore, isUpdating }) {
  const handleIncreaseClick = () => {
    const score = review.score + 1;
    if (score > 5) return;
    setReviewScore(review, score);
  };

  const handleDecreaseClick = () => {
    const score = review.score - 1;
    if (score < 1) return;
    setReviewScore(review, score);
  };

  const { critic } = review;

  return (
    <section className="border p-4 mb-4">
      <h4>
        {critic?.preferred_name} {critic?.surname}
        <small> of {critic.organization_name}</small>
      </h4>

      <p
        dangerouslySetInnerHTML={{ __html: markdown.toHTML(review.content) }}
      />

      <div className="d-flex">
        <strong>Rating:</strong> <span className="mx-1">{review.score}</span>
        <button
          className="btn btn-link mr-2"
          style={scoreButtonStyle}
          disabled={isUpdating}
          onClick={() => handleIncreaseClick()}
        >
          ↑
        </button>
        <button
          className="btn btn-link mr-2"
          style={scoreButtonStyle}
          disabled={isUpdating}
          onClick={() => handleDecreaseClick()}
        >
          ↓
        </button>
      </div>
    </section>
  );
}
