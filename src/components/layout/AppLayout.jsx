import { Header } from './Header';

/** The shell: every page renders inside it. */
export function AppLayout({ children }) {
  return (
    <div className="shell">
      <Header />
      <main className="container">{children}</main>
    </div>
  );
}
