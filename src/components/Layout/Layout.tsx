import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router';

import { ROUTES, BUTTONS, NAVIGATION, getCopyrightText } from '@/constants';
import { RootState } from '@/store/store';
import { storage } from '@/utils/storage';
import './styles/Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === ROUTES.LOGIN;

  const handleLogout = () => {
    storage.removeAuthToken();
    navigate(ROUTES.HOME);
    window.location.reload();
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
              <Link className="main-nav-item" to={ROUTES.PROFILE}>
                <i className="fa fa-user-circle" aria-hidden="true"></i>
                {user.firstName}
              </Link>
              <Link className="main-nav-item" to={ROUTES.SETTINGS}>
                <i className="fa fa-gear" aria-hidden="true"></i>
                Settings
              </Link>
              <button className="main-nav-item unstyled-button" onClick={handleLogout}>
                <i className="fa fa-sign-out" aria-hidden="true"></i>
                {BUTTONS.SIGN_OUT}
              </button>
            </>
          ) : (
            <Link className="main-nav-item" to={ROUTES.LOGIN}>
              <i className="fa fa-user-circle" aria-hidden="true"></i>
              {BUTTONS.SIGN_IN}
            </Link>
          )}
        </div>
      </nav>
      <main className={`main ${isLoginPage ? 'bg-dark' : ''}`}>{children}</main>
      <footer className="footer">
        <p className="footer-text">{getCopyrightText()}</p>
      </footer>
    </div>
  );
};
