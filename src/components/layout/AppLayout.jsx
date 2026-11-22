import { Header } from './Header';

/** The shell. It renders a header and a slot, and nothing else. */
export function AppLayout({ children }) {
  return (
    <div className="shell">
      <Header />
      <main className="container">{children}</main>
    </div>
  );
}
