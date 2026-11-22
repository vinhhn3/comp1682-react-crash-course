import { useEffect, useState } from 'react';
import { getEvents, subscribe } from '../../lib/devlog';

/**
 * Open with ?debug=1.
 *
 * It shows two things: the state you chose to expose, and the last eight events
 * across the layers. When a click does nothing, look here before you open DevTools.
 */
export function DevPanel({ info }) {
  const enabled = new URLSearchParams(window.location.search).has('debug');
  const [, bump] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;
    return subscribe(() => bump((n) => n + 1));
  }, [enabled]);

  if (!enabled) return null;

  return (
    <aside className="devpanel">
      <section>
        <h4>state</h4>
        <pre>{JSON.stringify(info, null, 1)}</pre>
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
