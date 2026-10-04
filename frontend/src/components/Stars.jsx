export default function Stars({ v = 0 }) {
  const rating = Number(v) || 0;
  return (
    <span aria-label={rating ? `${rating} out of 5 stars` : "No ratings"}>
      <span className="stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => <span key={star}>{star <= Math.round(rating) ? "★" : "☆"}</span>)}
      </span>
      {rating > 0 ? ` ${rating}` : " No ratings"}
    </span>
  );
}