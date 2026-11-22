import { Header } from './Header';

/** The shell. Step 03: it now has to forward props it does not use. */
export function AppLayout({ page, count, onNavigate, children }) {
  return (
    <div className="shell">
      <Header page={page} count={count} onNavigate={onNavigate} />
      <main className="container">{children}</main>
    </div>
  );
}
