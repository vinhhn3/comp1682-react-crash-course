export function ErrorCard({ title, error, onRetry }) {
  return (
    <div className="error-card" style={{ marginTop: 26 }}>
      <div className="error-card__body">
        <strong>{title}</strong>
        {error?.message ?? 'Something went wrong.'}
      </div>
      {onRetry && (
        <button className="btn btn--ghost" type="button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
