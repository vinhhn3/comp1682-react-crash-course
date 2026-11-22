/**
 * A tiny event bus for the DevPanel.
 *
 * One `logEvent(layer, name, detail)` call per layer, and the dataflow becomes
 * visible on screen. This is a teaching tool, not production code — but the idea
 * (instrument the boundaries, not the internals) is a real debugging technique.
 */

let events = [];
const listeners = new Set();

export function logEvent(layer, name, detail = '') {
  events = [{ layer, name, detail, at: performance.now() }, ...events].slice(0, 8);
  listeners.forEach((fn) => fn());
}

export function getEvents() {
  return events;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
