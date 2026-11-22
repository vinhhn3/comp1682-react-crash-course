import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { getEvents, subscribe } from '../../lib/devlog';

/**
 * Open with ?debug=1.
 *
 * It shows two things: the state you chose to expose, and the last eight events
 * across the layers. Step 07: the panel reads the cart from context, like any
 * other consumer.
 */
export function DevPanel() {
  const enabled = new URLSearchParams(window.location.search).has('debug');
  const { items, count, total } = useCart();
  const [, bump] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;
    return subscribe(() => bump((n) => n + 1));
  }, [enabled]);

  if (!enabled) return null;

  const snapshot = {
    cartLines: items.length,
    count,
    total: Number(total.toFixed(2)),
  };

  return (
    <aside className="devpanel">
      <section>
        <h4>state</h4>
        <pre>{JSON.stringify(snapshot, null, 1)}</pre>
      </section>

      <section>
        <h4>last events</h4>
        <ol>
          {getEvents().map((event, index) => (
            <li key={`${event.at}-${index}`}>
              <b>{event.layer}</b> {event.name} <small>{event.detail}</small>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
