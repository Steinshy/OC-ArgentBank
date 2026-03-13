import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="header">
        <nav className="navbar">
          <div className="logo">Argent Bank</div>
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/login">Sign In</a></li>
          </ul>
        </nav>
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2024 Argent Bank. All rights reserved.</p>
      </footer>
    </div>
  );
}
