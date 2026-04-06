import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';

import { ROUTES, BUTTONS, NAVIGATION, getCopyrightText } from '@/constants';
import { logoutUser } from '@/features/Auth/authThunks';
import { useGetProfileQuery } from '@/api/argentBankApi';
import { useAppDispatch, useAppSelector } from '@/store/store';
import './styles/Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: user } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignInPage = location.pathname === ROUTES.LOGIN;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate(ROUTES.HOME);
  };

  return (
    <div className="layout">
      <nav className="main-nav" aria-label="Main navigation">
        <Link className="main-nav-logo" to={ROUTES.HOME}>
          <img className="main-nav-logo-image" src="/assets/img/argentBankLogo.png" alt={NAVIGATION.HOME_LOGO_ALT} />
          <h1 className="sr-only">Argent Bank</h1>
        </Link>
        <div className="main-nav-items">
          {isAuthenticated && user ? (
            <>
              <Link className="main-nav-user-cta" to={ROUTES.PROFILE}>
                <i className="fa fa-user-circle" aria-hidden="true" />
                {user.firstName}
              </Link>
              <Link className="main-nav-user-cta" to={ROUTES.SETTINGS}>
                <i className="fa fa-gear" aria-hidden="true" />
                Settings
              </Link>
              <button type="button" className="main-nav-user-cta main-nav-user-cta--logout" onClick={handleLogout}>
                <i className="fa fa-sign-out main-nav-user-cta__icon--danger" aria-hidden="true" />
                {BUTTONS.SIGN_OUT}
              </button>
            </>
          ) : (
            <div className="main-nav-auth">
              <Link className="main-nav-link-sign-in" to={ROUTES.LOGIN}>
                {BUTTONS.SIGN_IN}
              </Link>
              <button type="button" className="main-nav-cta-pill">
                {BUTTONS.REGISTER}
              </button>
            </div>
          )}
        </div>
      </nav>
      <main className={`main ${isSignInPage ? 'bg-dark' : ''}`}>{children}</main>
      <footer className="footer">
        <p className="footer-text">{getCopyrightText()}</p>
      </footer>
    </div>
  );
};
