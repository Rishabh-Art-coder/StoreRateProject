export default function Ratingpicker() {
  return (<>
  <span>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} className={'star' + (n <= (value || 0) ? ' on' : '')}
          aria-label={`${n} stars`} onClick={() => onPick(n)}>★</button>
      ))}
    </span>
  </>)
}