/** Step 03: a controlled input. `value` in, `onChange` out — that is the whole binding. */
export function SearchBar({ value, onChange }) {
  return (
    <div className="search">
      <input
        className="input"
        type="search"
        placeholder="Search products…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
