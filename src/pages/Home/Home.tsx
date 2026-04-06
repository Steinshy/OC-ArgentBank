import { Link } from 'react-router';

import { ROUTES, BUTTONS, HOME_PAGE } from '@/constants';
import { useAppSelector } from '@/store/store';
import './styles/Home.css';

export const Home = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="home">
      <h1>{HOME_PAGE.TITLE}</h1>
      <p>{HOME_PAGE.SUBTITLE}</p>
      <Link to={isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN} className="btn-primary">
        {isAuthenticated ? BUTTONS.VIEW_PROFILE : BUTTONS.SIGN_IN}
      </Link>
    </div>
  );
};
