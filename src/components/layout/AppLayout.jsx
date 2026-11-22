import { Header } from './Header';

/** Step 07: no more forwarding `count`. The shell stopped caring. */
export function AppLayout({ page, onNavigate, children }) {
  return (
    <div className="shell">
      <Header page={page} onNavigate={onNavigate} />
      <main className="container">{children}</main>
    </div>
  );
}
