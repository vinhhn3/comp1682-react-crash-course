/** Everything the app needs to know about where the backend is. */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

/** The mock server in /mock stands in for a real backend. Flip this to false to use fetch. */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
