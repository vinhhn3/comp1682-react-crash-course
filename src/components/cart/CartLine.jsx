export function CartLine({ line, onQty, onRemove }) {
  return (
    <div className="cart-line">
      <div className="cart-line__art" aria-hidden="true">
        {line.emoji}
      </div>

      <div>
        <div className="cart-line__title">{line.title}</div>
        <div className="cart-line__unit">${(line.price_cents / 100).toFixed(2)} each</div>
      </div>

      <div className="row">
        <div className="qty">
          <button type="button" onClick={() => onQty(line.id, line.qty - 1)} aria-label="Decrease quantity">
            −
          </button>
          <span>{line.qty}</span>
          <button type="button" onClick={() => onQty(line.id, line.qty + 1)} aria-label="Increase quantity">
            +
          </button>
        </div>
        <button className="linkbtn" type="button" onClick={() => onRemove(line.id)}>
          Remove
        </button>
      </div>
    </div>
  );
}
