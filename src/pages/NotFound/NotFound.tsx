import { Link } from 'react-router';

import { ROUTES } from '@/constants';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import './styles/NotFound.css';

export const NotFound = () => {
  useDocumentTitle('Page Not Found');
  return (
    <div className="not-found">
      <h1>404 — Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to={ROUTES.HOME}>Go back to home</Link>
    </div>
  );
};
