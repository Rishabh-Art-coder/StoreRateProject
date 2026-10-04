export default function RatingPicker({ value, onPick }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          className={`star${rating <= (value || 0) ? " on" : ""}`}
          aria-label={`Rate ${rating} stars`}
          aria-pressed={rating === value}
          onClick={() => onPick(rating)}
        >★</button>
      ))}
    </span>
  );
}