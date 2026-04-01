import { Link } from 'react-router';

import { ROUTES, BUTTONS, HOME_PAGE } from '@/constants';
import './Home.css';

export function Home() {
  return (
    <div className="home">
      <h1>{HOME_PAGE.TITLE}</h1>
      <p>{HOME_PAGE.SUBTITLE}</p>
      <Link to={ROUTES.LOGIN} className="btn-primary">
        {BUTTONS.SIGN_IN}
      </Link>
    </div>
  );
}
